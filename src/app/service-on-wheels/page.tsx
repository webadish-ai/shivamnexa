import type { Metadata } from "next";
import Link from "next/link";
import { getAbsoluteUrl } from "@/lib/site";

const benefits = [
  "Doorstep service support that reduces workshop travel time",
  "Factory-backed tools and process brought closer to the customer",
  "Helpful for routine maintenance, minor repairs and ownership convenience",
  "Stronger after-sales trust that improves repeat business and referrals",
];

export const metadata: Metadata = {
  title: "Service on Wheels",
  description:
    "Learn how Shivam Autozone NEXA Service on Wheels helps Maruti customers access convenient doorstep maintenance and support across the region.",
  alternates: { canonical: getAbsoluteUrl("/service-on-wheels") },
};

export default function ServiceOnWheelsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Service on Wheels
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Doorstep support that keeps ownership convenient
          </h1>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              Service on Wheels is a smart mobile workshop concept designed to bring select
              Maruti service jobs closer to the customer. It helps owners access maintenance,
              support and basic repair assistance more conveniently, without always needing to
              visit a full workshop.
            </p>
            <p>
              For a dealership group, this matters beyond service. A smoother ownership
              experience improves satisfaction, reviews, referrals and repeat purchase intent,
              all of which support long-term sales growth.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border bg-muted/30 p-8">
          <h2 className="text-xl font-semibold">Why it matters</h2>
          <div className="mt-6 grid gap-3">
            {benefits.map((item) => (
              <div key={item} className="rounded-2xl bg-background p-4 text-sm">
                {item}
              </div>
            ))}
          </div>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full border px-5 py-3 text-sm font-medium"
          >
            Ask for service assistance
          </Link>
        </div>
      </section>
    </div>
  );
}

