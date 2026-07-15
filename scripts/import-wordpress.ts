// Import WordPress content from shivamnexa.com into Sanity.
//
//   SANITY_API_TOKEN=xxx npx tsx scripts/import-wordpress.ts [--posts] [--pages] [--dry-run]
//
// - Posts (wp-json/wp/v2/posts) → Sanity "post" docs, slugs preserved (served at /blog/{slug})
// - Pages (wp-json/wp/v2/pages) → Sanity "page" docs, slugs preserved (served at /{slug})
// - Pages whose content already exists as coded routes or that only get a 301
//   (see src/lib/redirects.ts) are skipped.
// - Featured images and inline <img> tags are uploaded as Sanity assets.
// - Yoast SEO title/description are preserved when the site exposes yoast_head_json.
//
// Re-runnable: documents are created with deterministic _ids via createOrReplace.

import { createClient } from "@sanity/client";
import { htmlToBlocks } from "@portabletext/block-tools";
import { Schema } from "@sanity/schema";
import { JSDOM } from "jsdom";
import { BLOG_POST_SLUGS } from "../src/lib/redirects";

const WP_BASE = "https://shivamnexa.com/wp-json/wp/v2";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "b1j47ohj",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// WP pages that must NOT be imported as Sanity pages: they exist as coded
// routes on the new site or are redirected away (src/lib/redirects.ts).
const SKIP_PAGE_SLUGS = new Set([
  "about-us",
  "contact",
  "blog",
  "sitemap",
  "home",
  "homepage",
  "august-offer-thank-you",
  "thank-you-page",
  "thankyou-grand-vitara-landing-page",
  "shivam-signature-limited-edition",
  "e-vitara",
  "grand-vitara-mumbai",
  "grand-vitara-landing-page",
  "grand-vitara-kandivali",
  "grand-vitara-on-road-price-thane",
  "maruti-suzuki-nexa-cars",
  "award-winning-nexa-dealer",
  "shivam-outlet-location",
  "book-maruti-nexa-car-service-center",
  "book-maruti-suzuki-xl6-car",
  "book-maruti-suzuki-baleno-car",
  "book-maruti-suzuki-jimny-car",
  "book-maruti-suzuki-fronx-car",
  "book-maruti-suzuki-grand-vitara-car",
  "book-maruti-suzuki-e-vitara-car",
  "book-maruti-invicto-car",
  // Coded route on the new site
  "service-on-wheels",
  // Unlisted ads landing pages — redirected to /cars/{model}/{city}
  "grand-vitara-suv-on-road-price-in-mumbai",
  "grand-vitara-suv-on-road-price-in-thane",
  "grand-vitara-palghar",
  "maruti-suzuki-grand-vitara-suv-palghar",
  "e-vitara-in-palghar",
  "thank-you-grand-vitara-suv-on-road-price-in-palghar",
]);

// Old-site posts that are pages/coded routes or redirected — skip as posts.
const SKIP_POST_SLUGS = new Set([
  "nexa-service-center",
  "service-on-wheels",
  "shivam-signature-limited-edition", // redirected to /cars
  "maruti-suzuki-baleno", // redirected to /cars/baleno
]);

type WpItem = {
  slug: string;
  link: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  content: { rendered: string };
  date_gmt: string;
  modified_gmt: string;
  featured_media?: number;
  yoast_head_json?: { title?: string; description?: string; og_description?: string };
};

const dryRun = process.argv.includes("--dry-run");
const onlyPosts = process.argv.includes("--posts") && !process.argv.includes("--pages");
const onlyPages = process.argv.includes("--pages") && !process.argv.includes("--posts");

// Minimal schema so block-tools knows the shape of our portable text fields.
const blockSchema = Schema.compile({
  name: "import",
  types: [
    {
      name: "body",
      type: "array",
      // Images are handled by the custom <img> rule below, so only "block"
      // needs to be in the schema (the full sanity image type doesn't compile
      // outside a Studio context).
      of: [{ type: "block" }],
    },
  ],
});
const blockContentType = blockSchema.get("body");

function stripHtml(html: string): string {
  return new JSDOM(`<body>${html}</body>`).window.document.body.textContent?.trim() ?? "";
}

