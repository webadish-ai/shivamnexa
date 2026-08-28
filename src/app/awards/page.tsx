import type { Metadata } from "next";
import { getAbsoluteUrl } from "@/lib/site";
import { AWARDS } from "@/lib/awards";

export const metadata: Metadata = {
  title: "Awards & Achievements",
  description:
    "Explore awards and recognitions earned by Shivam Autozone NEXA for sales performance, marketing, customer experience and service excellence.",
  alternates: { canonical: getAbsoluteUrl("/awards") },
};

export default function AwardsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Awards & Achievements
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Recognition that supports trust at the lead stage
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          These recognitions from NEXA reinforce the sales and service credibility that matters
          when a buyer compares dealerships online before booking a test drive.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {AWARDS.map((award) => (
          <article key={`${award.title}-${award.year}`} className="rounded-3xl border bg-card p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{award.org}</p>
            <h2 className="mt-3 text-xl font-semibold">{award.title}</h2>
            <p className="mt-6 text-3xl font-bold text-primary">{award.year}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

