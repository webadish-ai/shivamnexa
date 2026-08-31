import { CITIES, DEALER } from "@/lib/data";

// Vercel's edge network injects x-vercel-ip-* headers on every request in
// production/preview. Absent in local `next dev`/`next start`.
export const VISITOR_CITY_COOKIE = "visitor_city";

// We only have showrooms in two clusters today — route each served city to
// its nearest cluster rather than requiring a 1:1 city/showroom match.
const CITY_TO_SHOWROOM_CLUSTER: Record<string, string> = {
  mumbai: "Mumbai",
  thane: "Mumbai",
  "navi-mumbai": "Mumbai",
  palghar: "Palghar",
  boisar: "Palghar",
};

export type DetectedCity = {
  slug: string;
  name: string;
  showrooms: (typeof DEALER.showrooms)[number][];
};

// Given a raw IP-geolocated city name (e.g. from x-vercel-ip-city), match it
// against our served cities and resolve the nearest showroom cluster.
export function resolveVisitorCity(rawCityName: string | null | undefined): DetectedCity | null {
  if (!rawCityName) return null;

  let decoded: string;
  try {
    decoded = decodeURIComponent(rawCityName).trim().toLowerCase();
  } catch {
    return null;
  }

  const match = CITIES.find((c) => c.name.toLowerCase() === decoded);
  if (!match) return null;

  const cluster = CITY_TO_SHOWROOM_CLUSTER[match.slug];
  const showrooms = DEALER.showrooms.filter((s) => s.city === cluster);
  if (showrooms.length === 0) return null;

  return { slug: match.slug, name: match.name, showrooms };
}

// Same resolution, but starting from the city slug already stored in a cookie.
export function resolveVisitorCityBySlug(slug: string | null | undefined): DetectedCity | null {
  if (!slug) return null;
  const match = CITIES.find((c) => c.slug === slug);
  if (!match) return null;
  const cluster = CITY_TO_SHOWROOM_CLUSTER[match.slug];
  const showrooms = DEALER.showrooms.filter((s) => s.city === cluster);
  if (showrooms.length === 0) return null;
  return { slug: match.slug, name: match.name, showrooms };
}
