import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { carSchema } from "./src/sanity/schemas/car";
import { citySchema } from "./src/sanity/schemas/city";
import { postSchema } from "./src/sanity/schemas/post";
import { pageSchema } from "./src/sanity/schemas/page";
import { siteSettingsSchema } from "./src/sanity/schemas/siteSettings";
import { leadSchema } from "./src/sanity/schemas/lead";

export default defineConfig({
  name: "nexa-next",
  title: "Shivam NEXA CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "b1j47ohj",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [structureTool()],
  schema: {
    types: [carSchema, citySchema, postSchema, pageSchema, siteSettingsSchema, leadSchema],
  },
});
