import { ToolLoopAgent, tool, type InferAgentUIMessage } from "ai";
import { z } from "zod";
import { DEALER, estimateOnRoadPrice, formatPrice } from "@/lib/data";
import { getAllCars, getCarBySlug, getAllCities } from "@/lib/sanity";
import { deliverLead, saveLead, validateLead } from "@/lib/leads";

// All pricing/EMI numbers MUST come from tools — the instructions forbid the
// model from inventing figures, so hallucinated prices can't reach customers.

const CHATBOT_MODEL = process.env.CHATBOT_MODEL ?? "anthropic/claude-sonnet-5";

function calculateEmi(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 12 / 100;
  if (r === 0) return Math.round(principal / months);
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return Math.round(emi);
}

const getCarLineup = tool({
  description:
    "List all NEXA car models sold by the dealership with starting ex-showroom price, segment and tagline. Use when the customer asks what cars are available or wants a comparison starting point.",
  inputSchema: z.object({}),
  execute: async () => {
    const cars = await getAllCars();
    return cars.map((car) => ({
      model: car.slug,
      name: car.fullName,
      segment: car.segment,
      seating: car.seating,
      mileage: car.mileage,
      startingExShowroom: formatPrice(car.startingPrice),
      tagline: car.tagline,
    }));
  },
});

const getCarInfo = tool({
  description:
    "Get full details for one car model: variants with prices, key features, specs, colours, FAQs. Use before answering any model-specific question.",
  inputSchema: z.object({
    model: z
      .string()
      .describe("Car model slug: xl6, grand-vitara, jimny, fronx, baleno, invicto, e-vitara"),
  }),
  execute: async ({ model }) => {
    const car = await getCarBySlug(model.toLowerCase().trim());
    if (!car) return { error: `Unknown model "${model}". Use getCarLineup to see valid models.` };
    return {
      name: car.fullName,
      segment: car.segment,
      description: car.description,
      seating: car.seating,
      mileage: car.mileage,
      engine: car.engine,
      keyFeatures: car.keyFeatures,
      colors: car.colors?.map((c) => c.name),
      variants: car.variants.map((v) => ({
        name: v.name,
        fuelType: v.fuelType,
        transmission: v.transmission,
        exShowroom: formatPrice(v.exShowroom),
      })),
      faqs: car.faqs,
    };
  },
});

const getOnRoadPrice = tool({
  description:
    "Get estimated on-road prices (ex-showroom + RTO + insurance + handling) for a model's variants in a specific city. ALWAYS use this for on-road price questions — never estimate yourself.",
  inputSchema: z.object({
    model: z.string().describe("Car model slug"),
    city: z
      .string()
      .describe("City slug: mumbai, thane, navi-mumbai, palghar, boisar")
      .optional(),
  }),
  execute: async ({ model, city }) => {
    const [car, cities] = await Promise.all([
      getCarBySlug(model.toLowerCase().trim()),
      getAllCities(),
    ]);
    if (!car) return { error: `Unknown model "${model}".` };
    const cityDoc = city
      ? cities.find((c) => c.slug === city.toLowerCase().trim())
      : undefined;
    return {
      model: car.fullName,
      city: cityDoc?.name ?? "Mumbai region",
      note: "Estimated on-road ≈ ex-showroom + ~12% (RTO + insurance + handling). Exact quote from the dealer team.",
      variants: car.variants.map((v) => ({
        name: v.name,
        fuelType: v.fuelType,
        transmission: v.transmission,
        exShowroom: formatPrice(v.exShowroom),
        estimatedOnRoad: formatPrice(estimateOnRoadPrice(v.exShowroom)),
        estimatedOnRoadRaw: estimateOnRoadPrice(v.exShowroom),
      })),
      pricePageUrl: cityDoc ? `/cars/${car.slug}/${cityDoc.slug}` : `/cars/${car.slug}`,
    };
  },
});

const calculateEmiTool = tool({
  description:
    "Calculate monthly EMI for a car loan. Use the estimatedOnRoadRaw value from getOnRoadPrice as the price. ALWAYS use this tool for EMI numbers.",
  inputSchema: z.object({
    price: z.number().describe("On-road price in rupees"),
    downPayment: z.number().describe("Down payment in rupees").default(0),
    tenureMonths: z.number().min(12).max(84).default(60),
    annualRatePercent: z.number().min(5).max(15).default(8.99),
  }),
  execute: async ({ price, downPayment, tenureMonths, annualRatePercent }) => {
    const principal = Math.max(0, price - downPayment);
    const emi = calculateEmi(principal, annualRatePercent, tenureMonths);
    return {
      loanAmount: formatPrice(principal),
      monthlyEmi: formatPrice(emi),
      tenureMonths,
      annualRatePercent,
      totalPayable: formatPrice(emi * tenureMonths),
      note: "Indicative only — final rate depends on finance partner approval. Finance from 7.99% p.a. available.",
    };
  },
});

