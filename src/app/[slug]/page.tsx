import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LeadForm from "@/components/LeadForm";
import PortableTextContent from "@/components/PortableTextContent";
import { getAllPages, getPageBySlug } from "@/lib/sanity";
import { urlForImage } from "@/lib/sanityImage";
import { getAbsoluteUrl } from "@/lib/site";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

// Renders Sanity "page" documents (migrated WordPress pages) at /{slug}.
// Static app routes (e.g. /about-us, /contact) take precedence over this route.
type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const pages = await getAllPages({ buildTime: true });
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};
  const title = page.seoTitle ?? page.title;
  const description = page.seoDescription;
  return {
    title,
    description,
    openGraph: { title, description, url: getAbsoluteUrl(`/${page.slug}`) },
    alternates: { canonical: getAbsoluteUrl(`/${page.slug}`) },
    ...(page.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function GenericPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const showForm = page.showLeadForm !== false;

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: getAbsoluteUrl("/") },
              { name: page.title, url: getAbsoluteUrl(`/${page.slug}`) },
            ])
          ),
        }}
      />
      {page.faqs && page.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(page.faqs)) }}
        />
      )}

      <div
        className={
          showForm
            ? "grid lg:grid-cols-[1fr_360px] gap-12 max-w-6xl mx-auto items-start"
            : "max-w-3xl mx-auto"
        }
      >
        <article className="min-w-0">
          <nav className="text-sm text-muted-foreground mb-6 flex gap-2">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <span className="text-foreground">{page.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-8">
            {page.title}
          </h1>
          {page.heroImage?.asset && (
            <Image
              src={urlForImage(page.heroImage).width(1280).url()}
              alt={page.heroImage.alt ?? page.title}
              width={1280}
              height={720}
              priority
              className="rounded-xl w-full h-auto mb-8"
            />
          )}
          {page.body && <PortableTextContent value={page.body} />}

          {page.faqs && page.faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => (
                  <details
                    key={faq.q}
                    className="group rounded-xl border bg-card overflow-hidden"
                    open={i === 0}
                  >
                    <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-sm list-none hover:bg-muted/30 transition-colors">
                      <span>{faq.q}</span>
                      <span className="ml-4 shrink-0 text-muted-foreground group-open:rotate-180 transition-transform">
                        ↓
                      </span>
                    </summary>
                    <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}
        </article>

        {showForm && (
          <aside className="lg:sticky lg:top-24">
            <LeadForm formType={page.leadFormType ?? "contact"} className="shadow-lg" />
          </aside>
        )}
      </div>
    </div>
  );
}
