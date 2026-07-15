export type ShowcaseClip = {
  id: string;
  label: string;
  title: string;
  description: string;
  manifest: string;
  poster: string;
};

export type ShowcaseModel = {
  slug: "e-vitara" | "grand-vitara" | "fronx";
  name: string;
  eyebrow: string;
  heading: string;
  description: string;
  accent: string;
  themeClass: string;
  heroClipId: string;
  clips: ShowcaseClip[];
};

export const SHOWCASE_MODELS: ShowcaseModel[] = [
  {
    slug: "e-vitara",
    name: "e VITARA",
    eyebrow: "Electric Flagship Direction",
    heading: "Futuristic launch-film storytelling with a premium EV mood",
    description:
      "A darker, cinematic treatment built around official NEXA e VITARA motion. This direction is strongest when the client wants aspiration first and sales copy second.",
    accent: "from-cyan-300/30 via-emerald-300/10 to-transparent",
    themeClass: "bg-[#04080d]",
    heroClipId: "exterior",
    clips: [
      {
        id: "exterior",
        label: "Hero Film",
        title: "Exterior driving sequence",
        description:
          "Best for the opening fold. Establishes presence, motion, and futuristic premium positioning in a way static imagery cannot.",
        manifest: "/videos/showcase/e-vitara/exterior/master.m3u8",
        poster: "/videos/showcase/e-vitara/exterior/poster.jpg",
      },
      {
        id: "interior",
        label: "Cabin Story",
        title: "Interior premium-tech sequence",
        description:
          "Works well further down the page near features, technology, comfort, or lead-gen content aimed at premium family buyers.",
        manifest: "/videos/showcase/e-vitara/interior/master.m3u8",
        poster: "/videos/showcase/e-vitara/interior/poster.jpg",
      },
    ],
  },
  {
    slug: "grand-vitara",
    name: "Grand Vitara",
    eyebrow: "SUV Prestige Direction",
    heading: "Adventure, premium utility, and feature-led storytelling",
    description:
      "This route feels more grounded and commercially usable for Shivam NEXA because it balances aspiration with a broader family-SUV buying story.",
    accent: "from-lime-300/25 via-amber-300/10 to-transparent",
    themeClass: "bg-[#090908]",
    heroClipId: "hero",
    clips: [
      {
        id: "hero",
        label: "Hero Film",
        title: "Brand-led Grand Vitara TVC",
        description:
          "Suitable for the top fold when the client wants a premium national-campaign feel adapted to the dealership site.",
        manifest: "/videos/showcase/grand-vitara/hero/master.m3u8",
        poster: "/videos/showcase/grand-vitara/hero/poster.jpg",
      },
      {
        id: "terrain",
        label: "Terrain Clip",
        title: "SUV capability and movement",
        description:
          "Ideal for a secondary full-width panel that sells the SUV lifestyle, road confidence, and destination-led ownership appeal.",
        manifest: "/videos/showcase/grand-vitara/terrain/master.m3u8",
        poster: "/videos/showcase/grand-vitara/terrain/poster.jpg",
      },
      {
        id: "feature",
        label: "Feature Clip",
        title: "Premium feature highlight",
        description:
          "Useful inside a feature section where we want motion around sunroof, comfort, or high-value differentiators before the enquiry form.",
        manifest: "/videos/showcase/grand-vitara/feature/master.m3u8",
        poster: "/videos/showcase/grand-vitara/feature/poster.jpg",
      },
    ],
  },
  {
    slug: "fronx",
    name: "Fronx",
    eyebrow: "Sporty Urban Direction",
    heading: "Sharper, younger, more kinetic motion for a style-first buyer",
    description:
      "This concept is better for a trendier audience. It feels more youthful and performance-led, which may appeal if the client wants something less formal than the SUV or EV directions.",
    accent: "from-orange-300/30 via-rose-300/10 to-transparent",
    themeClass: "bg-[#0a0707]",
    heroClipId: "hero",
    clips: [
      {
        id: "hero",
        label: "Hero Film",
        title: "Primary launch-style Fronx motion",
        description:
          "A stronger first impression for a stylish compact SUV audience, especially on mobile where motion helps arrest scroll quickly.",
        manifest: "/videos/showcase/fronx/hero/master.m3u8",
        poster: "/videos/showcase/fronx/hero/poster.jpg",
      },
      {
        id: "exterior",
        label: "Exterior Clip",
        title: "Sporty exterior movement",
        description:
          "Supports styling, design, and dynamic-road sections where the page needs more energy and less corporate calm.",
        manifest: "/videos/showcase/fronx/exterior/master.m3u8",
        poster: "/videos/showcase/fronx/exterior/poster.jpg",
      },
      {
        id: "interior",
        label: "Interior Clip",
        title: "Cabin and tech atmosphere",
        description:
          "Use this deeper in the page to support premium features, infotainment, and a more upscale ownership pitch.",
        manifest: "/videos/showcase/fronx/interior/master.m3u8",
        poster: "/videos/showcase/fronx/interior/poster.jpg",
      },
    ],
  },
];

export function getShowcaseModel(slug: string) {
  return SHOWCASE_MODELS.find((model) => model.slug === slug);
}

