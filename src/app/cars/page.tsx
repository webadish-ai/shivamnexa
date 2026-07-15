import type { Metadata } from "next";
import Link from "next/link";
import CarCard from "@/components/CarCard";
import { formatPrice } from "@/lib/data";
import { getAllCars, getAllCities } from "@/lib/sanity";
import { getAbsoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "NEXA Cars in Mumbai, Thane & Palghar",
  description:
    "Explore the full Maruti Suzuki NEXA range at Shivam NEXA, including XL6, Grand Vitara, Jimny, Fronx, Baleno, Invicto and e Vitara.",
  alternates: { canonical: getAbsoluteUrl("/cars") },
};

export default async function CarsPage() {
  const [cars, cities] = await Promise.all([getAllCars(), getAllCities()]);
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Premium Range
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Discover the full NEXA car lineup
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Compare premium hatchbacks, SUVs, MPVs and electric options, then move into city
          pages for exact on-road price, variant details and faster test-drive enquiries.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cars.map((car) => (
          <CarCard key={car.slug} car={car} />
        ))}
      </div>

      <section className="mt-16 rounded-3xl border bg-muted/30 p-8">
        <h2 className="text-2xl font-bold">NEXA car prices by city</h2>
        <p className="mt-3 text-muted-foreground">
          Browse every city and model landing page for exact on-road price estimates, variant
          details and local lead capture.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cities.flatMap((city) =>
            cars.map((car) => (
              <Link
                key={`${car.slug}-${city.slug}`}
                href={`/cars/${car.slug}/${city.slug}`}
                className="flex items-center justify-between rounded-2xl border bg-card p-4 text-sm transition-all hover:border-primary/30 hover:bg-accent"
              >
                <span className="font-medium">
                  {car.name} in {city.name}
                </span>
                <span className="ml-3 shrink-0 text-xs text-muted-foreground">
                  {formatPrice(car.startingPrice)}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