async function fetchAll(resource: "posts" | "pages"): Promise<WpItem[]> {
  const items: WpItem[] = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${WP_BASE}/${resource}?per_page=100&page=${page}&status=publish`);
    if (res.status === 400) break; // past the last page
    if (!res.ok) throw new Error(`WP API ${resource} page ${page}: ${res.status}`);
    const batch = (await res.json()) as WpItem[];
    items.push(...batch);
    if (batch.length < 100) break;
  }
  return items;
}

const imageCache = new Map<string, string>(); // src URL → Sanity asset _id

async function uploadImage(src: string): Promise<string | null> {
  if (imageCache.has(src)) return imageCache.get(src)!;
  try {
    const res = await fetch(src);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = new URL(src).pathname.split("/").pop() || "image";
    const asset = await client.assets.upload("image", buffer, { filename });
    imageCache.set(src, asset._id);
    return asset._id;
  } catch {
    console.warn(`    ! failed to fetch image ${src}`);
    return null;
  }
}

async function fetchFeaturedImage(mediaId?: number): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string }; alt?: string } | null> {
  if (!mediaId) return null;
  try {
    const res = await fetch(`${WP_BASE}/media/${mediaId}`);
    if (!res.ok) return null;
    const media = (await res.json()) as { source_url?: string; alt_text?: string };
    if (!media.source_url) return null;
    const assetId = await uploadImage(media.source_url);
    if (!assetId) return null;
    return {
      _type: "image",
      asset: { _type: "reference", _ref: assetId },
      ...(media.alt_text ? { alt: media.alt_text } : {}),
    };
  } catch {
    return null;
  }
}

let keyCounter = 0;
const nextKey = () => `imported-${++keyCounter}`;

async function htmlToPortableText(html: string) {
  const blocks = htmlToBlocks(html, blockContentType, {
    parseHtml: (h) => new JSDOM(h).window.document,
    rules: [
      {
        deserialize(el, next, block) {
          const node = el as unknown as HTMLElement;
          if (node.tagName?.toLowerCase() !== "img") return undefined;
          const src = node.getAttribute("src");
          if (!src) return undefined;
          // Marker resolved to an uploaded asset below (deserialize hooks can't be async).
          return block({
            _type: "image",
            _pendingSrc: src,
            alt: node.getAttribute("alt") ?? undefined,
          });
        },
      },
    ],
  }) as Record<string, unknown>[];

  const resolved: Record<string, unknown>[] = [];
  for (const blk of blocks) {
    if (blk._type === "image" && typeof blk._pendingSrc === "string") {
      const assetId = await uploadImage(blk._pendingSrc);
      if (!assetId) continue; // drop images we couldn't fetch
      resolved.push({
        _type: "image",
        _key: nextKey(),
        asset: { _type: "reference", _ref: assetId },
        ...(blk.alt ? { alt: blk.alt } : {}),
      });
    } else {
      resolved.push({ _key: nextKey(), ...blk });
    }
  }
  return resolved;
}

async function importPosts() {
  console.log("Fetching WordPress posts…");
  const posts = await fetchAll("posts");
  console.log(`  ${posts.length} posts found`);

  const expected = new Set(BLOG_POST_SLUGS);

  for (const post of posts) {
    if (SKIP_POST_SLUGS.has(post.slug)) {
      console.log(`  – skipped (coded route): ${post.slug}`);
      continue;
    }
    if (!expected.has(post.slug)) {
      console.log(`  ! ${post.slug} not in redirects.ts BLOG_POST_SLUGS — importing anyway, add a redirect for it`);
    }
    const title = stripHtml(post.title.rendered);
    console.log(`  → ${post.slug}`);
    if (dryRun) continue;

    const [body, mainImage] = await Promise.all([
      htmlToPortableText(post.content.rendered),
      fetchFeaturedImage(post.featured_media),
    ]);

    await client.createOrReplace({
      _type: "post",
      _id: `post-${post.slug}`,
      title,
      slug: { _type: "slug", current: post.slug },
      excerpt: stripHtml(post.excerpt?.rendered ?? "").slice(0, 300) || undefined,
      ...(mainImage ? { mainImage } : {}),
      publishedAt: `${post.date_gmt}Z`,
      body,
      seoTitle: post.yoast_head_json?.title,
      seoDescription:
        post.yoast_head_json?.description ?? post.yoast_head_json?.og_description,
    });
  }
}

async function importPages() {
  console.log("Fetching WordPress pages…");
  const pages = await fetchAll("pages");
  console.log(`  ${pages.length} pages found`);

  for (const page of pages) {
    if (SKIP_PAGE_SLUGS.has(page.slug)) {
      console.log(`  – skipped (coded route / redirected): ${page.slug}`);
      continue;
    }
    const title = stripHtml(page.title.rendered);
    console.log(`  → ${page.slug}`);
    if (dryRun) continue;

    const [body, heroImage] = await Promise.all([
      htmlToPortableText(page.content.rendered),
      fetchFeaturedImage(page.featured_media),
    ]);

    const isLegal = /privacy|terms|refund/.test(page.slug);

    await client.createOrReplace({
      _type: "page",
      _id: `page-${page.slug}`,
      title,
      slug: { _type: "slug", current: page.slug },
      ...(heroImage ? { heroImage } : {}),
      body,
      showLeadForm: !isLegal,
      leadFormType: "contact",
      noIndex: false,
      seoTitle: page.yoast_head_json?.title,
      seoDescription:
        page.yoast_head_json?.description ?? page.yoast_head_json?.og_description,
    });
  }
}

async function main() {
  if (!dryRun && !process.env.SANITY_API_TOKEN) {
    throw new Error("SANITY_API_TOKEN is required (or pass --dry-run)");
  }
  if (!onlyPages) await importPosts();
  if (!onlyPosts) await importPages();
  console.log(dryRun ? "Dry run complete." : "Import complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
