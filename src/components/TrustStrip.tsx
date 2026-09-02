import Link from "next/link";
import { DEALER } from "@/lib/data";
import { AWARDS } from "@/lib/awards";

// Recognition is real business data (see /awards) — surfaced here so it isn't
// buried on a page nobody navigates to directly.
export default function TrustStrip() {
  const years = new Date().getFullYear() - DEALER.since;
  const marqueeAwards = [...AWARDS, ...AWARDS];

  return (
    <section className="border-y bg-muted/30">
      {/* Awards — sliding marquee */}
      <div className="border-b bg-card/60">
        <div className="container mx-auto px-4 py-2.5 flex items-center gap-4">
          <div className="flex-1 min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex w-max items-center gap-3 animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused]">
              {marqueeAwards.map((award, i) => (
                <span
                  key={`${award.title}-${award.year}-${i}`}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium whitespace-nowrap"
                >
                  <span className="text-primary">🏆</span>
                  {award.title} · {award.year}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/awards"
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            View All Awards →
          </Link>
        </div>
      </div>

      {/* Years of trust / Google reviews / Happy customers */}
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

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-3xl">😊</span>
            <div>
              <p className="font-bold text-lg leading-tight">800K+</p>
              <p className="text-xs text-muted-foreground">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
