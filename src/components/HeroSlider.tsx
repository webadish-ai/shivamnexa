"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import HlsVideoPlayer from "@/components/showcase/HlsVideoPlayer";
import { Car, formatPrice, getCarImagePath } from "@/lib/data";
import { getShowcaseModel } from "@/lib/showcase";

type HeroSliderProps = {
  cars: Car[];
};

const AUTOPLAY_MS = 5500;

export default function HeroSlider({ cars }: HeroSliderProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      setActive(((index % cars.length) + cars.length) % cars.length);
    },
    [cars.length]
  );

  useEffect(() => {
    if (paused || cars.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % cars.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, cars.length]);

  if (cars.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[62vh] min-h-[420px] max-h-[680px] w-full">
        {cars.map((car, i) => {
          const showcase = getShowcaseModel(car.slug);
          const heroClip = showcase
            ? (showcase.clips.find((clip) => clip.id === showcase.heroClipId) ?? showcase.clips[0])
            : null;

          return (
          <div
            key={car.slug}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}
            aria-hidden={i !== active}
          >
            {heroClip && i === active ? (
              <HlsVideoPlayer
                src={heroClip.manifest}
                poster={heroClip.poster}
                autoPlay
                muted
                loop
                controls={false}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={heroClip?.poster ?? getCarImagePath(car.slug)}
                alt={car.imageAlt || `${car.fullName} — Shivam NEXA`}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />

            <div className="relative z-10 flex h-full items-end">
              <div className="container mx-auto px-4 pb-12 md:pb-16">
                <div className="max-w-xl">
                  <Badge className="mb-3">{car.segment}</Badge>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-2">
                    {car.fullName}
                  </h2>
                  <p className="text-base md:text-lg text-white/80 mb-4">{car.tagline}</p>
                  <p className="text-sm text-white/70 mb-6">
                    Starting from{" "}
                    <span className="text-xl font-bold text-white">{formatPrice(car.startingPrice)}</span>{" "}
                    ex-showroom
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <LinkButton size="lg" href={`/contact?car=${car.slug}&type=test-drive`}>
                      Book Test Drive
                    </LinkButton>
                    <LinkButton
                      variant="outline"
                      size="lg"
                      className="border-white/40 text-white hover:bg-white/10 hover:text-white"
                      href={`/cars/${car.slug}`}
                    >
                      View Details
                    </LinkButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          );
        })}

        {cars.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => goTo(active - 1)}
              className="absolute left-3 md:left-6 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => goTo(active + 1)}
              className="absolute right-3 md:right-6 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              ›
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {cars.map((car, i) => (
                <button
                  key={car.slug}
                  type="button"
                  aria-label={`Go to ${car.fullName} slide`}
                  aria-current={i === active}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
