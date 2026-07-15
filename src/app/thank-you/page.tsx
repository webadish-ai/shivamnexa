import type { Metadata } from "next";
import Link from "next/link";
import { DEALER } from "@/lib/data";

export const metadata: Metadata = {
  title: "Thank You — Shivam NEXA",
  description: "We have received your enquiry. Our team will call you back shortly.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-6xl">✅</div>
        <h1 className="text-3xl font-bold">Thank you! We&apos;ve got your enquiry.</h1>
        <p className="text-muted-foreground">
          Our NEXA team will call you back within 30 minutes during business
          hours (9 AM – 7 PM). For anything urgent, reach us directly:
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`tel:${DEALER.phone}`}
            className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            📞 Call {DEALER.phone}
          </a>
          <a
            href={`https://wa.me/91${DEALER.phone}?text=Hi, I just submitted an enquiry on your website`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md border px-5 py-2.5 text-sm font-semibold hover:bg-accent"
          >
            💬 WhatsApp us
          </a>
        </div>
        <p className="text-sm text-muted-foreground">
          Meanwhile, explore our <Link href="/cars" className="text-primary underline">NEXA car range</Link>.
        </p>
      </div>
    </div>
  );
}
