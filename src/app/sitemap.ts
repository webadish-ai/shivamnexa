import { MetadataRoute } from "next";
import { getAllCars, getAllCities, getAllPages, getAllPosts } from "@/lib/sanity";
import { getAbsoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [CARS, CITIES, pages, posts] = await Promise.all([
    getAllCars(),
    getAllCities(),
    getAllPages(),
    getAllPosts(),
  ]);
  const staticPages: MetadataRoute.Sitemap = [
    { url: getAbsoluteUrl("/"), lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: getAbsoluteUrl("/cars"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: getAbsoluteUrl("/about-us"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: getAbsoluteUrl("/awards"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: getAbsoluteUrl("/contact"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: getAbsoluteUrl("/nexa-service-center"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: getAbsoluteUrl("/service-on-wheels"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const modelPages: MetadataRoute.Sitemap = CARS.map((car) => ({
    url: getAbsoluteUrl(`/cars/${car.slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // City+model pages — the core SEO pages
  const cityModelPages: MetadataRoute.Sitemap = CARS.flatMap((car) =>
    CITIES.map((city) => ({
      url: getAbsoluteUrl(`/cars/${car.slug}/${city.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }))
  );

  // Migrated WordPress pages (Sanity "page" docs served by /[slug])
  const contentPages: MetadataRoute.Sitemap = pages
    .filter((page) => !page.noIndex)
    .map((page) => ({
      url: getAbsoluteUrl(`/${page.slug}`),
      lastModified: page._updatedAt ? new Date(page._updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const blogPages: MetadataRoute.Sitemap = [
    ...(posts.length > 0
      ? [{
          url: getAbsoluteUrl("/blog"),
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }]
      : []),
    ...posts.map((post) => ({
      url: getAbsoluteUrl(`/blog/${post.slug}`),
      lastModified: post._updatedAt ? new Date(post._updatedAt) : new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticPages, ...modelPages, ...cityModelPages, ...contentPages, ...blogPages];
}
