import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Sanity sends a POST with a secret header when content changes.
// Configure in Sanity: Dashboard → API → Webhooks
// URL: https://shivamnexa.com/api/revalidate
// HTTP method: POST
// Secret: set SANITY_WEBHOOK_SECRET env var and add it as a header "x-sanity-secret"

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-sanity-secret");
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const type: string = body._type ?? "";
  const slug: string = body.slug?.current ?? "";

  if (type === "car" && slug) {
    // Revalidate all city pages for this car model
    revalidatePath(`/cars/${slug}/[city]`, "page");
    revalidatePath("/cars", "page");
    revalidatePath("/", "page");
    return NextResponse.json({ revalidated: [`/cars/${slug}/*`] });
  }

  if (type === "city") {
    // Revalidate all car×city pages
    revalidatePath("/cars/[model]/[city]", "page");
    return NextResponse.json({ revalidated: ["/cars/*/*"] });
  }

  // Fallback: revalidate everything
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: ["/"] });
}
