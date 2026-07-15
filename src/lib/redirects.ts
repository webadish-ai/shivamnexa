// 301 map for WordPress URLs (shivamnexa.com) whose location changed on this site.
// Pages migrated 1:1 keep their WP slug and need no entry here.
// Source of truth: Yoast sitemaps captured 2026-07-09 (page-sitemap.xml, post-sitemap.xml).
// Verify with: npx tsx scripts/verify-redirects.ts <base-url>

type Redirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

// Old WP blog posts lived at the root; they move under /blog/.
// /nexa-service-center and /service-on-wheels are intentionally absent — they
// remain top-level pages on this site at the same slug.
export const BLOG_POST_SLUGS = [
  "maruti-suzuki-s-assist-your-personal-car-assistant-with-voice",
  "best-and-affordable-maruti-suzuki-suv-cars-india",
  "xl6-the-premium-6-seater-by-nexa",
  "maruti-suzuki-e-vitara-the-game-changing-electric-suv",
  "book-maruti-nexa-fleet-in-mumbai-2",
  "car-tracking-app",
  "maruti-suzuki-service-on-wheels-doorstep-car-repair-service",
  "maruti-suzuki-smartplay-infotainment-system",
  "what-is-smart-hybrid-technology-in-cars-shivam-nexa",
  "which-car-to-buy-post-lockdown",
  "pre-monsoon-car-service-tips",
  "gst-cut-benefits-on-nexa-cars",
  "why-should-you-upgrade-to-a-nexa-car",
  "no-gears-no-hassle-experience-nexa-automatic-cars",
  "7-big-reasons-to-buy-or-upgrade-to-nexa-car-this-december",
  "is-the-grand-vitara-strong-hybrid-worth-buying-in-2026-full-guide",
  "maruti-nexa-suv-e-vitara-baas-vs-full-ownership",
  "maruti-e-vitara-price-and-features",
  "maruti-e-vitara-ev-future",
  "what-is-maruti-suzuki-smart-finance-how-easy-is-it-to-use",
  "maruti-e-vitara-dealer-mumbai",
  "maruti-suzuki-nexa-price-increase-from-june-2026",
  "maruti-suzuki-eco-friendly-cars-mumbai-environment",
  "nexa-suv-buying-guide",
  "nexa-monsoon-car-service-mumbai-thane-palghar",
  // Older posts not in the Yoast sitemap but still live on the WP API
  "maruti-suzuki-super-carry-truck-price-mileage-features-cng-petrol",
  "maruti-suzuki-ciaz-2018",
  "why-regular-car-service-is-important",
  "maruti-suzuki-arena",
  "the-unique-ride-for-the-new-generation-maruti-baleno",
  "best-mileage-cars-india-2018",
  "car-maintenance-tips",
];

const PAGE_REDIRECTS: Redirect[] = [
  // Per-model booking pages → model pages
  { source: "/book-maruti-suzuki-xl6-car", destination: "/cars/xl6", permanent: true },
  { source: "/book-maruti-suzuki-baleno-car", destination: "/cars/baleno", permanent: true },
  { source: "/book-maruti-suzuki-jimny-car", destination: "/cars/jimny", permanent: true },
  { source: "/book-maruti-suzuki-fronx-car", destination: "/cars/fronx", permanent: true },
  { source: "/book-maruti-suzuki-grand-vitara-car", destination: "/cars/grand-vitara", permanent: true },
  { source: "/book-maruti-suzuki-e-vitara-car", destination: "/cars/e-vitara", permanent: true },
  { source: "/book-maruti-invicto-car", destination: "/cars/invicto", permanent: true },
  { source: "/e-vitara", destination: "/cars/e-vitara", permanent: true },

  // City landing pages → model×city pages
  { source: "/grand-vitara-mumbai", destination: "/cars/grand-vitara/mumbai", permanent: true },
  { source: "/grand-vitara-landing-page", destination: "/cars/grand-vitara/mumbai", permanent: true },
  { source: "/grand-vitara-kandivali", destination: "/cars/grand-vitara/mumbai", permanent: true },
  { source: "/grand-vitara-on-road-price-thane", destination: "/cars/grand-vitara/thane", permanent: true },
  // Unlisted (noindex) ads landing pages that still resolve on WP
  { source: "/grand-vitara-suv-on-road-price-in-mumbai", destination: "/cars/grand-vitara/mumbai", permanent: true },
  { source: "/grand-vitara-suv-on-road-price-in-thane", destination: "/cars/grand-vitara/thane", permanent: true },
  { source: "/grand-vitara-palghar", destination: "/cars/grand-vitara/palghar", permanent: true },
  { source: "/maruti-suzuki-grand-vitara-suv-palghar", destination: "/cars/grand-vitara/palghar", permanent: true },
  { source: "/e-vitara-in-palghar", destination: "/cars/e-vitara/palghar", permanent: true },
  { source: "/thank-you-grand-vitara-suv-on-road-price-in-palghar", destination: "/thank-you", permanent: true },
  // Old model blog post consolidated into the model page
  { source: "/maruti-suzuki-baleno", destination: "/cars/baleno", permanent: true },

  // Renamed pages
  { source: "/maruti-suzuki-nexa-cars", destination: "/cars", permanent: true },
  { source: "/award-winning-nexa-dealer", destination: "/awards", permanent: true },
  { source: "/shivam-outlet-location", destination: "/contact", permanent: true },
  { source: "/book-maruti-nexa-car-service-center", destination: "/nexa-service-center", permanent: true },

  // WP taxonomy/utility URLs
  { source: "/category/blog", destination: "/blog", permanent: true },
  { source: "/category/:slug", destination: "/blog", permanent: true },
  { source: "/tag/:slug", destination: "/blog", permanent: true },
  { source: "/author/:slug", destination: "/about-us", permanent: true },
  { source: "/sitemap", destination: "/", permanent: true },

  // Stale campaign / thank-you pages
  { source: "/august-offer-thank-you", destination: "/", permanent: true },
  { source: "/thank-you-page", destination: "/thank-you", permanent: true },
  { source: "/thankyou-grand-vitara-landing-page", destination: "/thank-you", permanent: true },
  { source: "/shivam-signature-limited-edition", destination: "/cars", permanent: true },
];

export const WORDPRESS_REDIRECTS: Redirect[] = [
  ...PAGE_REDIRECTS,
  ...BLOG_POST_SLUGS.map((slug) => ({
    source: `/${slug}`,
    destination: `/blog/${slug}`,
    permanent: true,
  })),
];
