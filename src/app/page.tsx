import Link from "next/link";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CarCard from "@/components/CarCard";
import LeadForm from "@/components/LeadForm";
import HeroSlider from "@/components/HeroSlider";
import TrustStrip from "@/components/TrustStrip";
import { DEALER, formatPrice } from "@/lib/data";
import { getAllCars, getAllCities } from "@/lib/sanity";

export default async function HomePage() {
  const [CARS, CITIES] = await Promise.all([getAllCars(), getAllCities()]);
  return (
    <>
      <HeroSlider cars={CARS} />
      <TrustStrip />

      {/* Hero */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Authorized NEXA Dealer since {DEALER.since}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
                Maruti Suzuki NEXA Cars
                <br />
                <span className="text-primary">in Mumbai, Thane &amp; Palghar</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Explore the full range of premium NEXA cars — XL6, Grand Vitara, Jimny, Fronx,
                Baleno, Invicto &amp; e-Vitara. Get the best on-road price and book a free test
                drive at your nearest Shivam NEXA showroom.
              </p>
              <div className="flex flex-wrap gap-3">
                <LinkButton size="lg" href="/contact">Book Free Test Drive</LinkButton>
                <LinkButton variant="outline" size="lg" href="/cars">Explore All Cars</LinkButton>
                <a
                  href={`https://wa.me/91${DEALER.phone}?text=Hi, I want to know more about NEXA cars`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium hover:bg-accent transition-colors"
                >
                  💬 WhatsApp Us
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
                {[
                  { label: "Years of Trust", value: `${new Date().getFullYear() - DEALER.since}+` },
                  { label: "Showrooms", value: `${DEALER.showrooms.length}` },
                  { label: "NEXA Models", value: `${CARS.length}` },
                  { label: "Cities Served", value: `${DEALER.cities.length}` },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <LeadForm formType="test-drive" className="shadow-lg" />
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Explore NEXA Cars</h2>
            <p className="text-muted-foreground">
              {CARS.length} premium models — starting from{" "}
              {formatPrice(Math.min(...CARS.map((c) => c.startingPrice)))}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CARS.map((car) => (
              <CarCard key={car.slug} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* City+Model links — critical for SEO internal linking */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2">NEXA Car Prices by City</h2>
          <p className="text-muted-foreground mb-6">
            Get accurate on-road prices, showroom details, and test drive booking for your city.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {CITIES.flatMap((city) =>
              CARS.map((car) => (
                <Link
                  key={`${car.slug}-${city.slug}`}
                  href={`/cars/${car.slug}/${city.slug}`}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent hover:border-primary/30 transition-all text-sm group"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">
                    {car.name} in {city.name}
                  </span>
                  <span className="text-muted-foreground text-xs shrink-0 ml-2">
                    {formatPrice(car.startingPrice)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Shivam NEXA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Why Choose Shivam NEXA?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🏆",
                title: `${new Date().getFullYear() - DEALER.since}+ Years of Trust`,
                desc: "Authorized NEXA dealer since 2015 with thousands of happy customers.",
              },
              {
                icon: "📍",
                title: "4 Showroom Locations",
                desc: "Convenient showrooms across Mumbai, Palghar & Thane.",
              },
              {
                icon: "💰",
                title: "Best On-Road Price",
                desc: "Transparent pricing with best exchange value and finance options.",
              },
              {
                icon: "🔧",
                title: "Expert Service",
                desc: "Certified NEXA technicians with genuine Maruti Suzuki parts.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-6 rounded-xl border bg-card hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Showrooms */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Our Showrooms</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEALER.showrooms.map((showroom) => (
              <div key={showroom.name} className="p-4 rounded-lg border bg-card">
                <h3 className="font-semibold">{showroom.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{showroom.address}</p>
                <a
                  href={`tel:${DEALER.phone}`}
                  className="text-sm text-primary mt-2 inline-block hover:underline"
                >
                  {DEALER.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
