import type { Metadata } from "next";
import LeadForm from "@/components/LeadForm";
import PageHero from "@/components/PageHero";
import { DEALER } from "@/lib/data";
import { getAbsoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book Test Drive & Get Price Quote — Contact Shivam NEXA Mumbai",
  description:
    "Book a free test drive or get the best on-road price quote for any Maruti Suzuki NEXA car in Mumbai, Thane, Navi Mumbai & Palghar. Contact Shivam NEXA — call or WhatsApp 8828199999.",
  alternates: { canonical: getAbsoluteUrl("/contact") },
};

const FORM_TYPES = ["test-drive", "quote", "contact"] as const;
type FormType = (typeof FORM_TYPES)[number];

type Props = {
  searchParams: Promise<{ car?: string; type?: string; variant?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const { car, type } = await searchParams;
  const formType: FormType = FORM_TYPES.includes(type as FormType)
    ? (type as FormType)
    : "contact";
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Contact Shivam NEXA"
        subtitle="Book a test drive, get a price quote, or talk to our car experts. We respond within 30 minutes during business hours."
      />
      <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Get in Touch</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: "📞",
                    label: "Sales",
                    value: DEALER.phone,
                    href: `tel:${DEALER.phone}`,
                  },
                  {
                    icon: "🔧",
                    label: "Service",
                    value: DEALER.servicePhone,
                    href: `tel:${DEALER.servicePhone}`,
                  },
                  {
                    icon: "💬",
                    label: "WhatsApp",
                    value: "Chat with us",
                    href: `https://wa.me/91${DEALER.phone}?text=Hi, I need help with a NEXA car`,
                  },
                  {
                    icon: "✉️",
                    label: "Email",
                    value: DEALER.email,
                    href: `mailto:${DEALER.email}`,
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-semibold">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Our Showrooms</h2>
              <div className="space-y-3">
                {DEALER.showrooms.map((s) => (
                  <div key={s.name} className="p-4 rounded-lg border bg-card">
                    <p className="font-semibold">{s.name} — {s.city}</p>
                    <p className="text-sm text-muted-foreground mt-1">{s.address}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <a href={`tel:${s.phone}`} className="font-medium text-primary hover:underline">
                        {s.phone}
                      </a>
                      <a href={`mailto:${s.email}`} className="text-muted-foreground hover:text-foreground">
                        {s.email}
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mon–Sun: 9:00 AM – 7:00 PM
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <LeadForm formType={formType} preselectedCar={car} className="shadow-lg" />
        </div>
      </div>
      </div>
    </>
  );
}
