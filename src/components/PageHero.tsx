import Image from "next/image";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: { src: string; alt: string };
};

export default function PageHero({ eyebrow, title, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gray-950">
      <div className="relative h-[34vh] min-h-[240px] max-h-[380px] w-full">
        {image ? (
          <>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/55 to-gray-950/10" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800" />
        )}

        <div className="relative z-10 flex h-full items-end">
          <div className="container mx-auto px-4 pb-8">
            {eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70 mb-2">
                {eyebrow}
              </p>
            )}
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight max-w-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 max-w-2xl text-base md:text-lg text-white/80">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
