import { defineType, defineField } from "sanity";

// Singleton: dealership-wide contact/showroom info the client can edit.
// Falls back to the DEALER const in src/lib/data.ts when absent.
export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "salesPhone", title: "Sales Phone", type: "string" }),
    defineField({ name: "servicePhone", title: "Service Phone", type: "string" }),
    defineField({ name: "whatsappNumber", title: "WhatsApp Number", type: "string", description: "10-digit number used for all WhatsApp CTAs." }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "offerBanner",
      title: "Offer Banner",
      type: "object",
      description: "Optional promo strip shown at the top of every page.",
      fields: [
        defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: false }),
        defineField({ name: "text", title: "Text", type: "string" }),
        defineField({ name: "link", title: "Link", type: "string" }),
      ],
    }),
    defineField({
      name: "showrooms",
      title: "Showrooms",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "city", title: "City", type: "string" }),
            defineField({ name: "address", title: "Address", type: "text", rows: 2 }),
            defineField({ name: "phone", title: "Phone", type: "string" }),
            defineField({ name: "email", title: "Email", type: "string" }),
            defineField({ name: "mapUrl", title: "Google Maps URL", type: "url" }),
          ],
          preview: { select: { title: "name", subtitle: "city" } },
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
        defineField({ name: "twitter", title: "X / Twitter", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
