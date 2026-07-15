import { defineType, defineField } from "sanity";

export const citySchema = defineType({
  name: "city",
  title: "City",
  type: "document",
  fields: [
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "name", title: "City Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "state", title: "State", type: "string" }),
    defineField({ name: "rtoCode", title: "RTO Code", type: "string" }),
  ],
  preview: {
    select: { title: "name", subtitle: "rtoCode" },
  },
});
