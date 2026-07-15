"use client";

import Link from "next/link";
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
import { Menu } from "lucide-react";

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
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/cars" className="hover:text-primary transition-colors font-medium">
            Cars
          </Link>
          <Link href="/about-us" className="hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/awards" className="hover:text-primary transition-colors">
            Awards
          </Link>
          <Link href="/nexa-service-center" className="hover:text-primary transition-colors">
            Service
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${DEALER.phone}`}
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors"
          >
            <span>📞</span>
            <span>{DEALER.phone}</span>
          </a>
          <LinkButton size="sm" className="hidden sm:flex" href="/contact">Book Test Drive</LinkButton>

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
                  { href: "/nexa-service-center", label: "NEXA Service" },
                  { href: "/service-on-wheels", label: "Service on Wheels" },
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
