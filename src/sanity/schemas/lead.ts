import { defineType, defineField } from "sanity";

// Captured leads — written by /api/lead (and the chatbot), visible to the
// sales team in Studio. Delivery to Zoho/email is tracked per channel so the
// retry cron can re-attempt failures.
export const leadSchema = defineType({
  name: "lead",
  title: "Lead",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", readOnly: true }),
    defineField({ name: "mobile", title: "Mobile", type: "string", readOnly: true }),
    defineField({ name: "car", title: "Car (slug)", type: "string", readOnly: true }),
    defineField({ name: "carName", title: "Car", type: "string", readOnly: true }),
    defineField({ name: "type", title: "Enquiry Type", type: "string", readOnly: true }),
    defineField({ name: "location", title: "Location", type: "string", readOnly: true }),
    defineField({ name: "city", title: "City Page", type: "string", readOnly: true }),
    defineField({ name: "message", title: "Message", type: "text", readOnly: true }),
    defineField({ name: "source", title: "Source", type: "string", readOnly: true, description: "website | chatbot" }),
    defineField({ name: "pageUrl", title: "Page URL", type: "url", readOnly: true }),
    defineField({
      name: "utm",
      title: "Campaign (UTM)",
      type: "object",
      readOnly: true,
      fields: [
        defineField({ name: "source", title: "utm_source", type: "string" }),
        defineField({ name: "medium", title: "utm_medium", type: "string" }),
        defineField({ name: "campaign", title: "utm_campaign", type: "string" }),
        defineField({ name: "term", title: "utm_term", type: "string" }),
        defineField({ name: "content", title: "utm_content", type: "string" }),
      ],
    }),
    defineField({ name: "submittedAt", title: "Submitted At", type: "datetime", readOnly: true }),
    defineField({ name: "userAgent", title: "User Agent", type: "string", readOnly: true, hidden: true }),
    defineField({ name: "ipAddress", title: "IP Address", type: "string", readOnly: true, hidden: true }),
    defineField({
      name: "emailStatus",
      title: "Email Delivery",
      type: "string",
      options: { list: ["pending", "sent", "failed", "skipped"] },
      readOnly: true,
    }),
    defineField({
      name: "zohoStatus",
      title: "Zoho CRM Delivery",
      type: "string",
      options: { list: ["pending", "sent", "failed", "skipped"] },
      readOnly: true,
    }),
    defineField({ name: "zohoLeadId", title: "Zoho Lead ID", type: "string", readOnly: true }),
    defineField({
      name: "followUpStatus",
      title: "Follow-up Status",
      type: "string",
      options: { list: ["new", "contacted", "test-drive-booked", "converted", "lost"] },
      initialValue: "new",
      description: "For the sales team — update as you work the lead.",
    }),
  ],
  orderings: [
    { title: "Newest first", name: "submittedAtDesc", by: [{ field: "submittedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "carName", description: "type" },
    prepare: ({ title, subtitle, description }) => ({
      title: title ?? "Lead",
      subtitle: [subtitle, description].filter(Boolean).join(" · "),
    }),
  },
});
