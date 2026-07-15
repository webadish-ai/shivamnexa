import Link from "next/link";
import HlsVideoPlayer from "@/components/showcase/HlsVideoPlayer";
import type { ShowcaseModel } from "@/lib/showcase";

export default function ShowcaseModelPage({ model }: { model: ShowcaseModel }) {
  const heroClip = model.clips.find((clip) => clip.id === model.heroClipId) ?? model.clips[0];
  const secondaryClips = model.clips.filter((clip) => clip.id !== heroClip.id);

  return (
    <div className={`min-h-screen text-white ${model.themeClass}`}>
      <section className="relative isolate min-h-screen overflow-hidden">
        <HlsVideoPlayer
          src={heroClip.manifest}
          poster={heroClip.poster}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          controls={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
        <div className={`absolute inset-0 bg-radial ${model.accent}`} />

        <div className="relative z-10 flex min-h-screen flex-col px-4 pb-10 pt-8 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/showcase/hero-video"
              className="inline-flex rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10"
            >
              Back to all options
            </Link>
            <div className="hidden rounded-full border border-white/15 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/60 md:inline-flex">
              Official NEXA motion showcase
            </div>
          </div>

          <div className="mt-auto grid items-end gap-8 pb-6 pt-24 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/55">
                {model.eyebrow}
              </p>
              <h1 className="mt-5 text-5xl font-semibold tracking-tight md:text-7xl xl:text-[5.5rem]">
                {model.name}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-white/78 md:text-xl md:leading-8">
                {model.heading}. {model.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:bg-white/90"
                >
                  Book Test Drive
                </Link>
                <a
                  href="https://wa.me/918828199999?text=Hi, I want help with a NEXA car"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-white/25 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  WhatsApp Sales
                </a>
              </div>
            </div>

            <div className="justify-self-start rounded-[2rem] border border-white/15 bg-black/35 p-6 backdrop-blur-sm lg:justify-self-end">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                {heroClip.label}
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">{heroClip.title}</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/72">
                {heroClip.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-12 md:px-8 lg:px-12 xl:px-16">
        <div className="grid gap-4 md:grid-cols-3">
          {model.clips.map((clip) => (
            <div key={clip.id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                {clip.label}
              </p>
              <h3 className="mt-3 text-2xl font-semibold">{clip.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/66">{clip.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-0">
        {secondaryClips.map((clip, index) => (
          <section
            key={clip.id}
            className={`grid min-h-screen items-stretch border-t border-white/10 ${
              index % 2 === 0 ? "lg:grid-cols-[1.35fr_0.65fr]" : "lg:grid-cols-[0.65fr_1.35fr]"
            }`}
          >
            <div className={`${index % 2 === 0 ? "lg:order-1" : "lg:order-2"} relative min-h-[60vh] overflow-hidden bg-black`}>
              <HlsVideoPlayer
                src={clip.manifest}
                poster={clip.poster}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                controls={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/15 lg:via-transparent lg:to-transparent" />
            </div>

            <div
              className={`flex items-center ${index % 2 === 0 ? "lg:order-2" : "lg:order-1"} px-6 py-12 md:px-10 lg:px-14 xl:px-20`}
            >
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
                  {clip.label}
                </p>
                <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                  {clip.title}
                </h2>
                <p className="mt-5 text-base leading-7 text-white/70 md:text-lg">
                  {clip.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex rounded-full border border-white/20 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
                  >
                    Use this direction
                  </Link>
                  <Link
                    href="/showcase/hero-video"
                    className="inline-flex rounded-full px-5 py-3 text-sm font-medium text-white/70 transition hover:text-white"
                  >
                    Compare all showcase options
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
