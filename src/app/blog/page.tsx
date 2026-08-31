import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { getAllPosts } from "@/lib/sanity";
import { urlForImage } from "@/lib/sanityImage";
import { getAbsoluteUrl } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "NEXA Car News, Buying Guides & Tips — Shivam NEXA Blog",
  description:
    "Expert advice on Maruti Suzuki NEXA cars — buying guides, on-road price updates, EV news, service tips and offers for Mumbai, Thane, Navi Mumbai & Palghar.",
  alternates: { canonical: getAbsoluteUrl("/blog") },
};

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: getAbsoluteUrl("/") },
              { name: "Blog", url: getAbsoluteUrl("/blog") },
            ])
          ),
        }}
      />
      <PageHero
        eyebrow="Shivam NEXA Blog"
        title="NEXA Car Guides & News"
        subtitle="Buying guides, price updates, and ownership tips from the Shivam NEXA team."
      />
      <div className="container mx-auto px-4 py-12">

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No articles published yet — check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                {post.mainImage?.asset ? (
                  <Image
                    src={urlForImage(post.mainImage).width(640).height(360).url()}
                    alt={post.mainImage.alt ?? post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    🚗
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs text-muted-foreground mb-2">
                  {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h2 className="font-semibold leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
