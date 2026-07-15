import type { Metadata } from "next";
import Link from "next/link";
import { getAbsoluteUrl } from "@/lib/site";
import { SHOWCASE_MODELS } from "@/lib/showcase";

export const metadata: Metadata = {
  title: "Hero Video Showcase",
  description:
    "Internal-only concept page exploring hero video directions using locally hosted official NEXA motion for three premium models.",
  alternates: { canonical: getAbsoluteUrl("/showcase/hero-video") },
  robots: { index: false, follow: false },
};

export default function HeroVideoShowcasePage() {
  return (
    <div className="bg-[#05070b] text-white">
      <div className="w-full px-4 py-12 md:px-8 md:py-16 xl:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/55">
            Client Showcase
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Three official NEXA video showcase directions
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/72 md:text-lg">
            I have now split the concept into three separate premium showcase routes using
            locally hosted official NEXA motion bundles. This makes the comparison clearer for
            the client: EV future-luxury, SUV prestige, and sporty urban premium.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {SHOWCASE_MODELS.map((model) => (
              <Link
                key={model.slug}
                href={`/showcase/hero-video/${model.slug}`}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/25 hover:bg-white/8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/55">
                  {model.eyebrow}
                </p>
                <h2 className="mt-3 text-2xl font-semibold">{model.name}</h2>
                <p className="mt-2 text-sm leading-6 text-white/68">{model.description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-amber-400/20 bg-amber-400/8 p-5 text-sm leading-6 text-amber-50/90">
            Prototype note: each route now uses locally hosted official NEXA HLS video bundles
            pulled into this project for reliable internal review. Before production, we should
            confirm brand usage approval and move the chosen creative into the final media stack.
          </div>
        </div>
      </div>
    </div>
  );
}
