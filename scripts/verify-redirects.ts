// Verify every old WordPress URL resolves (directly or via redirects) to a 200
// on the new site.
//
//   npx tsx scripts/verify-redirects.ts [base-url]
//
// base-url defaults to http://localhost:3010 (next start). Point it at a
// Vercel preview URL before cutover.

import { WORDPRESS_REDIRECTS } from "../src/lib/redirects";

const BASE = (process.argv[2] ?? "http://localhost:3010").replace(/\/$/, "");

// Old URLs that keep their slug on the new site (no redirect entry needed).
const SAME_SLUG_URLS = [
  "/",
  "/about-us",
  "/contact",
  "/nexa-service-center",
  "/service-on-wheels",
  "/buy-used-car",
  "/sell-used-car-best-price",
  "/exchange-your-used-car",
  "/car-insurance",
  "/maruti-suzuki-smart-finance",
  "/maruti-suzuki-nexa-car-subscribe",
  "/nexa-fleet",
  "/maruti-nexa-car-extended-warranty",
  "/maruti-suzuki-driving-school-in-mumbai",
  "/oil-change",
  "/tyre-rotation-replacement",
  "/car-wheel-alignment-and-balancing",
  "/book-a-service-appointment",
  "/pay-now",
  "/book-now",
  "/book-test-drive",
  "/book-a-new-car",
  "/careers",
  "/newsletter",
  "/ceramic-coating",
  "/car-accessories",
  "/maruti-suzuki-connect",
  "/privacy-policy",
  "/terms-and-conditions",
  "/return-refund-policy",
];

async function follow(url: string): Promise<{ status: number; finalUrl: string; hops: number }> {
  let current = url;
  for (let hops = 0; hops < 10; hops++) {
    const res = await fetch(current, { redirect: "manual" });
    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      current = new URL(location, current).href;
      continue;
    }
    return { status: res.status, finalUrl: current, hops };
  }
  return { status: -1, finalUrl: current, hops: 10 };
}

async function main() {
  let failures = 0;

  const checks: { old: string; expected?: string }[] = [
    ...SAME_SLUG_URLS.map((url) => ({ old: url, expected: url === "/" ? undefined : url })),
    ...WORDPRESS_REDIRECTS.filter((r) => !r.source.includes(":")).map((r) => ({
      old: r.source,
      expected: r.destination,
    })),
    // Pattern redirects — one representative each
    { old: "/category/uncategorized", expected: "/blog" },
    { old: "/tag/nexa", expected: "/blog" },
    // WP used trailing slashes — confirm they normalize
    { old: "/about-us/", expected: "/about-us" },
    { old: "/grand-vitara-mumbai/", expected: "/cars/grand-vitara/mumbai" },
  ];

  for (const check of checks) {
    const { status, finalUrl, hops } = await follow(`${BASE}${check.old}`);
    const finalPath = new URL(finalUrl).pathname.replace(/\/$/, "") || "/";
    const expectedPath = check.expected?.replace(/\/$/, "");
    const pathOk = !expectedPath || finalPath === expectedPath;
    const ok = status === 200 && pathOk;
    if (!ok) {
      failures++;
      console.log(`✗ ${check.old} → ${finalPath} (${status}, ${hops} hops)${expectedPath ? ` expected ${expectedPath}` : ""}`);
    } else {
      console.log(`✓ ${check.old} → ${finalPath} (${hops} hops)`);
    }
  }

  console.log(failures === 0 ? `\nAll ${checks.length} URLs OK` : `\n${failures} FAILURES out of ${checks.length}`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
