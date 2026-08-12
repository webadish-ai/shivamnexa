import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";
import type { Car, City } from "./data";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "b1j47ohj";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-01-01";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// Server-side write client — needs SANITY_API_TOKEN
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Powers Presentation-tool visual editing: click-to-edit overlays and live
// draft updates when SANITY_API_READ_TOKEN is set (see /studio, Presentation
// tab). Falls back to plain published reads otherwise — SanityLive is a
// harmless no-op without a token.
export const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
});

// `buildTime: true` skips draft-mode detection — required in generateStaticParams,
// which runs at build time with no HTTP request to read the draft-mode cookie from.
type FetchOpts = { buildTime?: boolean };

export async function getAllCars(opts: FetchOpts = {}): Promise<Car[]> {
  const { data } = await sanityFetch({
    query: `*[_type == "car"] | order(name asc) {
      "slug": slug.current,
      name, fullName, segment, startingPrice, tagline, description,
      seating, mileage, engine, keyFeatures, imageAlt,
      variants, faqs, colors, highlights, specs
    }`,
    ...(opts.buildTime ? { perspective: "published" as const, stega: false } : {}),
  });
  return data as Car[];
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  const { data } = await sanityFetch({
    query: `*[_type == "car" && slug.current == $slug][0] {
      "slug": slug.current,
      name, fullName, segment, startingPrice, tagline, description,
      seating, mileage, engine, keyFeatures, imageAlt,
      variants, faqs, colors, highlights, specs
    }`,
    params: { slug },
  });
  return data as Car | null;
}

export async function getAllCities(opts: FetchOpts = {}): Promise<City[]> {
  const { data } = await sanityFetch({
    query: `*[_type == "city"] | order(name asc) {
      "slug": slug.current,
      name, state, rtoCode
    }`,
    ...(opts.buildTime ? { perspective: "published" as const, stega: false } : {}),
  });
  return data as City[];
}

export type PortableTextBlock = { _type: string; [key: string]: unknown };

export type Post = {
  slug: string;
  title: string;
  excerpt?: string;
  mainImage?: { asset?: { _ref: string }; alt?: string };
  publishedAt: string;
  _updatedAt?: string;
  body?: PortableTextBlock[];
  seoTitle?: string;
  seoDescription?: string;
};

export type Page = {
  slug: string;
  title: string;
  heroImage?: { asset?: { _ref: string }; alt?: string };
  body?: PortableTextBlock[];
  showLeadForm?: boolean;
  leadFormType?: "contact" | "quote" | "test-drive";
  faqs?: { q: string; a: string }[];
  seoTitle?: string;
  seoDescription?: string;
  noIndex?: boolean;
  _updatedAt?: string;
};

const POST_FIELDS = `
  "slug": slug.current,
  title, excerpt, mainImage, publishedAt, _updatedAt,
  seoTitle, seoDescription
`;

export async function getAllPosts(opts: FetchOpts = {}): Promise<Post[]> {
  const { data } = await sanityFetch({
    query: `*[_type == "post"] | order(publishedAt desc) { ${POST_FIELDS} }`,
    ...(opts.buildTime ? { perspective: "published" as const, stega: false } : {}),
  });
  return data as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data } = await sanityFetch({
    query: `*[_type == "post" && slug.current == $slug][0] { ${POST_FIELDS}, body }`,
    params: { slug },
  });
  return data as Post | null;
}

export async function getAllPages(opts: FetchOpts = {}): Promise<Page[]> {
  const { data } = await sanityFetch({
    query: `*[_type == "page"] { "slug": slug.current, title, noIndex, _updatedAt }`,
    ...(opts.buildTime ? { perspective: "published" as const, stega: false } : {}),
  });
  return data as Page[];
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const { data } = await sanityFetch({
    query: `*[_type == "page" && slug.current == $slug][0] {
      "slug": slug.current,
      title, heroImage, body, showLeadForm, leadFormType, faqs,
      seoTitle, seoDescription, noIndex, _updatedAt
    }`,
    params: { slug },
  });
  return data as Page | null;
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const { data } = await sanityFetch({
    query: `*[_type == "city" && slug.current == $slug][0] {
      "slug": slug.current,
      name, state, rtoCode
    }`,
    params: { slug },
  });
  return data as City | null;
}
