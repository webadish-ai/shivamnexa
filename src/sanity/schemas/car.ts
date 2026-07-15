import { defineType, defineField, defineArrayMember } from "sanity";

export const carSchema = defineType({
  name: "car",
  title: "Car",
  type: "document",
  fields: [
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "name", title: "Short Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "fullName", title: "Full Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "segment", title: "Segment", type: "string" }),
    defineField({ name: "startingPrice", title: "Starting Price (₹)", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "seating", title: "Seating Capacity", type: "number" }),
    defineField({ name: "mileage", title: "Mileage", type: "string" }),
    defineField({ name: "engine", title: "Engine", type: "string" }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
    defineField({
      name: "keyFeatures",
      title: "Key Features",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "variants",
      title: "Variants",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Variant Name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "exShowroom", title: "Ex-Showroom Price (₹)", type: "number", validation: (r) => r.required().min(0) }),
            defineField({
              name: "fuelType",
              title: "Fuel Type",
              type: "string",
              options: { list: ["Petrol", "CNG", "Diesel", "Electric", "Hybrid"] },
            }),
            defineField({
              name: "transmission",
              title: "Transmission",
              type: "string",
              options: { list: ["Manual", "Automatic", "AMT"] },
            }),
          ],
          preview: { select: { title: "name", subtitle: "exShowroom" } },
        }),
      ],
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "q", title: "Question", type: "string", validation: (r) => r.required() }),
            defineField({ name: "a", title: "Answer", type: "text", rows: 3, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "q" } },
        }),
      ],
    }),
    defineField({
      name: "colors",
      title: "Colors",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Color Name", type: "string" }),
            defineField({ name: "hex", title: "Hex Code", type: "string" }),
          ],
          preview: { select: { title: "name", subtitle: "hex" } },
        }),
      ],
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Icon (emoji)", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "specGroup",
          fields: [
            defineField({ name: "category", title: "Category", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "label", title: "Label", type: "string" }),
                    defineField({ name: "value", title: "Value", type: "string" }),
                  ],
                  preview: { select: { title: "label", subtitle: "value" } },
                }),
              ],
            }),
          ],
          preview: { select: { title: "category" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "fullName", subtitle: "segment" },
  },
});