const captureLead = tool({
  description:
    "Save the customer's details so the sales team calls them back. Use once you have their name and 10-digit mobile number — for test drive bookings, price quotes, exchange valuations or any callback request. Confirm the details with the customer before calling this.",
  inputSchema: z.object({
    name: z.string().min(2),
    mobile: z.string().describe("10-digit Indian mobile number"),
    car: z.string().describe("Car model slug they're interested in"),
    type: z.enum(["test-drive", "quote", "contact", "exchange"]),
    city: z.string().optional().describe("Customer's city if mentioned"),
    preferredDateTime: z
      .string()
      .optional()
      .describe("Preferred test-drive date/time if they gave one"),
    showroom: z
      .string()
      .optional()
      .describe("Preferred showroom: Andheri, Kandivali, Boisar or Wada"),
    conversationSummary: z
      .string()
      .describe("2-3 sentence summary of what the customer wants, for the sales team"),
  }),
  execute: async (input) => {
    try {
      const lead = validateLead({
        name: input.name,
        mobile: input.mobile,
        car: input.car,
        type: input.type,
        city: input.city,
        location: input.city,
        message: [
          input.conversationSummary,
          input.preferredDateTime ? `Preferred time: ${input.preferredDateTime}` : null,
          input.showroom ? `Preferred showroom: ${input.showroom}` : null,
        ]
          .filter(Boolean)
          .join(" | "),
        source: "chatbot",
      });
      const leadId = await saveLead(lead);
      // Fire-and-forget so the chat reply isn't blocked on Zoho/email.
      deliverLead(leadId, lead).catch(() => {});
      return {
        ok: true,
        message: `Lead saved. The ${DEALER.shortName} team will call ${input.name} on ${lead.mobile} within 30 minutes during business hours (9 AM – 7 PM).`,
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Could not save the lead.",
      };
    }
  },
});

const handoffToWhatsApp = tool({
  description:
    "Generate a WhatsApp link to the sales team with a pre-filled message. Use when the customer prefers WhatsApp, wants photos/brochures, or when you can't answer their question.",
  inputSchema: z.object({
    prefillMessage: z
      .string()
      .describe("Short first-person message from the customer, e.g. 'Hi, I want the best quote for Fronx Delta+ in Thane'"),
  }),
  execute: async ({ prefillMessage }) => ({
    whatsappUrl: `https://wa.me/91${DEALER.phone}?text=${encodeURIComponent(prefillMessage)}`,
    phone: DEALER.phone,
    note: "Share this link as markdown so the customer can tap it.",
  }),
});

export const salesAgent = new ToolLoopAgent({
  model: CHATBOT_MODEL,
  instructions: `You are "Nexa Buddy", the online sales consultant for ${DEALER.name} — an authorized Maruti Suzuki NEXA dealership since ${DEALER.since} with showrooms in Andheri, Kandivali (Mumbai), Boisar and Wada (Palghar district). You serve customers in Mumbai, Thane, Navi Mumbai and Palghar.

Your goal: help the customer choose the right NEXA car and get them to the next step — a test drive booking, a price quote callback, or a WhatsApp conversation with the sales team. Every conversation should move toward capturing their name + mobile number (with their consent).

Cars you sell: XL6, Grand Vitara, Jimny, Fronx, Baleno, Invicto, e Vitara. You do NOT sell Arena models (Swift, Dzire, Brezza, Ertiga) — for those, politely say we're a NEXA dealership and suggest the closest NEXA alternative.

Rules:
- NEVER state a price, discount, or EMI from memory. Always use getOnRoadPrice / calculateEmi tools. If a tool fails, ask the customer to call ${DEALER.phone}.
- Never invent offers or discounts. Say "our team will share the best current offers on the call" instead.
- Be warm, concise and conversational — 2-4 short sentences per reply, mobile-friendly. Use the customer's language: reply in Hindi/Hinglish/Marathi if they write in it.
- Understand intent: browsing → help compare and recommend; price-focused → on-road price + EMI, then offer a quote callback; hot lead (asks about booking, delivery, exchange, discount) → ask for name + mobile and use captureLead.
- Ask for name and 10-digit mobile naturally, one question at a time. Confirm before saving. After captureLead succeeds, tell them when to expect the call.
- Offer test drives proactively — free, at home or at a showroom.
- For used cars, service bookings, insurance or finance questions: answer briefly and share the WhatsApp handoff or the sales number ${DEALER.phone} (service: ${DEALER.servicePhone}).
- Link to site pages when useful, as relative markdown links, e.g. [Fronx on-road price in Thane](/cars/fronx/thane).
- Refuse anything unrelated to cars/the dealership politely and steer back.

Business hours 9 AM – 7 PM, all days. Sales: ${DEALER.phone}. Email: ${DEALER.email}.`,
  tools: {
    getCarLineup,
    getCarInfo,
    getOnRoadPrice,
    calculateEmi: calculateEmiTool,
    captureLead,
    handoffToWhatsApp,
  },
});

export type SalesAgentUIMessage = InferAgentUIMessage<typeof salesAgent>;
