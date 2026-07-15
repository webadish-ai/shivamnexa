import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "@/lib/sanity";
import { urlForImage } from "@/lib/sanityImage";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-6">
          <Image
            src={urlForImage(value).width(1200).url()}
            alt={value.alt ?? ""}
            width={1200}
            height={675}
            className="rounded-xl w-full h-auto"
          />
          {value.alt && (
            <figcaption className="text-xs text-muted-foreground mt-2 text-center">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const isInternal = href.startsWith("/") || href.includes("shivamnexa.com");
      if (isInternal) {
        const path = href.replace(/https?:\/\/(www\.)?shivamnexa\.com/, "") || "/";
        return (
          <Link href={path} className="text-primary underline underline-offset-2">
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2"
        >
          {children}
        </a>
      );
    },
  },
};

export default function PortableTextContent({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-img:rounded-xl">
      <PortableText value={value} components={components} />
    </div>
  );
}
