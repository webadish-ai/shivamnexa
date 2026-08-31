import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
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
    <>
      <PageHero
        eyebrow="Awards & Achievements"
        title="Recognition that supports trust at the lead stage"
        subtitle="These recognitions from NEXA reinforce the sales and service credibility that matters when a buyer compares dealerships online before booking a test drive."
        image={{ src: "/images/hero/awards.jpg", alt: "Award-winning NEXA dealership" }}
      />
      <div className="container mx-auto px-4 py-12">
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
    </>
  );
}

