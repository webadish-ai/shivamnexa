import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LeadForm from "@/components/LeadForm";
import PortableTextContent from "@/components/PortableTextContent";
import { getAllPosts, getPostBySlug } from "@/lib/sanity";
import { urlForImage } from "@/lib/sanityImage";
import { getAbsoluteUrl } from "@/lib/site";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { DEALER } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: getAbsoluteUrl(`/blog/${post.slug}`),
      ...(post.mainImage?.asset
        ? { images: [{ url: urlForImage(post.mainImage).width(1200).height(630).url() }] }
        : {}),
    },
    alternates: { canonical: getAbsoluteUrl(`/blog/${post.slug}`) },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            blogPostingSchema({
              title: post.title,
              description: post.seoDescription ?? post.excerpt,
              url: getAbsoluteUrl(`/blog/${post.slug}`),
              imageUrl: post.mainImage?.asset
                ? urlForImage(post.mainImage).width(1200).url()
                : undefined,
              publishedAt: post.publishedAt,
              updatedAt: post._updatedAt,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: getAbsoluteUrl("/") },
              { name: "Blog", url: getAbsoluteUrl("/blog") },
              { name: post.title, url: getAbsoluteUrl(`/blog/${post.slug}`) },
            ])
          ),
        }}
      />

      <div className="grid lg:grid-cols-[1fr_360px] gap-12 max-w-6xl mx-auto items-start">
        <article className="min-w-0">
          <nav className="text-sm text-muted-foreground mb-6 flex gap-2">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
            {post.title}
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            {new Date(post.publishedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · Shivam NEXA
          </p>
          {post.mainImage?.asset && (
            <Image
              src={urlForImage(post.mainImage).width(1280).url()}
              alt={post.mainImage.alt ?? post.title}
              width={1280}
              height={720}
              priority
              className="rounded-xl w-full h-auto mb-8"
            />
          )}
          {post.body && <PortableTextContent value={post.body} />}
        </article>

        <aside className="lg:sticky lg:top-24 space-y-6">
          <LeadForm formType="quote" className="shadow-lg" />
          <div className="rounded-xl border bg-card p-5 text-sm">
            <p className="font-semibold mb-2">Talk to a NEXA expert</p>
            <p className="text-muted-foreground mb-4">
              Best on-road prices in Mumbai, Thane, Navi Mumbai &amp; Palghar.
            </p>
            <div className="flex flex-col gap-2">
              <a href={`tel:${DEALER.phone}`} className="font-medium text-primary">
                📞 {DEALER.phone}
              </a>
              <a
                href={`https://wa.me/91${DEALER.phone}?text=Hi, I was reading your blog and have a question`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#25D366]"
              >
                💬 WhatsApp us
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
