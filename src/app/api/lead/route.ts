import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { DEALER } from "@/lib/data";
import { deliverLead, saveLead, validateLead, type LeadRequest } from "@/lib/leads";

export const runtime = "nodejs";

// Best-effort per-IP throttle (per warm instance). Real abuse protection can
// layer Vercel WAF/BotID on top without code changes.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) hits.clear();
  return recent.length > RATE_LIMIT;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadRequest & { website?: string };
    const headerStore = await headers();
    const ipAddress = (headerStore.get("x-forwarded-for") ?? "").split(",")[0]?.trim() ?? "";

    // Honeypot: the visible form never fills this field; bots do.
    if (body.website) {
      return NextResponse.json({ ok: true, message: "Thanks." });
    }

    if (ipAddress && isRateLimited(ipAddress)) {
      return NextResponse.json(
        { error: "Too many requests. Please call us instead." },
        { status: 429 }
      );
    }

    const lead = validateLead(body);
    lead.userAgent = headerStore.get("user-agent") ?? "";
    lead.ipAddress = ipAddress;

    // Persist first — delivery failures must never lose the lead.
    let leadId: string;
    try {
      leadId = await saveLead(lead);
    } catch (error) {
      console.error("Lead persistence failed", { error });
      // Last resort: still attempt direct delivery so the lead reaches someone.
      await deliverLead("unsaved", lead).catch(() => {});
      return NextResponse.json({
        ok: true,
        message: `Thanks. ${DEALER.shortName} will contact you shortly.`,
      });
    }

    await deliverLead(leadId, lead);

    return NextResponse.json({
      ok: true,
      message: `Thanks. ${DEALER.shortName} will contact you shortly.`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "We could not process your enquiry right now.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
