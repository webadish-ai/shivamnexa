import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Car, formatPrice, getCarImagePath } from "@/lib/data";

type CarCardProps = {
  car: Car;
  citySlug?: string;
};

const fuelColors: Record<string, string> = {
  Petrol: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  CNG: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Electric: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Hybrid: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  Diesel: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export default function CarCard({ car, citySlug }: CarCardProps) {
  const href = citySlug ? `/cars/${car.slug}/${citySlug}` : `/cars/${car.slug}`;
  const uniqueFuels = [...new Set(car.variants.map((v) => v.fuelType))];

  return (
    <Card className="group overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Image
          src={getCarImagePath(car.slug)}
          alt={car.imageAlt}
          fill
          sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="text-xs">
            {car.segment}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <p className="text-lg font-semibold tracking-tight text-white">{car.name}</p>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-base leading-tight">{car.fullName}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{car.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap mt-3">
          {uniqueFuels.map((fuel) => (
            <span
              key={fuel}
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${fuelColors[fuel] ?? ""}`}
            >
              {fuel}
            </span>
          ))}
          <span className="text-xs text-muted-foreground ml-auto">{car.mileage}</span>
        </div>

        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Starting from</p>
            <p className="font-bold text-lg">{formatPrice(car.startingPrice)}</p>
            <p className="text-xs text-muted-foreground">ex-showroom</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            {car.variants.length} variants
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <LinkButton variant="outline" size="sm" className="flex-1" href={href}>
          View Details
        </LinkButton>
        <LinkButton size="sm" className="flex-1" href={`/contact?car=${car.slug}&type=test-drive`}>
          Test Drive
        </LinkButton>
      </CardFooter>
    </Card>
  );
}
