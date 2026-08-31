"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { resolveVisitorCityBySlug, VISITOR_CITY_COOKIE, type DetectedCity } from "@/lib/geo";

function readCookie(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

function dismissKey(citySlug: string) {
  return `location-banner-dismissed:${citySlug}`;
}

export default function LocationBanner() {
  const [city, setCity] = useState<DetectedCity | null>(null);

  useEffect(() => {
    const slug = readCookie(VISITOR_CITY_COOKIE);
    const detected = resolveVisitorCityBySlug(slug);
    if (!detected) return;
    try {
      if (sessionStorage.getItem(dismissKey(detected.slug))) return;
    } catch {
      // sessionStorage unavailable (private mode etc.) — fall through and show it.
    }
    setCity(detected);
  }, []);

  if (!city) return null;

  const nearest = city.showrooms[0];
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nearest.address)}`;

  return (
    <div className="bg-primary/5 border-b text-sm">
      <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
        <span>
          📍 Browsing from <strong>{city.name}</strong>? Nearest showroom:{" "}
          <strong>{nearest.name}</strong>
        </span>
        <a href={`tel:${nearest.phone}`} className="text-primary font-medium hover:underline">
          {nearest.phone}
        </a>
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium hover:underline"
        >
          Get Directions
        </a>
        <Link href="/contact" className="text-primary font-medium hover:underline">
          Book Test Drive
        </Link>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            try {
              sessionStorage.setItem(dismissKey(city.slug), "1");
            } catch {
              // ignore
            }
            setCity(null);
          }}
          className="ml-1 text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
