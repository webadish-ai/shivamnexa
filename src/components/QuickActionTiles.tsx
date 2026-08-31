import Link from "next/link";

const ACTIONS = [
  {
    icon: "🚗",
    title: "Buy a New Car",
    desc: "Browse NEXA models & book a test drive",
    href: "/contact?type=test-drive",
  },
  {
    icon: "🔄",
    title: "Exchange My Car",
    desc: "Best market value for your old car",
    href: "/exchange-your-used-car",
  },
  {
    icon: "🛡️",
    title: "Insure My Car",
    desc: "Trusted coverage, easy online booking",
    href: "/car-insurance",
  },
  {
    icon: "🔧",
    title: "Service My Car",
    desc: "Book a service appointment",
    href: "/book-a-service-appointment",
  },
];

export default function QuickActionTiles() {
  return (
    <section className="py-10 border-b bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {ACTIONS.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="flex flex-col items-center text-center gap-2 rounded-2xl border bg-card p-5 hover:shadow-md hover:border-primary/30 transition-all"
            >
              <span className="text-3xl">{action.icon}</span>
              <span className="font-semibold text-sm">{action.title}</span>
              <span className="text-xs text-muted-foreground">{action.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
