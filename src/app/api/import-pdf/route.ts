import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanity";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const PROMPT = `You are parsing a Maruti Suzuki NEXA dealership price list PDF.
Extract all car variants with their ex-showroom prices.
Return ONLY a valid JSON array with this exact shape (no markdown, no explanation):
[
  {
    "carSlug": "xl6",
    "carName": "XL6",
    "variants": [
      { "name": "Zeta MT", "exShowroom": 1152300, "fuelType": "Petrol", "transmission": "Manual" }
    ]
  }
]
Valid carSlug values: xl6, grand-vitara, jimny, fronx, baleno, invicto, e-vitara
Valid fuelType values: Petrol, CNG, Diesel, Electric, Hybrid
Valid transmission values: Manual, Automatic, AMT`;

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 503 });
  }

  const formData = await req.formData();
  const file = formData.get("pdf") as File | null;
  if (!file) return NextResponse.json({ error: "No PDF uploaded" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  // Send PDF to Gemini
  const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: PROMPT },
            { inline_data: { mime_type: "application/pdf", data: base64 } },
          ],
        },
      ],
    }),
  });

  if (!geminiRes.ok) {
    const err = await geminiRes.text();
    return NextResponse.json({ error: `Gemini error: ${err}` }, { status: 502 });
  }

  const geminiData = await geminiRes.json();
  const rawText: string = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  let parsed: Array<{ carSlug: string; carName: string; variants: unknown[] }>;
  try {
    parsed = JSON.parse(rawText.trim());
  } catch {
    return NextResponse.json({ error: "Failed to parse Gemini response", raw: rawText }, { status: 422 });
  }

  // Dry-run: just return parsed data for preview
  const apply = formData.get("apply") === "true";
  if (!apply) {
    return NextResponse.json({ preview: parsed });
  }

  // Write to Sanity — patch each car's variants and startingPrice
  const results: string[] = [];
  for (const item of parsed) {
    const doc = await sanityWriteClient.fetch(
      `*[_type == "car" && slug.current == $slug][0]{ _id }`,
      { slug: item.carSlug }
    );
    if (!doc?._id) {
      results.push(`SKIP: no car found for slug "${item.carSlug}"`);
      continue;
    }
    const prices = (item.variants as Array<{ exShowroom: number }>).map((v) => v.exShowroom);
    const startingPrice = Math.min(...prices);
    await sanityWriteClient
      .patch(doc._id)
      .set({ variants: item.variants, startingPrice })
      .commit();
    results.push(`OK: updated ${item.carName} (${item.variants.length} variants)`);
  }

  return NextResponse.json({ results });
}
