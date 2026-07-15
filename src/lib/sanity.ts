import { createClient } from "next-sanity";
import type { Car, City } from "./data";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
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

export async function getAllCars(): Promise<Car[]> {
  return sanityClient.fetch(`
    *[_type == "car"] | order(name asc) {
      "slug": slug.current,
      name, fullName, segment, startingPrice, tagline, description,
      seating, mileage, engine, keyFeatures, imageAlt,
      variants, faqs, colors, highlights, specs
    }
  `);
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  return sanityClient.fetch(
    `*[_type == "car" && slug.current == $slug][0] {
      "slug": slug.current,
      name, fullName, segment, startingPrice, tagline, description,
      seating, mileage, engine, keyFeatures, imageAlt,
      variants, faqs, colors, highlights, specs
    }`,
    { slug }
  );
}

export async function getAllCities(): Promise<City[]> {
  return sanityClient.fetch(`
    *[_type == "city"] | order(name asc) {
      "slug": slug.current,
      name, state, rtoCode
    }
  `);
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

export async function getAllPosts(): Promise<Post[]> {
  return sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc) { ${POST_FIELDS} }`
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] { ${POST_FIELDS}, body }`,
    { slug }
  );
}

export async function getAllPages(): Promise<Page[]> {
  return sanityClient.fetch(
    `*[_type == "page"] { "slug": slug.current, title, noIndex, _updatedAt }`
  );
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  return sanityClient.fetch(
    `*[_type == "page" && slug.current == $slug][0] {
      "slug": slug.current,
      title, heroImage, body, showLeadForm, leadFormType, faqs,
      seoTitle, seoDescription, noIndex, _updatedAt
    }`,
    { slug }
  );
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  return sanityClient.fetch(
    `*[_type == "city" && slug.current == $slug][0] {
      "slug": slug.current,
      name, state, rtoCode
    }`,
    { slug }
  );
}
