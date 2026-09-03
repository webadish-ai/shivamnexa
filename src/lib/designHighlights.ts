export type DesignHighlight = {
  image: string;
  title: string;
  description: string;
};

// Real product photography paired with official spec copy — code-defined
// (not Sanity-managed) since these are fixed launch assets, not marketing
// text editors need to change day to day. Only populated for models where
// we have real photography; the section hides itself otherwise.
export const DESIGN_HIGHLIGHTS: Record<string, DesignHighlight[]> = {
  "e-vitara": [
    {
      image: "/cars/e-vitara/02-front-fascia.png",
      title: "NEXTrè 3-Point Matrix LED DRLs",
      description:
        "A futuristic front fascia shaped by aerodynamics, framed by the signature 3-point matrix LED daytime running lights.",
    },
    {
      image: "/cars/e-vitara/04-rear-lamps.png",
      title: "NEXTrè 3-Point Matrix Rear Lamps",
      description:
        "Matching 3-point matrix LED tail lamps complete the e Vitara's sculpted, muscular rear stance.",
    },
    {
      image: "/cars/e-vitara/05-alloy-wheel.png",
      title: "225/55 R18 Aero Alloy Wheels",
      description:
        "Aerodynamically optimized 18-inch alloy wheels with aero garnish reduce drag and add to the e Vitara's planted stance.",
    },
    {
      image: "/cars/e-vitara/11-battery-pack.png",
      title: "HEARTECT-e Pure Electric Platform",
      description:
        "A purpose-built EV platform housing a high-capacity battery pack rated to operate from -30°C to 60°C, delivering up to 543 km on a single charge.",
    },
  ],
};
