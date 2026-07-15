import type { Metadata } from "next";
import Link from "next/link";
import { DEALER } from "@/lib/data";
import { getAbsoluteUrl } from "@/lib/site";

const features = [
  "Premium waiting lounge experience aligned with the NEXA brand",
  "Digital vehicle receiving and guided communication from service advisors",
  "Better visibility into job status, timelines and workshop movement",
  "Doorstep and mobile-support options for added convenience",
];

export const metadata: Metadata = {
  title: "NEXA Service Center",
  description:
    "Explore Shivam Autozone NEXA service center highlights, ownership support features and after-sales assistance across Mumbai and Palghar.",
  alternates: { canonical: getAbsoluteUrl("/nexa-service-center") },
};

export default function NexaServiceCenterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          NEXA Service Center
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Premium after-sales support that strengthens customer confidence
        </h1>
        <div className="mt-6 space-y-4 text-muted-foreground">
          <p>
            NEXA service centers are designed to deliver a more premium ownership experience,
            with higher convenience, cleaner communication and better service visibility for
            customers. Shivam Autozone supports that promise through trained teams, structured
            service processes and customer-first handling.
          </p>
          <p>
            From periodic maintenance and pick-up guidance to advisor support and transparent
            communication, the focus is on reducing ownership friction and keeping every service
            visit smooth, premium and dependable.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <div key={feature} className="rounded-3xl border bg-card p-6 text-sm">
            {feature}
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-3xl border bg-muted/30 p-8">
        <h2 className="text-2xl font-bold">Need help with service?</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Call the service team for appointment support, ownership queries or guidance to the
          nearest Shivam Autozone workshop.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`tel:${DEALER.servicePhone}`}
            className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            Call service: {DEALER.servicePhone}
          </a>
          <Link
            href="/contact"
            className="inline-flex rounded-full border px-5 py-3 text-sm font-medium"
          >
            Contact showroom team
          </Link>
        </div>
      </section>
    </div>
  );
}
