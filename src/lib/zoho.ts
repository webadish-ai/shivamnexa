// Zoho CRM connector — self-client refresh-token flow.
// Swapping to another Zoho org (e.g. the dealership's own account) only needs
// new env values:
//   ZOHO_CLIENT_ID / ZOHO_CLIENT_SECRET / ZOHO_REFRESH_TOKEN
//   ZOHO_ACCOUNTS_URL (default https://accounts.zoho.in)
//   ZOHO_API_DOMAIN   (default https://www.zohoapis.in)

export type ZohoLeadInput = {
  name: string;
  mobile: string;
  carName: string;
  type: string;
  location?: string;
  city?: string;
  message?: string;
  source: string;
  pageUrl?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
};

export function isZohoConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_CLIENT_ID &&
      process.env.ZOHO_CLIENT_SECRET &&
      process.env.ZOHO_REFRESH_TOKEN
  );
}

// Access tokens live ~1 hour; cache per warm instance.
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }
  const accountsUrl = process.env.ZOHO_ACCOUNTS_URL ?? "https://accounts.zoho.in";
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    grant_type: "refresh_token",
  });
  const res = await fetch(`${accountsUrl}/oauth/v2/token?${params}`, {
    method: "POST",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Zoho token refresh failed: ${res.status}`);
  }
  const data = (await res.json()) as { access_token?: string; expires_in?: number; error?: string };
  if (!data.access_token) {
    throw new Error(`Zoho token refresh error: ${data.error ?? "no access_token"}`);
  }
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return data.access_token;
}

// Creates a record in the Zoho CRM Leads module. Returns the Zoho record id.
export async function createZohoLead(lead: ZohoLeadInput): Promise<string> {
  const token = await getAccessToken();
  const apiDomain = process.env.ZOHO_API_DOMAIN ?? "https://www.zohoapis.in";

  const descriptionLines = [
    `Enquiry type: ${lead.type}`,
    lead.message ? `Message: ${lead.message}` : null,
    lead.location ? `Location: ${lead.location}` : null,
    lead.city ? `City page: ${lead.city}` : null,
    lead.pageUrl ? `Page: ${lead.pageUrl}` : null,
    lead.utm?.campaign ? `Campaign: ${lead.utm.campaign} (${lead.utm.source ?? "?"}/${lead.utm.medium ?? "?"})` : null,
  ].filter(Boolean);

  const record = {
    Last_Name: lead.name,
    Mobile: lead.mobile,
    Company: "Individual",
    Lead_Source: lead.source === "chatbot" ? "Website Chatbot" : "Website",
    Description: descriptionLines.join("\n"),
    // Standard-ish fields; map to custom fields once the target org is finalized.
    Industry: "Automotive",
    ...(lead.city ? { City: lead.city } : {}),
  };

  const res = await fetch(`${apiDomain}/crm/v2/Leads`, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: [record], trigger: ["workflow"] }),
    cache: "no-store",
  });

  const body = (await res.json().catch(() => null)) as {
    data?: { code: string; details?: { id?: string }; message?: string }[];
  } | null;

  const first = body?.data?.[0];
  if (!res.ok || first?.code !== "SUCCESS" || !first.details?.id) {
    throw new Error(
      `Zoho lead create failed: ${res.status} ${first?.code ?? ""} ${first?.message ?? ""}`.trim()
    );
  }
  return first.details.id;
}
