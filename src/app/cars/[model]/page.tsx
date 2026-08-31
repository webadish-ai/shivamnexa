import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Separator } from "@/components/ui/separator";
import LeadForm from "@/components/LeadForm";
import CarDetailNav from "@/components/CarDetailNav";
import EmiCalculator from "@/components/EmiCalculator";
import ExchangeForm from "@/components/ExchangeForm";
import CarGallery from "@/components/CarGallery";
import { getCarGalleryImages } from "@/lib/gallery";
import {
  DEALER,
  formatPrice,
  estimateOnRoadPrice,
  getCarImagePath,
} from "@/lib/data";
import { getAllCars, getAllCities, getCarBySlug } from "@/lib/sanity";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import { getAbsoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ model: string }> };

export async function generateStaticParams() {
  const cars = await getAllCars({ buildTime: true });
  return cars.map((car) => ({ model: car.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { model } = await params;
  const car = await getCarBySlug(model);
  if (!car) return {};
  const title = `${car.fullName} Price in Mumbai ${new Date().getFullYear()} — On-Road Price, Variants & Booking`;
  const description = `${car.fullName} on-road price in Mumbai starts from ${formatPrice(estimateOnRoadPrice(car.startingPrice))}. Compare ${car.variants.length} variants, full specs, colours & book a free test drive at Shivam NEXA — Mumbai, Thane & Palghar.`;
  return {
    title,
    description,
    openGraph: { title, description, url: getAbsoluteUrl(`/cars/${car.slug}`) },
    alternates: { canonical: getAbsoluteUrl(`/cars/${car.slug}`) },
  };
}

const SPEC_CATEGORY_ICONS: Record<string, string> = {
  "Engine & Performance": "⚙️",
  "Transmission": "🔧",
  "Dimensions & Capacity": "📐",
  "Technology & Comfort": "💻",
  "Safety": "🛡️",
};

const NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "gallery", label: "Gallery" },
  { id: "variants", label: "Variants & Price" },
  { id: "specs", label: "Specifications" },
  { id: "emi", label: "EMI Calculator" },
  { id: "exchange", label: "Exchange" },
  { id: "cities", label: "By City" },
  { id: "book", label: "Book / Enquire" },
  { id: "faq", label: "FAQ" },
];

export default async function CarModelPage({ params }: Props) {
  const { model } = await params;
  const [car, cities, allCars] = await Promise.all([
    getCarBySlug(model),
    getAllCities(),
    getAllCars(),
  ]);
  if (!car) notFound();

  const onRoadBase = estimateOnRoadPrice(car.startingPrice);
  const galleryImages = getCarGalleryImages(car.slug);
  const navItems = NAV_ITEMS.filter((n) => {
    if (n.id === "specs") return Boolean(car.specs?.length);
    if (n.id === "gallery") return galleryImages.length > 0;
    return true;
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(car.faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: getAbsoluteUrl("/") },
              { name: "Cars", url: getAbsoluteUrl("/cars") },
              { name: car.fullName, url: getAbsoluteUrl(`/cars/${car.slug}`) },
            ])
          ),
        }}
      />

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3 text-sm text-muted-foreground flex gap-2">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/cars" className="hover:text-foreground">Cars</Link>
          <span>/</span>
          <span className="text-foreground">{car.fullName}</span>
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────── */}
      <section id="overview" className="relative min-h-[70vh] flex items-end bg-gray-950 overflow-hidden scroll-mt-0">
        <Image
          src={getCarImagePath(car.slug)}
          alt={car.imageAlt}
          fill
          priority
          loading="eager"
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

        <div className="relative z-10 w-full pb-12 pt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {car.segment}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 leading-tight">
                {car.fullName}
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-xl">{car.tagline}</p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { label: "Starting (ex-showroom)", value: formatPrice(car.startingPrice) },
                  { label: "Est. On-Road Mumbai", value: formatPrice(onRoadBase) },
                  { label: car.slug === "e-vitara" ? "Range" : "Mileage", value: car.mileage },
                  { label: "Seating", value: `${car.seating} Seater` },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white"
                  >
                    <p className="text-xs text-white/60 uppercase tracking-wide">{stat.label}</p>
                    <p className="text-lg font-bold mt-0.5">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <LinkButton size="lg" href={`/contact?car=${car.slug}&type=test-drive`}>
                  Book Free Test Drive
                </LinkButton>
                <LinkButton
                  variant="outline"
                  size="lg"
                  href={`/contact?car=${car.slug}&type=quote`}
                  className="border-white/40 text-white hover:bg-white/10 hover:text-white bg-transparent"
                >
                  Get Best Price
                </LinkButton>
                <a
                  href={`https://wa.me/91${DEALER.phone}?text=Hi, I'm interested in the ${car.fullName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY NAV ───────────────────────────────── */}
      <CarDetailNav items={navItems} />

      {/* ── KEY FEATURES STRIP ───────────────────────── */}
      <section className="border-b bg-muted/30 py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            {car.keyFeatures.map((f) => (
              <span
                key={f}
                className="flex items-center gap-1.5 text-sm border rounded-full px-4 py-1.5 bg-background"
              >
                <span className="text-green-500 font-bold">✓</span> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">

        {/* ── ABOUT ────────────────────────────────────── */}
        <div className="max-w-3xl">
          <p className="text-lg text-muted-foreground leading-relaxed">{car.description}</p>
        </div>

        {/* ── HIGHLIGHTS ───────────────────────────────── */}
        {car.highlights && car.highlights.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Why Choose the {car.name}?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {car.highlights.map((h) => (
                <div
                  key={h.title}
                  className="rounded-2xl border bg-card p-6 hover:shadow-md transition-shadow"
                >
                  <span className="text-4xl block mb-4">{h.icon}</span>
                  <h3 className="font-bold text-base mb-2">{h.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{h.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── COLOUR OPTIONS ───────────────────────────── */}
        {car.colors && car.colors.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-5">Colour Options</h2>
            <div className="flex flex-wrap gap-5">
              {car.colors.map((color) => (
                <div key={color.name} className="flex flex-col items-center gap-2">
                  <div
                    className="w-12 h-12 rounded-full border-2 border-border shadow-md ring-2 ring-offset-2 ring-transparent hover:ring-primary/40 transition-all cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                  <span className="text-xs text-muted-foreground text-center max-w-[72px] leading-tight">
                    {color.name}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              * Colour availability may vary by variant. Contact Shivam NEXA for current stock colours.
            </p>
          </section>
        )}

        {/* ── GALLERY ──────────────────────────────────── */}
        {galleryImages.length > 0 && (
          <section id="gallery" className="scroll-mt-20">
            <CarGallery
              images={galleryImages}
              carName={car.fullName}
              imageAlt={car.imageAlt}
            />
          </section>
        )}

        <Separator />

        {/* ── VARIANTS & PRICING ───────────────────────── */}
        <section id="variants" className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-2">
            {car.fullName} Variants &amp; On-Road Price — Mumbai {new Date().getFullYear()}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            All prices below are ex-showroom. Estimated on-road price includes RTO, insurance &amp; handling.
          </p>
          <div className="rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="text-left p-4 font-semibold">Variant</th>
                    <th className="text-left p-4 font-semibold">Fuel / Motor</th>
                    <th className="text-left p-4 font-semibold">Transmission</th>
                    <th className="text-right p-4 font-semibold">Ex-Showroom</th>
                    <th className="text-right p-4 font-semibold">Est. On-Road</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {car.variants.map((v, i) => {
                    const isMidRange = i === Math.floor(car.variants.length / 2) && car.variants.length > 2;
                    return (
                      <tr key={v.name} className={i % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                        <td className="p-4">
                          <span className="font-medium">{v.name}</span>
                          {isMidRange && (
                            <Badge className="ml-2 text-[10px] py-0" variant="secondary">
                              Popular
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 text-muted-foreground">{v.fuelType}</td>
                        <td className="p-4 text-muted-foreground">{v.transmission}</td>
                        <td className="p-4 text-right font-medium">{formatPrice(v.exShowroom)}</td>
                        <td className="p-4 text-right font-bold text-primary">
                          {formatPrice(estimateOnRoadPrice(v.exShowroom))}
                        </td>
                        <td className="p-4">
                          <LinkButton
                            variant="outline"
                            size="sm"
                            href={`/contact?car=${car.slug}&variant=${encodeURIComponent(v.name)}&type=quote`}
                          >
                            Get Quote
                          </LinkButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            * Prices as of {new Date().getFullYear()}. On-road ≈ ex-showroom + ~12% (RTO + insurance + handling charges).
            Contact Shivam NEXA for exact current pricing and ongoing offers.
          </p>
        </section>

        {/* ── SPECIFICATIONS ───────────────────────────── */}
        {car.specs && car.specs.length > 0 && (
          <section id="specs" className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-1">{car.fullName} Full Specifications</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Everything you need to know — engine, dimensions, comfort &amp; safety.
            </p>
            <div className="grid md:grid-cols-2 gap-5">
              {car.specs.map((group) => {
                const icon = SPEC_CATEGORY_ICONS[group.category] ?? "•";
                return (
                  <div
                    key={group.category}
                    className="rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 px-6 pt-5 pb-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg">
                        {icon}
                      </span>
                      <h3 className="font-bold text-base">{group.category}</h3>
                    </div>
                    <dl className="px-6 pb-5 divide-y">
                      {group.items.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between gap-4 py-3"
                        >
                          <dt className="text-sm text-muted-foreground">{item.label}</dt>
                          <dd className="text-sm font-semibold text-right">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <Separator />

        {/* ── EMI CALCULATOR ───────────────────────────── */}
        <section id="emi" className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-2">
            {car.fullName} EMI Calculator
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Plan your monthly budget. Adjust down payment, tenure and interest rate to see your indicative EMI.
          </p>
          <EmiCalculator
            carSlug={car.slug}
            carName={car.fullName}
            exShowroom={car.startingPrice}
          />
        </section>

        {/* ── EXCHANGE / OLD CAR VALUATION ─────────────── */}
        <section id="exchange" className="scroll-mt-20">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-2xl font-bold mb-3">
                Exchange Your Old Car for a {car.name}
              </h2>
              <p className="text-muted-foreground mb-5">
                Get a fair, transparent valuation for your existing car — any brand, any model —
                and use it as down payment for your new {car.fullName}. Top exchange bonuses
                available on select models.
              </p>
              <ul className="space-y-3 text-sm">
                {[
                  "Best-in-market valuation — we beat OLX & Cars24 in 70% of cases",
                  "Instant on-spot quote at any Shivam NEXA showroom",
                  "Hassle-free RC transfer & paperwork handled by us",
                  "Exchange bonus on top of valuation — limited period",
                  "No obligation — get the quote, decide later",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-green-500 mt-0.5 shrink-0">✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
            <ExchangeForm newCarSlug={car.slug} newCarName={car.fullName} />
          </div>
        </section>

        <Separator />

        {/* ── CITY PAGES (SEO) ─────────────────────────── */}
        <section id="cities" className="scroll-mt-20">
          <h2 className="text-xl font-bold mb-2">
            {car.fullName} On-Road Price by City
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            On-road prices vary by city (RTO charges differ). Click your city for the exact breakdown.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/cars/${car.slug}/${city.slug}`}
                className="p-4 rounded-xl border bg-card hover:bg-accent hover:border-primary/30 transition-all text-sm group"
              >
                <p className="font-semibold group-hover:text-primary">
                  {car.name} in {city.name}
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Est. {formatPrice(estimateOnRoadPrice(car.startingPrice))}
                </p>
                <p className="text-xs text-primary mt-2 flex items-center gap-1">
                  View on-road price <span>→</span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── LEAD FORM ────────────────────────────────── */}
        <section id="book" className="scroll-mt-20">
          <div className="rounded-2xl border bg-muted/20 p-8">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="text-2xl font-bold mb-3">
                  Get the Best {car.fullName} Price in Mumbai
                </h2>
                <p className="text-muted-foreground mb-5">
                  Fill in your details and our Shivam NEXA team will call you within 30 minutes with
                  the exact on-road price, current offers, and available colours.
                </p>
                <ul className="space-y-3 text-sm">
                  {[
                    "Best price guaranteed — we match any dealer",
                    "Free test drive at your home or our showroom",
                    "Finance options from 7.99% p.a.",
                    "Trade-in / exchange value in 2 minutes",
                    "End-to-end booking & delivery support",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-green-500 mt-0.5 shrink-0">✓</span> {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={`tel:${DEALER.phone}`}
                    className="inline-flex items-center gap-2 text-sm font-medium"
                  >
                    📞 {DEALER.phone}
                  </a>
                  <a
                    href={`https://wa.me/91${DEALER.phone}?text=Hi, I need the best price for ${car.fullName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#25D366]"
                  >
                    💬 WhatsApp us
                  </a>
                </div>
              </div>
              <LeadForm formType="quote" preselectedCar={car.slug} />
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────── */}
        <section id="faq" className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-6">
            Frequently Asked Questions — {car.fullName}
          </h2>
          <div className="space-y-3">
            {car.faqs.map((faq, i) => (
              <details
                key={faq.q}
                className="group rounded-xl border bg-card overflow-hidden"
                open={i === 0}
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-sm list-none hover:bg-muted/30 transition-colors">
                  <span>{faq.q}</span>
                  <span className="ml-4 shrink-0 text-muted-foreground group-open:rotate-180 transition-transform">
                    ↓
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── OTHER MODELS ─────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold mb-5">Explore Other NEXA Cars</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allCars.filter((c) => c.slug !== car.slug)
              .slice(0, 4)
              .map((otherCar) => (
                <Link
                  key={otherCar.slug}
                  href={`/cars/${otherCar.slug}`}
                  className="group rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                    <Image
                      src={getCarImagePath(otherCar.slug)}
                      alt={otherCar.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{otherCar.segment}</p>
                    <p className="font-bold">{otherCar.fullName}</p>
                    <p className="text-sm text-primary mt-1">
                      From {formatPrice(otherCar.startingPrice)}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>

      {/* ── MOBILE STICKY CTA ────────────────────────── */}
      <div className="fixed bottom-20 left-0 right-0 px-4 z-30 pointer-events-none lg:hidden">
        <div className="max-w-sm mx-auto flex gap-2 pointer-events-auto">
          <LinkButton
            size="lg"
            href={`/contact?car=${car.slug}&type=test-drive`}
            className="flex-1 shadow-lg"
          >
            Book Test Drive
          </LinkButton>
          <a
            href={`https://wa.me/91${DEALER.phone}?text=Hi, I need a price quote for ${car.fullName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 rounded-md bg-[#25D366] text-white font-medium text-sm shadow-lg"
          >
            💬
          </a>
        </div>
      </div>
    </>
  );
}
