import Link from "next/link";
import { DEALER } from "@/lib/data";
import { AWARDS } from "@/lib/awards";

// Recognition is real business data (see /awards) — surfaced here so it isn't
// buried on a page nobody navigates to directly.
export default function TrustStrip() {
  const years = new Date().getFullYear() - DEALER.since;
  const recentAwards = AWARDS.slice(0, 3);

  return (
    <section className="border-y bg-muted/30">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="font-bold text-lg leading-tight">{years}+ Years</p>
              <p className="text-xs text-muted-foreground">Authorized NEXA Dealer since {DEALER.since}</p>
            </div>
          </div>

          <div className="hidden lg:block h-10 w-px bg-border shrink-0" />

          <a
            href={DEALER.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 shrink-0 group"
          >
            <span className="text-3xl">⭐</span>
            <div>
              <p className="font-bold text-lg leading-tight group-hover:underline">
                {DEALER.googleRating} <span className="font-normal text-sm text-muted-foreground">/ 5</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {(DEALER.googleReviewCount / 1000).toFixed(1)}K Google Reviews
              </p>
            </div>
          </a>

          <div className="hidden lg:block h-10 w-px bg-border shrink-0" />

          <div className="flex flex-wrap items-center gap-2">
            {recentAwards.map((award) => (
              <span
                key={`${award.title}-${award.year}`}
                className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium"
              >
                <span className="text-primary">★</span>
                {award.title} · {award.year}
              </span>
            ))}
          </div>

          <Link
            href="/awards"
            className="lg:ml-auto text-sm font-medium text-primary hover:underline shrink-0"
          >
            View All Awards →
          </Link>
        </div>
      </div>
    </section>
  );
}
