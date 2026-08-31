import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { DEALER } from "@/lib/data";
import { getAbsoluteUrl } from "@/lib/site";

const leadership = [
  { name: "Mr. Samir Jani", role: "Founder & MD" },
  { name: "Mr. Atrish Jani", role: "Director" },
  { name: "Mr. Karan Jani", role: "Director" },
  { name: "Mr. Harshad Tank", role: "CEO - NEXA Service" },
  { name: "Mr. Bhavik Parekh", role: "CFO" },
  { name: "Mr. Jal Langrana", role: "CEO" },
];

export const metadata: Metadata = {
  title: "About Shivam Autozone NEXA",
  description:
    "Learn about Shivam Autozone NEXA, an authorized Maruti Suzuki dealership group serving Mumbai, Thane and Palghar with sales, service, finance, exchange and ownership support.",
  alternates: { canonical: getAbsoluteUrl("/about-us") },
};

export default function AboutUsPage() {
  return (
    <>
      <PageHero
        eyebrow="About Shivam Autozone"
        title="A Maruti Suzuki group built around long-term customer relationships"
        image={{ src: "/images/hero/about-us.webp", alt: "Shivam NEXA showroom exterior" }}
      />
      <div className="container mx-auto px-4 py-12">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Shivam Autozone is an authorized Maruti Suzuki dealership group headquartered in
              Mumbai, with presence across multiple channels including NEXA, Arena, Commercial
              and True Value. The group began in 2011 and has expanded to more than 30
              locations across the Mumbai region.
            </p>
            <p>
              The NEXA business focuses on premium car buying and ownership journeys for
              customers in Mumbai, Thane, Navi Mumbai and Palghar. Alongside new car sales, the
              group also supports service, finance, insurance, exchange, accessories and other
              ownership needs under one umbrella.
            </p>
            <p>
              Our approach is simple: make the buying experience easy, transparent and personal,
              then continue that relationship through after-sales support that keeps customers
              with the brand for years.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border bg-muted/30 p-8">
          <h2 className="text-xl font-semibold">Why customers choose Shivam NEXA</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "Authorized Maruti Suzuki NEXA dealership",
              "Coverage across Mumbai, Thane and Palghar",
              "Sales, service, finance and exchange support",
              "Lead-first digital experience for faster response",
            ].map((item) => (
              <div key={item} className="rounded-2xl border bg-background p-4 text-sm">
                {item}
              </div>
            ))}
          </div>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            Talk to our team
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Leadership</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="overflow-hidden rounded-3xl border bg-card">
            <div className="relative aspect-[4/3]">
              <Image
                src="/og-default.jpg"
                alt="Shivam NEXA showroom and premium car branding"
                fill
                sizes="(min-width: 1024px) 32vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <p className="text-lg font-semibold">Premium retail experience</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Shivam NEXA combines premium car consultation, faster lead response and
                after-sales support across Mumbai, Thane and Palghar.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {leadership.map((person) => (
              <div key={person.name} className="rounded-2xl border bg-card p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-lg font-semibold">
                    {person.name.replace("Mr. ", "").split(" ").map((part) => part[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{person.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{person.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-3xl border bg-card p-8">
        <h2 className="text-2xl font-bold">Channel strength with local focus</h2>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          The parent Shivam Autozone brand helps the group serve different customer segments,
          while the NEXA website stays focused on premium Maruti buyers. That gives this site a
          clear SEO and conversion job: capture local NEXA demand and turn it into sales leads.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            `${DEALER.since} NEXA since`,
            `${DEALER.showrooms.length} active NEXA showrooms`,
            `${DEALER.cities.length}+ target cities`,
            "30+ Autozone locations group-wide",
          ].map((stat) => (
            <div key={stat} className="rounded-2xl bg-muted/40 p-4 text-sm font-medium">
              {stat}
            </div>
          ))}
        </div>
      </section>
      </div>
    </>
  );
}
