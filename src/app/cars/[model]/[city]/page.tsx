import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LeadForm from "@/components/LeadForm";
import {
  CARS,
  CITIES,
  DEALER,
  formatPrice,
  estimateOnRoadPrice,
} from "@/lib/data";
import { getAllCars, getAllCities, getCarBySlug, getCityBySlug } from "@/lib/sanity";
import { carPageSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { getAbsoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ model: string; city: string }> };

export async function generateStaticParams() {
  const [cars, cities] = await Promise.all([
    getAllCars({ buildTime: true }),
    getAllCities({ buildTime: true }),
  ]);
  return cars.flatMap((car) => cities.map((city) => ({ model: car.slug, city: city.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { model, city: citySlug } = await params;
  const [car, city] = await Promise.all([getCarBySlug(model), getCityBySlug(citySlug)]);
  if (!car || !city) return {};

  const onRoad = formatPrice(estimateOnRoadPrice(car.startingPrice));
  const title = `${car.fullName} On-Road Price in ${city.name} ${new Date().getFullYear()} — ${onRoad} Onwards`;
  const description = `${car.fullName} on-road price in ${city.name} starts from ${onRoad}. Compare all ${car.variants.length} variants, check EMI options & book a free test drive at Shivam NEXA — authorized Maruti Suzuki NEXA dealer in ${city.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: getAbsoluteUrl(`/cars/${car.slug}/${city.slug}`),
    },
    alternates: { canonical: getAbsoluteUrl(`/cars/${car.slug}/${city.slug}`) },
  };
}

export default async function CarCityPage({ params }: Props) {
  const { model, city: citySlug } = await params;
  const [car, city, allCars, allCities] = await Promise.all([
    getCarBySlug(model),
    getCityBySlug(citySlug),
    getAllCars(),
    getAllCities(),
  ]);
  if (!car || !city) notFound();

  const onRoadBase = estimateOnRoadPrice(car.startingPrice);

  // City-specific FAQ additions
  const cityFaqs = [
    {
      q: `What is the on-road price of ${car.fullName} in ${city.name}?`,
      a: `The ${car.fullName} on-road price in ${city.name} starts from approximately ${formatPrice(onRoadBase)}. This includes ex-showroom price, ${city.rtoCode} RTO registration, insurance, and handling charges. Contact Shivam NEXA for the exact current on-road price in ${city.name}.`,
    },
    {
      q: `Where is the nearest Maruti Suzuki NEXA showroom in ${city.name}?`,
      a: `Shivam NEXA has authorized showrooms serving ${city.name} and nearby areas. Our showrooms are located in Andheri, Kandivali (Mumbai), Boisar and Wada (Palghar). Call ${DEALER.phone} or WhatsApp us to confirm the nearest showroom for ${city.name}.`,
    },
    ...car.faqs.slice(1),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(carPageSchema(car, city)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(cityFaqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: getAbsoluteUrl("/") },
              { name: "Cars", url: getAbsoluteUrl("/cars") },
              { name: car.fullName, url: getAbsoluteUrl(`/cars/${car.slug}`) },
              {
                name: `${car.fullName} in ${city.name}`,
                url: getAbsoluteUrl(`/cars/${car.slug}/${city.slug}`),
              },
            ])
          ),
        }}
      />

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3 text-sm text-muted-foreground flex gap-2 flex-wrap">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/cars" className="hover:text-foreground">Cars</Link>
          <span>/</span>
          <Link href={`/cars/${car.slug}`} className="hover:text-foreground">{car.fullName}</Link>
          <span>/</span>
          <span className="text-foreground">{city.name}</span>
        </div>
      </div>

      {/* Hero — above the fold lead capture */}
      <section className="py-12 bg-gradient-to-b from-muted/40 to-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <Badge className="mb-3">{car.segment}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                {car.fullName} On-Road Price in {city.name}
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                {car.tagline} · Authorized Shivam NEXA Dealer
              </p>

              {/* Key price metrics */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-xl border bg-card">
                  <p className="text-xs text-muted-foreground">Ex-Showroom Price</p>
                  <p className="font-bold text-xl mt-1">{formatPrice(car.startingPrice)}</p>
                  <p className="text-xs text-muted-foreground">onwards</p>
                </div>
                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5">
                  <p className="text-xs text-muted-foreground">Est. On-Road — {city.name}</p>
                  <p className="font-bold text-xl mt-1 text-primary">{formatPrice(onRoadBase)}</p>
                  <p className="text-xs text-muted-foreground">incl. RTO &amp; insurance</p>
                </div>
                <div className="p-4 rounded-xl border bg-card">
                  <p className="text-xs text-muted-foreground">Mileage</p>
                  <p className="font-bold text-xl mt-1">{car.mileage}</p>
                </div>
                <div className="p-4 rounded-xl border bg-card">
                  <p className="text-xs text-muted-foreground">RTO Code</p>
                  <p className="font-bold text-xl mt-1">{city.rtoCode}</p>
                  <p className="text-xs text-muted-foreground">{city.name}</p>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <LinkButton size="lg" href={`/contact?car=${car.slug}&city=${city.slug}&type=test-drive`}>
                  Book Free Test Drive in {city.name}
                </LinkButton>
                <a
                  href={`https://wa.me/91${DEALER.phone}?text=Hi, I want the on-road price of ${car.fullName} in ${city.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium hover:bg-accent transition-colors"
                >
                  💬 WhatsApp for Price
                </a>
              </div>
            </div>

            {/* Lead form — primary conversion above the fold */}
            <LeadForm
              formType="quote"
              preselectedCar={car.slug}
              city={city.name}
              className="shadow-lg"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* On-Road Price Breakdown */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {car.fullName} On-Road Price Breakdown — {city.name}
          </h2>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold">Variant</th>
                  <th className="text-right p-4 font-semibold">Ex-Showroom</th>
                  <th className="text-right p-4 font-semibold">RTO ({city.rtoCode})</th>
                  <th className="text-right p-4 font-semibold">Insurance (est.)</th>
                  <th className="text-right p-4 font-semibold font-bold text-primary">
                    On-Road {city.name}
                  </th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {car.variants.map((v, i) => {
                  const rto = Math.round(v.exShowroom * 0.07);
                  const insurance = Math.round(v.exShowroom * 0.04);
                  const onRoad = v.exShowroom + rto + insurance + 8000;
                  return (
                    <tr key={v.name} className={i % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                      <td className="p-4 font-medium">
                        {v.name}
                        <span className="ml-2 text-xs text-muted-foreground">
                          {v.fuelType} · {v.transmission}
                        </span>
                      </td>
                      <td className="p-4 text-right">{formatPrice(v.exShowroom)}</td>
                      <td className="p-4 text-right text-muted-foreground">{formatPrice(rto)}</td>
                      <td className="p-4 text-right text-muted-foreground">
                        {formatPrice(insurance)}
                      </td>
                      <td className="p-4 text-right font-bold text-primary">
                        {formatPrice(onRoad)}
                      </td>
                      <td className="p-4">
                        <LinkButton variant="outline" size="sm" href={`/contact?car=${car.slug}&variant=${v.name}&city=${city.slug}&type=quote`}>
                          Get Exact Price
                        </LinkButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            * On-road price is estimated. Actual price may vary based on current RTO rates,
            insurance premiums, and dealer charges. Contact Shivam NEXA {city.name} for the exact
            on-road quote.
          </p>
        </section>

        {/* Key features */}
        <section className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-xl font-bold mb-4">Key Features — {car.fullName}</h2>
            <ul className="space-y-3">
              {car.keyFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Specifications</h2>
            <div className="space-y-2 text-sm">
              {[
                { label: "Engine", value: car.engine },
                { label: "Mileage", value: car.mileage },
                { label: "Seating Capacity", value: `${car.seating} persons` },
                { label: "Segment", value: car.segment },
                { label: "Variants", value: `${car.variants.length} variants` },
                { label: "Fuel Options", value: [...new Set(car.variants.map((v) => v.fuelType))].join(", ") },
              ].map((spec) => (
                <div key={spec.label} className="flex justify-between py-2 border-b last:border-0">
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other cities — SEO internal links */}
        <section>
          <h2 className="text-xl font-bold mb-4">
            {car.fullName} Price in Other Cities
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {allCities.filter((c) => c.slug !== city.slug).map((otherCity) => (
              <Link
                key={otherCity.slug}
                href={`/cars/${car.slug}/${otherCity.slug}`}
                className="p-3 rounded-lg border bg-card hover:bg-accent hover:border-primary/30 transition-all text-sm group"
              >
                <p className="font-medium group-hover:text-primary">
                  {car.name} in {otherCity.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Est. {formatPrice(estimateOnRoadPrice(car.startingPrice))}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Other models in same city */}
        <section>
          <h2 className="text-xl font-bold mb-4">
            Other NEXA Cars in {city.name}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allCars.filter((c) => c.slug !== car.slug).map((otherCar) => (
              <Link
                key={otherCar.slug}
                href={`/cars/${otherCar.slug}/${city.slug}`}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent hover:border-primary/30 transition-all text-sm group"
              >
                <div>
                  <p className="font-medium group-hover:text-primary">{otherCar.fullName}</p>
                  <p className="text-xs text-muted-foreground">{otherCar.segment}</p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-xs text-muted-foreground">from</p>
                  <p className="font-semibold text-sm">
                    {formatPrice(estimateOnRoadPrice(otherCar.startingPrice))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <Separator />

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            FAQs — {car.fullName} in {city.name}
          </h2>
          <div className="space-y-4">
            {cityFaqs.map((faq) => (
              <Card key={faq.q}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{faq.a}</CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
