import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool, defineLocations } from "sanity/presentation";
import { carSchema } from "./src/sanity/schemas/car";
import { citySchema } from "./src/sanity/schemas/city";
import { postSchema } from "./src/sanity/schemas/post";
import { pageSchema } from "./src/sanity/schemas/page";
import { siteSettingsSchema } from "./src/sanity/schemas/siteSettings";
import { leadSchema } from "./src/sanity/schemas/lead";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shivamnexa.com";

// Fixed city×model scope (see AGENTS.md). Update these two lists if cities or
// car models are added — they drive the "preview" links in the Presentation tool.
const CITY_SLUGS = ["mumbai", "thane", "navi-mumbai", "palghar", "boisar"];
const CAR_SLUGS = ["xl6", "grand-vitara", "jimny", "fronx", "baleno", "invicto", "e-vitara"];

export default defineConfig({
  name: "nexa-next",
  title: "Shivam NEXA CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "b1j47ohj",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        origin: SITE_ORIGIN,
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      resolve: {
        locations: {
          car: defineLocations({
            select: { slug: "slug.current", name: "fullName" },
            resolve: (doc) => ({
              locations: CITY_SLUGS.map((city) => ({
                title: `${doc?.name ?? "Car"} — ${city}`,
                href: `/cars/${doc?.slug}/${city}`,
              })),
            }),
          }),
          city: defineLocations({
            select: { slug: "slug.current", name: "name" },
            resolve: (doc) => ({
              locations: CAR_SLUGS.map((model) => ({
                title: `${model} — ${doc?.name ?? "City"}`,
                href: `/cars/${model}/${doc?.slug}`,
              })),
            }),
          }),
          page: defineLocations({
            select: { slug: "slug.current", title: "title" },
            resolve: (doc) => ({
              locations: [{ title: doc?.title ?? "Page", href: `/${doc?.slug ?? ""}` }],
            }),
          }),
          post: defineLocations({
            select: { slug: "slug.current", title: "title" },
            resolve: (doc) => ({
              locations: [{ title: doc?.title ?? "Post", href: `/blog/${doc?.slug ?? ""}` }],
            }),
          }),
        },
      },
    }),
  ],
  schema: {
    types: [carSchema, citySchema, postSchema, pageSchema, siteSettingsSchema, leadSchema],
  },
});
