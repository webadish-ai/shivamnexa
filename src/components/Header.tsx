"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { LinkButton } from "@/components/ui/link-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { CARS, DEALER } from "@/lib/data";
import { Menu, ChevronDown } from "lucide-react";

const SERVICE_LINKS = [
  { href: "/nexa-service-center", label: "NEXA Service Center" },
  { href: "/service-on-wheels", label: "Service on Wheels" },
  { href: "/book-a-service-appointment", label: "Book a Service Appointment" },
  { href: "/oil-change", label: "Oil Change" },
  { href: "/tyre-rotation-replacement", label: "Tyre Rotation & Replacement" },
  { href: "/car-wheel-alignment-and-balancing", label: "Wheel Alignment & Balancing" },
  { href: "/ceramic-coating", label: "Ceramic Coating" },
  { href: "/car-accessories", label: "Car Accessories" },
];

const OWNERSHIP_LINKS = [
  { href: "/buy-used-car", label: "Buy a Used Car" },
  { href: "/sell-used-car-best-price", label: "Sell Your Car" },
  { href: "/exchange-your-used-car", label: "Exchange Your Car" },
  { href: "/car-insurance", label: "Car Insurance" },
  { href: "/maruti-suzuki-smart-finance", label: "Smart Finance" },
  { href: "/maruti-nexa-car-extended-warranty", label: "Extended Warranty" },
  { href: "/maruti-suzuki-nexa-car-subscribe", label: "NEXA Subscribe" },
  { href: "/nexa-fleet", label: "NEXA Fleet" },
  { href: "/maruti-suzuki-connect", label: "Suzuki Connect" },
  { href: "/maruti-suzuki-driving-school-in-mumbai", label: "Driving School" },
];

function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-1 hover:text-primary transition-colors"
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
      </button>
      <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-150 absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50">
        <div className="w-64 rounded-xl border bg-card shadow-lg p-2 max-h-[70vh] overflow-y-auto">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight">{DEALER.shortName}</span>
          <span className="hidden sm:inline text-xs text-muted-foreground border rounded px-1.5 py-0.5">
            Authorized NEXA Dealer
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 text-sm">
          <Link href="/cars" className="hover:text-primary transition-colors font-medium">
            Cars
          </Link>
          <Link href="/about-us" className="hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/awards" className="hover:text-primary transition-colors">
            Awards
          </Link>
          <NavDropdown label="Services" items={SERVICE_LINKS} />
          <NavDropdown label="Ownership" items={OWNERSHIP_LINKS} />
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${DEALER.phone}`}
            className="hidden lg:flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors"
          >
            <span>📞</span>
            <span>{DEALER.phone}</span>
          </a>
          <LinkButton size="sm" className="hidden sm:flex" href="/contact">Book Test Drive</LinkButton>

          <span className="hidden lg:inline-block h-6 w-px bg-border" />
          <Image
            src="/images/logo-maruti-suzuki.webp"
            alt="Maruti Suzuki"
            width={450}
            height={50}
            className="hidden lg:block h-5 w-auto shrink-0"
          />

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-muted md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>{DEALER.shortName}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                  NEXA Cars
                </p>
                {CARS.map((car) => (
                  <Link
                    key={car.slug}
                    href={`/cars/${car.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-accent text-sm"
                  >
                    <span>{car.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {car.startingPrice >= 100000
                        ? `₹${(car.startingPrice / 100000).toFixed(2)}L`
                        : ""}
                    </span>
                  </Link>
                ))}
                <Separator className="my-3" />
                {[
                  { href: "/about-us", label: "About Us" },
                  { href: "/awards", label: "Awards" },
                  { href: "/blog", label: "Blog" },
                  { href: "/contact", label: "Contact Us" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="px-2 py-2 rounded-md hover:bg-accent text-sm"
                  >
                    {item.label}
                  </Link>
                ))}

                <Separator className="my-3" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                  Services
                </p>
                {SERVICE_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="px-2 py-2 rounded-md hover:bg-accent text-sm"
                  >
                    {item.label}
                  </Link>
                ))}

                <Separator className="my-3" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                  Ownership
                </p>
                {OWNERSHIP_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="px-2 py-2 rounded-md hover:bg-accent text-sm"
                  >
                    {item.label}
                  </Link>
                ))}
                <Separator className="my-3" />
                <a
                  href={`tel:${DEALER.phone}`}
                  className="px-2 py-2 text-sm font-medium text-primary"
                >
                  📞 {DEALER.phone}
                </a>
                <a
                  href={`https://wa.me/91${DEALER.phone}?text=Hi, I need help with a NEXA car`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-2 text-sm font-medium text-green-600"
                >
                  💬 WhatsApp Us
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
