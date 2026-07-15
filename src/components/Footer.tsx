import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { CARS, CITIES, DEALER } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-base mb-3">{DEALER.shortName}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Authorized Maruti Suzuki NEXA dealer serving Mumbai, Thane, Navi Mumbai &amp;
              Palghar since {DEALER.since}.
            </p>
            <div className="space-y-1 text-sm">
              <a
                href={`tel:${DEALER.phone}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                📞 {DEALER.phone}
              </a>
              <a
                href={`https://wa.me/91${DEALER.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">NEXA Cars</h4>
            <ul className="space-y-2">
              {CARS.map((car) => (
                <li key={car.slug}>
                  <Link
                    href={`/cars/${car.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {car.fullName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">By City</h4>
            <ul className="space-y-2">
              {CITIES.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/cars/grand-vitara/${city.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    NEXA Cars in {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "/contact", label: "Book Test Drive" },
                { href: "/contact?type=quote", label: "Get Price Quote" },
                { href: "/nexa-service-center", label: "NEXA Service Center" },
                { href: "/service-on-wheels", label: "Service on Wheels" },
                { href: "/about-us", label: "About Us" },
                { href: "/awards", label: "Awards" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {DEALER.name}. All rights reserved.</p>
          <p>Authorized Maruti Suzuki NEXA Dealer · Mumbai · Thane · Navi Mumbai · Palghar</p>
        </div>
      </div>
    </footer>
  );
}
