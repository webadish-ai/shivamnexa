import { defineType, defineField } from "sanity";

// Generic marketing/content page (migrated WordPress pages: used cars, insurance,
// finance, driving school, legal pages, ...). Served at /{slug} by the root
// catch-all route.
export const pageSchema = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "URL path, e.g. 'buy-used-car' → /buy-used-car. Keep identical to the old WordPress slug for migrated pages.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })] }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })] },
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "showLeadForm",
      title: "Show Lead Form",
      type: "boolean",
      initialValue: true,
      description: "Shows the enquiry form beside the content (off for legal pages).",
    }),
    defineField({
      name: "leadFormType",
      title: "Lead Form Type",
      type: "string",
      options: { list: ["contact", "quote", "test-drive"] },
      initialValue: "contact",
      hidden: ({ parent }) => !parent?.showLeadForm,
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "q", title: "Question", type: "string" }),
            defineField({ name: "a", title: "Answer", type: "text", rows: 3 }),
          ],
        },
      ],
    }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text", rows: 2 }),
    defineField({
      name: "noIndex",
      title: "Hide from Google (noindex)",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
