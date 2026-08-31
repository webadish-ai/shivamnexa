import type { Metadata } from "next";
import Link from "next/link";
import { LinkButton } from "@/components/ui/link-button";
import { CARS, DEALER } from "@/lib/data";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          404 Error
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The page you&apos;re looking for may have moved or no longer exists. Try one of the
          links below, or head back to the homepage.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton size="lg" href="/">Go to Homepage</LinkButton>
          <LinkButton variant="outline" size="lg" href="/cars">Browse Cars</LinkButton>
          <a
            href={`https://wa.me/91${DEALER.phone}?text=Hi, I couldn't find what I was looking for on the site`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border text-sm font-medium hover:bg-accent transition-colors"
          >
            💬 Chat on WhatsApp
          </a>
        </div>

        <div className="mt-14 text-left">
          <p className="text-sm font-semibold text-muted-foreground mb-4">
            Popular pages
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {CARS.map((car) => (
              <Link
                key={car.slug}
                href={`/cars/${car.slug}`}
                className="flex items-center justify-between rounded-xl border bg-card p-4 text-sm transition-all hover:border-primary/30 hover:bg-accent"
              >
                <span className="font-medium">{car.fullName}</span>
                <span className="text-muted-foreground">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
