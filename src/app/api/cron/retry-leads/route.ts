import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import { deliverLead, type LeadPayload } from "@/lib/leads";

export const runtime = "nodejs";
export const maxDuration = 120;

// Re-attempts Zoho/email delivery for leads that failed (or were skipped
// because the channel wasn't configured yet). Scheduled via vercel.json crons;
// Vercel sends Authorization: Bearer ${CRON_SECRET}.

type StoredLead = LeadPayload & { _id: string };

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads: StoredLead[] = await sanityClient.fetch(
    `*[_type == "lead"
        && (emailStatus in ["failed", "pending", "skipped"] || zohoStatus in ["failed", "pending", "skipped"])
        && submittedAt > $since
      ] | order(submittedAt asc) [0...25] {
      _id, name, mobile, car, carName, location, message, type, city,
      pageUrl, submittedAt, source, utm, userAgent, ipAddress
    }`,
    { since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }
  );

  const results = [];
  for (const { _id, ...lead } of leads) {
    const outcome = await deliverLead(_id, lead as LeadPayload);
    results.push({ id: _id, ...outcome });
  }

  return NextResponse.json({ retried: results.length, results });
}
