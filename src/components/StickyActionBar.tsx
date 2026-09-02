import Link from "next/link";

const ACTIONS = [
  { icon: "🚘", label: "Test Drive", href: "/contact?type=test-drive" },
  { icon: "💰", label: "Best Price", href: "/contact?type=quote" },
  { icon: "🔧", label: "Book Service", href: "/book-a-service-appointment" },
  { icon: "🛡️", label: "Insurance", href: "/car-insurance" },
  { icon: "🔑", label: "Subscribe", href: "/maruti-suzuki-nexa-car-subscribe" },
  { icon: "💳", label: "Finance", href: "/maruti-suzuki-smart-finance" },
];

export default function StickyActionBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed bottom-0 inset-x-0 z-40 h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85"
    >
      <div className="grid grid-cols-6 h-full">
        {ACTIONS.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex h-full flex-col items-center justify-center gap-0.5 px-1 text-center hover:bg-accent transition-colors"
          >
            <span className="text-lg leading-none">{action.icon}</span>
            <span className="text-[10px] sm:text-xs font-medium leading-tight">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
