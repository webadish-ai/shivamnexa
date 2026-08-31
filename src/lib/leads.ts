// Shared lead pipeline: validate → persist (Sanity) → deliver (Zoho CRM + email).
// Persistence happens FIRST so a delivery outage never loses a lead; the retry
// cron (/api/cron/retry-leads) re-attempts failed deliveries.
// Used by /api/lead, the chatbot's captureLead tool, and the retry cron.

import { CARS } from "./data";
import { sanityWriteClient } from "./sanity";
import { createZohoLead, isZohoConfigured } from "./zoho";

export type LeadType = "test-drive" | "quote" | "contact" | "exchange" | "brochure";

export type Utm = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
};

export type LeadRequest = {
  name?: string;
  mobile?: string;
  car?: string;
  location?: string;
  message?: string;
  type?: string;
  city?: string;
  pageUrl?: string;
  utm?: Utm;
  source?: string;
};

export type LeadPayload = {
  name: string;
  mobile: string;
  car: string;
  carName: string;
  location: string;
  message: string;
  type: LeadType;
  city: string;
  pageUrl: string;
  submittedAt: string;
  source: "website" | "chatbot";
  utm?: Utm;
  userAgent: string;
  ipAddress: string;
};

export type DeliveryStatus = "pending" | "sent" | "failed" | "skipped";

const VALID_TYPES = new Set<string>(["test-drive", "quote", "contact", "exchange", "brochure"]);

function getCarName(carSlug: string) {
  return CARS.find((car) => car.slug === carSlug)?.fullName ?? carSlug;
}

function sanitizeText(value: string, maxLength: number) {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function sanitizeUtm(utm?: Utm): Utm | undefined {
  if (!utm) return undefined;
  const clean: Utm = {};
  for (const key of ["source", "medium", "campaign", "term", "content"] as const) {
    const value = utm[key];
    if (typeof value === "string" && value.trim()) {
      clean[key] = sanitizeText(value, 120);
    }
  }
  return Object.keys(clean).length > 0 ? clean : undefined;
}

export function validateLead(body: LeadRequest): LeadPayload {
  const name = sanitizeText(body.name ?? "", 100);
  const mobile = (body.mobile ?? "").replace(/\D/g, "").slice(-10);
  const car = sanitizeText(body.car ?? "", 50);
  const location = sanitizeText(body.location ?? "", 120);
  const message = sanitizeText(body.message ?? "", 1000);
  const type = VALID_TYPES.has(body.type ?? "") ? (body.type as LeadType) : "contact";
  const city = sanitizeText(body.city ?? "", 80);
  const pageUrl = sanitizeText(body.pageUrl ?? "", 500);

  if (name.length < 2) {
    throw new Error("Please enter your full name.");
  }
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    throw new Error("Please enter a valid 10-digit mobile number.");
  }
  if (!car) {
    throw new Error("Please select a car model.");
  }

  return {
    name,
    mobile,
    car,
    carName: getCarName(car),
    location,
    message,
    type,
    city,
    pageUrl,
    submittedAt: new Date().toISOString(),
    source: body.source === "chatbot" ? "chatbot" : "website",
    utm: sanitizeUtm(body.utm),
    userAgent: "",
    ipAddress: "",
  };
}

// ── Persistence (Sanity) ─────────────────────────────────────────

export async function saveLead(lead: LeadPayload): Promise<string> {
  const doc = await sanityWriteClient.create({
    _type: "lead",
    ...lead,
    pageUrl: lead.pageUrl || undefined,
    emailStatus: "pending",
    zohoStatus: "pending",
    followUpStatus: "new",
  });
  return doc._id;
}

// ── Delivery (Zoho + Resend), status patched per channel ────────

export async function deliverLead(leadId: string, lead: LeadPayload): Promise<{
  emailStatus: DeliveryStatus;
  zohoStatus: DeliveryStatus;
}> {
  let emailStatus: DeliveryStatus = "skipped";
  let zohoStatus: DeliveryStatus = "skipped";
  let zohoLeadId: string | undefined;

  if (isZohoConfigured()) {
    try {
      zohoLeadId = await createZohoLead(lead);
      zohoStatus = "sent";
    } catch (error) {
      zohoStatus = "failed";
      console.error("Zoho delivery failed", { leadId, error });
    }
  }

  if (process.env.RESEND_API_KEY && process.env.LEAD_TO_EMAIL && process.env.LEAD_FROM_EMAIL) {
    try {
      await sendViaResend(lead);
      emailStatus = "sent";
    } catch (error) {
      emailStatus = "failed";
      console.error("Resend delivery failed", { leadId, error });
    }
  }

  try {
    await sanityWriteClient
      .patch(leadId)
      .set({ emailStatus, zohoStatus, ...(zohoLeadId ? { zohoLeadId } : {}) })
      .commit();
  } catch (error) {
    console.error("Failed to update lead delivery status", { leadId, error });
  }

  return { emailStatus, zohoStatus };
}

// ── Email (Resend) ───────────────────────────────────────────────

function buildLeadEmailHtml(lead: LeadPayload) {
  const fields = [
    ["Lead Type", lead.type],
    ["Customer Name", lead.name],
    ["Mobile", lead.mobile],
    ["Car Model", lead.carName],
    ["Location", lead.location || "Not provided"],
    ["City Page", lead.city || "Not provided"],
    ["Message", lead.message || "Not provided"],
    ["Page URL", lead.pageUrl || "Not provided"],
    ["Source", lead.source],
    ["Campaign", lead.utm?.campaign ?? "—"],
    ["Submitted At", lead.submittedAt],
    ["IP Address", lead.ipAddress || "Unknown"],
  ];

  const rows = fields
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:600;">${label}</td><td style="padding:8px;border:1px solid #ddd;">${value}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#111;">
      <h2>New Shivam NEXA Lead</h2>
      <table style="border-collapse:collapse;width:100%;max-width:720px;">${rows}</table>
    </div>
  `;
}

async function sendViaResend(lead: LeadPayload) {
  const subjectMap: Record<LeadType, string> = {
    "test-drive": "New Test Drive Lead",
    quote: "New Price Quote Lead",
    contact: "New Contact Lead",
    exchange: "New Exchange / Old Car Valuation Lead",
    brochure: "New Brochure Download Lead",
  };

  const from = process.env.LEAD_FROM_EMAIL!;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [process.env.LEAD_TO_EMAIL],
      reply_to: [process.env.LEAD_REPLY_TO_EMAIL || from],
      subject: `${subjectMap[lead.type]} — ${lead.carName} — ${lead.name}`,
      html: buildLeadEmailHtml(lead),
      text: [
        `Lead Type: ${lead.type}`,
        `Customer Name: ${lead.name}`,
        `Mobile: ${lead.mobile}`,
        `Car Model: ${lead.carName}`,
        `Location: ${lead.location || "Not provided"}`,
        `City Page: ${lead.city || "Not provided"}`,
        `Message: ${lead.message || "Not provided"}`,
        `Page URL: ${lead.pageUrl || "Not provided"}`,
        `Source: ${lead.source}`,
        `Submitted At: ${lead.submittedAt}`,
      ].join("\n"),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Resend delivery failed with status ${response.status}.`);
  }
}
