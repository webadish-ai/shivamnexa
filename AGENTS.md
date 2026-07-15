<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Shivam NEXA — Project Goal

## What this site is

A Next.js 16 lead generation website for **Shivam Autozone NEXA**, an authorized Maruti Suzuki NEXA car dealership in Mumbai, Thane, Navi Mumbai, and Palghar (Maharashtra, India).

## Primary goal

**Generate maximum car sales leads** — test drive bookings, price quote requests, and WhatsApp enquiries — by outranking competitor `autovista.in` on Google for local car buying searches.

## How it does this

- **City × model landing pages** at `/cars/[model]/[city]/` (e.g. `/cars/xl6/mumbai/`) — one page per car model per city, each with on-road price breakdown, variant table, FAQ schema, and a lead form above the fold. These pages target high-intent queries like "XL6 on road price Mumbai" and "Jimny price Thane".
- **Schema markup** on every page: `AutoDealer`, `FAQPage`, `Product`, `BreadcrumbList` — for Google rich results.
- **Lead form** on every page: name + mobile + car model → dealer callback.
- **WhatsApp CTA** alongside every form.
- **Static generation** (`generateStaticParams`) — all 48 pages pre-rendered at build time for speed and SEO.

## Cars covered

XL6, Grand Vitara, Jimny, Fronx, Baleno, Invicto, e Vitara (Maruti Suzuki NEXA segment).

## Cities covered

Mumbai, Thane, Navi Mumbai, Palghar, Boisar.

## Key files

- `src/lib/data.ts` — all car models, variants, pricing, cities, dealer info. **Update prices here.**
- `src/lib/schema.ts` — JSON-LD schema generators.
- `src/app/cars/[model]/[city]/page.tsx` — the core SEO landing page template.
- `src/components/LeadForm.tsx` — lead capture form (needs wiring to CRM/API route).

## Domain

Target: `shivamnexa.in` (this new site). Existing WordPress: `shivamnexa.com`.

## Stack

Next.js 16 App Router · TypeScript · Tailwind CSS · shadcn/ui (Base UI variant — no `asChild` on Button/SheetTrigger).

## Do not change without reason

- City+model URL structure (`/cars/[model]/[city]/`) — this is the SEO architecture.
- Schema markup on every page — required for Google rich results.
- Lead form above the fold on city+model pages — conversion critical.
