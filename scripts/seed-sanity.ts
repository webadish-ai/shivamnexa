// Run once: npx tsx scripts/seed-sanity.ts
import { createClient } from "@sanity/client";
import { CARS, CITIES } from "../src/lib/data";

const client = createClient({
  projectId: "b1j47ohj",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function seed() {
  console.log("Seeding cities...");
  for (const city of CITIES) {
    await client.createOrReplace({
      _type: "city",
      _id: `city-${city.slug}`,
      slug: { _type: "slug", current: city.slug },
      name: city.name,
      state: city.state,
      rtoCode: city.rtoCode,
    });
    console.log(`  ✓ ${city.name}`);
  }

  console.log("Seeding cars...");
  for (const car of CARS) {
    await client.createOrReplace({
      _type: "car",
      _id: `car-${car.slug}`,
      slug: { _type: "slug", current: car.slug },
      name: car.name,
      fullName: car.fullName,
      segment: car.segment,
      startingPrice: car.startingPrice,
      tagline: car.tagline,
      description: car.description,
      seating: car.seating,
      mileage: car.mileage,
      engine: car.engine,
      keyFeatures: car.keyFeatures,
      imageAlt: car.imageAlt,
      variants: car.variants.map((v, i) => ({
        _key: `variant-${i}`,
        ...v,
      })),
      faqs: car.faqs.map((f, i) => ({
        _key: `faq-${i}`,
        q: f.q,
        a: f.a,
      })),
      ...(car.colors && {
        colors: car.colors.map((c, i) => ({ _key: `color-${i}`, ...c })),
      }),
      ...(car.highlights && {
        highlights: car.highlights.map((h, i) => ({ _key: `highlight-${i}`, ...h })),
      }),
      ...(car.specs && {
        specs: car.specs.map((s, i) => ({
          _key: `spec-${i}`,
          _type: "specGroup",
          category: s.category,
          items: s.items.map((item, j) => ({ _key: `item-${j}`, ...item })),
        })),
      }),
    });
    console.log(`  ✓ ${car.fullName}`);
  }

  console.log("Done!");
}

seed().catch((err) => { console.error(err); process.exit(1); });
