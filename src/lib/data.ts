export type City = {
  slug: string;
  name: string;
  state: string;
  rtoCode: string;
};

export type CarVariant = {
  name: string;
  exShowroom: number;
  fuelType: "Petrol" | "CNG" | "Diesel" | "Electric" | "Hybrid";
  transmission: "Manual" | "Automatic" | "AMT";
};

export type CarColor = {
  name: string;
  hex: string;
};

export type CarSpecGroup = {
  category: string;
  items: { label: string; value: string }[];
};

export type CarHighlight = {
  icon: string;
  title: string;
  description: string;
};

export type Car = {
  slug: string;
  name: string;
  fullName: string;
  segment: string;
  startingPrice: number;
  tagline: string;
  description: string;
  seating: number;
  mileage: string;
  engine: string;
  keyFeatures: string[];
  variants: CarVariant[];
  faqs: { q: string; a: string }[];
  imageAlt: string;
  colors?: CarColor[];
  specs?: CarSpecGroup[];
  highlights?: CarHighlight[];
};

export const CITIES: City[] = [
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", rtoCode: "MH-01" },
  { slug: "thane", name: "Thane", state: "Maharashtra", rtoCode: "MH-04" },
  { slug: "navi-mumbai", name: "Navi Mumbai", state: "Maharashtra", rtoCode: "MH-43" },
  { slug: "palghar", name: "Palghar", state: "Maharashtra", rtoCode: "MH-48" },
  { slug: "boisar", name: "Boisar", state: "Maharashtra", rtoCode: "MH-48" },
];

export const CARS: Car[] = [
  {
    slug: "xl6",
    name: "XL6",
    fullName: "Maruti Suzuki XL6",
    segment: "Premium MPV",
    startingPrice: 1152300,
    tagline: "The Premium 6-Seater MPV",
    description:
      "The Maruti Suzuki XL6 is a premium 6-seater MPV built for families who demand style, space, and smart hybrid efficiency. Available with the latest K-Series Smart Hybrid engine.",
    seating: 6,
    mileage: "20.97 km/l",
    engine: "1462cc K15C Smart Hybrid",
    keyFeatures: [
      "Smart Hybrid Technology",
      "6-Seater Captain Seats",
      "9-inch SmartPlay Pro+ Infotainment",
      "360° Surround View Camera",
      "ADAS Safety Features",
    ],
    variants: [
      { name: "Zeta", exShowroom: 1152300, fuelType: "Petrol", transmission: "Manual" },
      { name: "Zeta AT", exShowroom: 1236300, fuelType: "Petrol", transmission: "Automatic" },
      { name: "Alpha", exShowroom: 1310300, fuelType: "Petrol", transmission: "Manual" },
      { name: "Alpha AT", exShowroom: 1400300, fuelType: "Petrol", transmission: "Automatic" },
    ],
    faqs: [
      {
        q: "What is the on-road price of XL6 in Mumbai?",
        a: "The XL6 on-road price in Mumbai starts at approximately ₹12.8 lakhs for the Zeta variant, including RTO, insurance, and handling charges. Contact Shivam NEXA for the exact current on-road price.",
      },
      {
        q: "Is XL6 available in CNG?",
        a: "The XL6 is currently available in petrol variants only. It comes with Smart Hybrid technology for improved fuel efficiency.",
      },
      {
        q: "What is the waiting period for XL6 in Mumbai?",
        a: "Waiting period for XL6 varies by variant and colour. Contact Shivam NEXA Mumbai showroom for current availability and waiting period.",
      },
      {
        q: "How many seats does the XL6 have?",
        a: "The XL6 is a 6-seater MPV with captain seats in the second row for a premium travel experience.",
      },
    ],
    imageAlt: "Maruti Suzuki XL6 premium 6-seater MPV in Mumbai",
    colors: [
      { name: "Nexa Blue", hex: "#1d3d6e" },
      { name: "Splendid Silver", hex: "#b4b8bd" },
      { name: "Pearl Arctic White", hex: "#f0f0eb" },
      { name: "Magma Grey", hex: "#4a4a4a" },
      { name: "Grandeur Grey", hex: "#6b6f75" },
      { name: "Brave Khaki (Dual Tone)", hex: "#7a6a4a" },
      { name: "Opulent Red", hex: "#8c1f1f" },
    ],
    highlights: [
      {
        icon: "⚡",
        title: "Smart Hybrid Technology",
        description:
          "Progressive Smart Hybrid with Idle Start-Stop delivers 20.97 km/l mileage and smoother low-end response.",
      },
      {
        icon: "👑",
        title: "6-Seater Captain Layout",
        description:
          "Premium captain seats in the second row with armrests — first-class travel for every passenger.",
      },
      {
        icon: "🛡️",
        title: "6 Airbags Standard",
        description:
          "Six airbags, ESP, Hill Hold and HEARTECT platform come standard across every XL6 variant.",
      },
      {
        icon: "📱",
        title: "SmartPlay Pro+ & Suzuki Connect",
        description:
          "17.78 cm touchscreen with wireless Android Auto/CarPlay, plus 40+ Suzuki Connect features.",
      },
    ],
    specs: [
      {
        category: "Engine & Performance",
        items: [
          { label: "Engine", value: "1462cc K15C Smart Hybrid Petrol" },
          { label: "Max Power", value: "103 PS @ 6000 rpm" },
          { label: "Max Torque", value: "136.8 Nm @ 4400 rpm" },
          { label: "Mileage (MT)", value: "20.27 km/l (ARAI)" },
          { label: "Mileage (AT)", value: "20.97 km/l (ARAI)" },
          { label: "Fuel Type", value: "Petrol (CNG on Zeta)" },
        ],
      },
      {
        category: "Transmission",
        items: [
          { label: "Manual", value: "5-Speed Manual" },
          { label: "Automatic", value: "6-Speed Torque Converter with Paddle Shifters" },
          { label: "Drive", value: "Front Wheel Drive" },
        ],
      },
      {
        category: "Dimensions & Capacity",
        items: [
          { label: "Length", value: "4,445 mm" },
          { label: "Width", value: "1,775 mm" },
          { label: "Height", value: "1,755 mm" },
          { label: "Wheelbase", value: "2,740 mm" },
          { label: "Ground Clearance", value: "180 mm" },
          { label: "Boot Space", value: "209 L (with all seats up)" },
          { label: "Fuel Tank", value: "45 L" },
          { label: "Seating", value: "6 (2+2+2 Captain)" },
        ],
      },
      {
        category: "Technology & Comfort",
        items: [
          { label: "Infotainment", value: "17.78 cm SmartPlay Pro+ (wireless AA/CP)" },
          { label: "Instrument Cluster", value: "17.78 cm Colour MID" },
          { label: "Cruise Control", value: "Standard on Alpha" },
          { label: "Climate Control", value: "Auto with Rear AC Vents" },
          { label: "Wireless Charger", value: "Available" },
          { label: "Connected Car", value: "Suzuki Connect (40+ features)" },
        ],
      },
      {
        category: "Safety",
        items: [
          { label: "Airbags", value: "6 Standard" },
          { label: "ESP + Hill Hold", value: "Standard" },
          { label: "360° Surround View Camera", value: "Alpha variant" },
          { label: "ABS + EBD", value: "Standard" },
          { label: "TPMS", value: "Standard" },
          { label: "ISOFIX Child Seat Anchors", value: "Standard" },
        ],
      },
    ],
  },
  {
    slug: "grand-vitara",
    name: "Grand Vitara",
    fullName: "Maruti Suzuki Grand Vitara",
    segment: "Premium SUV",
    startingPrice: 1076500,
    tagline: "India's #1 Premium SUV",
    description:
      "The Maruti Suzuki Grand Vitara is India's top-selling premium SUV, available with Strong Hybrid and mild-hybrid options. With available AllGrip AWD and up to 27.97 km/l mileage, it redefines SUV efficiency.",
    seating: 5,
    mileage: "27.97 km/l (Strong Hybrid)",
    engine: "1490cc Strong Hybrid / 1462cc K15C",
    keyFeatures: [
      "Strong Hybrid — 27.97 km/l",
      "AllGrip AWD option",
      "Head-Up Display",
      "9-inch SmartPlay Pro+ System",
      "6 Airbags Standard",
    ],
    variants: [
      { name: "Sigma", exShowroom: 1076500, fuelType: "Petrol", transmission: "Manual" },
      { name: "Delta", exShowroom: 1175500, fuelType: "Petrol", transmission: "Manual" },
      { name: "Zeta", exShowroom: 1317500, fuelType: "Petrol", transmission: "Manual" },
      { name: "Alpha Strong Hybrid", exShowroom: 1631500, fuelType: "Hybrid", transmission: "Automatic" },
    ],
    faqs: [
      {
        q: "What is the on-road price of Grand Vitara in Mumbai?",
        a: "The Grand Vitara on-road price in Mumbai starts at approximately ₹12 lakhs for the Sigma variant. Strong Hybrid variants are priced higher. Contact Shivam NEXA for the exact current on-road quote.",
      },
      {
        q: "What is the mileage of Grand Vitara Strong Hybrid?",
        a: "The Grand Vitara Strong Hybrid delivers 27.97 km/l (ARAI certified), making it one of the most fuel-efficient SUVs in India.",
      },
      {
        q: "Does Grand Vitara have AWD?",
        a: "Yes, the Grand Vitara AllGrip variant offers AWD (All Wheel Drive) with multiple terrain modes for enhanced control.",
      },
      {
        q: "What is the waiting period for Grand Vitara in Mumbai?",
        a: "Waiting periods vary by variant. Strong Hybrid and AllGrip variants may have longer waits. Contact Shivam NEXA Mumbai for current stock availability.",
      },
    ],
    imageAlt: "Maruti Suzuki Grand Vitara Strong Hybrid SUV in Mumbai",
    colors: [
      { name: "Nexa Blue", hex: "#1d3d6e" },
      { name: "Splendid Silver", hex: "#b4b8bd" },
      { name: "Grandeur Grey", hex: "#6b6f75" },
      { name: "Opulent Red", hex: "#8c1f1f" },
      { name: "Arctic White", hex: "#f0f0eb" },
      { name: "Magma Grey", hex: "#4a4a4a" },
      { name: "Sangria Red (Dual Tone)", hex: "#6e1a1a" },
      { name: "Cafe Brown (Dual Tone)", hex: "#5a3e2a" },
    ],
    highlights: [
      {
        icon: "🔋",
        title: "Strong Hybrid — 27.97 km/l",
        description:
          "Self-charging Strong Hybrid switches between pure EV, petrol, and hybrid modes — class-leading 27.97 km/l mileage.",
      },
      {
        icon: "🚙",
        title: "ALLGRIP SELECT 4x4",
        description:
          "Electronically controlled AWD with Auto, Sport, Snow, and Lock modes for confident terrain handling.",
      },
      {
        icon: "☀️",
        title: "Panoramic Sunroof",
        description:
          "Dual sliding panoramic sunroof opens up the cabin with sky-wide views and ambient airflow.",
      },
      {
        icon: "📺",
        title: "Head-Up Display + 22.86 cm Touchscreen",
        description:
          "Color HUD plus SmartPlay Pro+ with wireless Android Auto and Apple CarPlay.",
      },
    ],
    specs: [
      {
        category: "Engine & Performance",
        items: [
          { label: "Mild Hybrid Engine", value: "1462cc K15C Smart Hybrid" },
          { label: "Strong Hybrid Engine", value: "1490cc Atkinson + Electric Motor" },
          { label: "Max Power (Mild Hybrid)", value: "103 PS @ 6000 rpm" },
          { label: "System Power (Strong Hybrid)", value: "115.56 PS (combined)" },
          { label: "Mileage (Strong Hybrid)", value: "27.97 km/l (ARAI)" },
          { label: "Mileage (Mild Hybrid AT)", value: "21.11 km/l" },
        ],
      },
      {
        category: "Transmission",
        items: [
          { label: "Strong Hybrid", value: "e-CVT with Paddle Shifters" },
          { label: "Mild Hybrid", value: "5-Speed MT / 6-Speed AT" },
          { label: "Drive Options", value: "FWD / ALLGRIP SELECT AWD" },
          { label: "Drive Modes", value: "Auto, Sport, Snow, Lock (AWD)" },
        ],
      },
      {
        category: "Dimensions & Capacity",
        items: [
          { label: "Length", value: "4,345 mm" },
          { label: "Width", value: "1,795 mm" },
          { label: "Height", value: "1,645 mm" },
          { label: "Wheelbase", value: "2,600 mm" },
          { label: "Ground Clearance", value: "210 mm" },
          { label: "Boot Space", value: "373 L" },
          { label: "Fuel Tank", value: "45 L" },
        ],
      },
      {
        category: "Technology & Comfort",
        items: [
          { label: "Infotainment", value: "22.86 cm SmartPlay Pro+ (wireless AA/CP)" },
          { label: "Head-Up Display", value: "Colour HUD" },
          { label: "Sunroof", value: "Dual-Sliding Panoramic" },
          { label: "Audio", value: "Premium Infinity by Harman" },
          { label: "Wireless Charger", value: "Available" },
          { label: "Connected Car", value: "Suzuki Connect (40+ features)" },
        ],
      },
      {
        category: "Safety",
        items: [
          { label: "Airbags", value: "6 Standard" },
          { label: "ESP + Hill Hold + Hill Descent Control", value: "Standard" },
          { label: "360° Surround View Camera", value: "Available" },
          { label: "Electronic Parking Brake", value: "Strong Hybrid" },
          { label: "ABS + EBD + TPMS", value: "Standard" },
          { label: "Global NCAP", value: "5-Star (Adult Occupant)" },
        ],
      },
    ],
  },
  {
    slug: "jimny",
    name: "Jimny",
    fullName: "Maruti Suzuki Jimny",
    segment: "4x4 SUV",
    startingPrice: 1231500,
    tagline: "Born for the Wild",
    description:
      "The Maruti Suzuki Jimny is India's most capable 4x4 lifestyle SUV. With its iconic heritage, 3-door design, and true AllGrip Pro 4WD system, the Jimny is built for those who live for adventure.",
    seating: 4,
    mileage: "16.94 km/l",
    engine: "1462cc K15B",
    keyFeatures: [
      "AllGrip Pro 4WD System",
      "Ladder Frame Chassis",
      "Three 3-door body style",
      "Hill Hold & Descent Control",
      "9-inch SmartPlay Pro+ Infotainment",
    ],
    variants: [
      { name: "Zeta", exShowroom: 1231500, fuelType: "Petrol", transmission: "Manual" },
      { name: "Zeta AT", exShowroom: 1308200, fuelType: "Petrol", transmission: "Automatic" },
      { name: "Alpha", exShowroom: 1382500, fuelType: "Petrol", transmission: "Manual" },
      { name: "Alpha AT", exShowroom: 1454900, fuelType: "Petrol", transmission: "Automatic" },
    ],
    faqs: [
      {
        q: "What is the on-road price of Jimny in Mumbai?",
        a: "The Jimny on-road price in Mumbai starts at approximately ₹13.7 lakhs for the Zeta MT. On-road prices include RTO, insurance, and extended warranty. Contact Shivam NEXA for a precise quote.",
      },
      {
        q: "Is Jimny a 4x4?",
        a: "Yes, the Jimny features the AllGrip Pro 4WD system with a low-range transfer case, making it a genuine 4x4 capable of serious off-roading.",
      },
      {
        q: "What is the waiting period for Jimny in Mumbai?",
        a: "Jimny demand is high. Contact Shivam NEXA Mumbai for current waiting periods — we maintain stock across our Andheri and Kandivali showrooms.",
      },
      {
        q: "How many seats does the Jimny have?",
        a: "The Jimny has 4 seats in a 3-door body style. It prioritises adventure capability over passenger capacity.",
      },
    ],
    imageAlt: "Maruti Suzuki Jimny 4x4 off-road SUV in Mumbai",
    colors: [
      { name: "Kinetic Yellow (Black Roof)", hex: "#e9c41a" },
      { name: "Sizzling Red (Black Roof)", hex: "#b91c1c" },
      { name: "Bluish Black Pearl", hex: "#0a1320" },
      { name: "Granite Grey", hex: "#4d5158" },
      { name: "Pearl Arctic White", hex: "#f0f0eb" },
      { name: "Nexa Blue", hex: "#1d3d6e" },
    ],
    highlights: [
      {
        icon: "🏔️",
        title: "ALLGRIP PRO 4WD",
        description:
          "True 4x4 with low-range transfer case and 4L mode for serious off-road capability.",
      },
      {
        icon: "🛠️",
        title: "Ladder Frame Chassis",
        description:
          "Robust ladder frame and 3-link rigid axle suspension handle the toughest trails with ease.",
      },
      {
        icon: "🚗",
        title: "Iconic 3-Door Design",
        description:
          "Heritage boxy silhouette with round headlamps and clamshell bonnet — Jimny DNA preserved.",
      },
      {
        icon: "🔧",
        title: "1.5L K15B with Hill Control",
        description:
          "104 PS K15B engine paired with Hill Hold and Hill Descent Control for confident climbs.",
      },
    ],
    specs: [
      {
        category: "Engine & Performance",
        items: [
          { label: "Engine", value: "1462cc K15B Petrol" },
          { label: "Max Power", value: "104.8 PS @ 6000 rpm" },
          { label: "Max Torque", value: "134.2 Nm @ 4000 rpm" },
          { label: "Mileage (MT)", value: "16.94 km/l (ARAI)" },
          { label: "Mileage (AT)", value: "16.39 km/l (ARAI)" },
        ],
      },
      {
        category: "Transmission & Drive",
        items: [
          { label: "Manual", value: "5-Speed Manual" },
          { label: "Automatic", value: "4-Speed Torque Converter" },
          { label: "Drive", value: "ALLGRIP PRO 4WD with Low Range (4L)" },
          { label: "Drive Modes", value: "2H / 4H / 4L Transfer Case" },
        ],
      },
      {
        category: "Dimensions & Off-Road",
        items: [
          { label: "Length", value: "3,985 mm" },
          { label: "Width", value: "1,645 mm" },
          { label: "Height", value: "1,720 mm" },
          { label: "Wheelbase", value: "2,590 mm" },
          { label: "Ground Clearance", value: "210 mm" },
          { label: "Approach Angle", value: "36°" },
          { label: "Departure Angle", value: "50°" },
          { label: "Ramp-Over Angle", value: "24°" },
          { label: "Boot Space", value: "208 L (rear seats up) / 332 L (folded)" },
          { label: "Fuel Tank", value: "40 L" },
        ],
      },
      {
        category: "Technology & Comfort",
        items: [
          { label: "Infotainment", value: "22.86 cm SmartPlay Pro+" },
          { label: "Cruise Control", value: "Adaptive (AT variants)" },
          { label: "Auto AC", value: "Standard" },
          { label: "Connected Car", value: "Suzuki Connect" },
          { label: "Wireless Charger", value: "Available" },
        ],
      },
      {
        category: "Safety",
        items: [
          { label: "Airbags", value: "6 Standard" },
          { label: "Hill Hold + Hill Descent Control", value: "Standard" },
          { label: "Brake Limited Slip Differential", value: "Standard" },
          { label: "ESP + ABS + EBD", value: "Standard" },
          { label: "ISOFIX Child Seat Anchors", value: "Standard" },
          { label: "Rear Parking Sensors + Camera", value: "Standard" },
        ],
      },
    ],
  },
  {
    slug: "fronx",
    name: "Fronx",
    fullName: "Maruti Suzuki Fronx",
    segment: "Compact SUV Coupe",
    startingPrice: 684900,
    tagline: "The Sporty Compact SUV",
    description:
      "The Maruti Suzuki Fronx is a bold compact SUV coupe that combines sporty styling with smart hybrid efficiency. Starting at ₹6.84L, it's the most affordable NEXA SUV with turbo performance.",
    seating: 5,
    mileage: "21.79 km/l",
    engine: "998cc Turbo / 1197cc K12N",
    keyFeatures: [
      "1.0L Turbo Boosterjet Engine",
      "Smart Hybrid Technology",
      "HUD (Head-Up Display)",
      "9-inch SmartPlay Pro+",
      "360° Camera",
    ],
    variants: [
      { name: "Sigma", exShowroom: 684900, fuelType: "Petrol", transmission: "Manual" },
      { name: "Delta+", exShowroom: 820900, fuelType: "Petrol", transmission: "Manual" },
      { name: "Zeta Turbo", exShowroom: 993900, fuelType: "Petrol", transmission: "Automatic" },
      { name: "Alpha Turbo AT", exShowroom: 1068900, fuelType: "Petrol", transmission: "Automatic" },
    ],
    faqs: [
      {
        q: "What is the on-road price of Fronx in Mumbai?",
        a: "The Fronx on-road price in Mumbai starts at approximately ₹7.6 lakhs for the Sigma variant. Turbo variants are priced higher. Contact Shivam NEXA for the exact on-road price.",
      },
      {
        q: "Does Fronx have a turbo engine?",
        a: "Yes, select Fronx variants feature the 1.0L Boosterjet Turbo engine producing 99 bhp, offering sporty performance with good fuel efficiency.",
      },
      {
        q: "What is the mileage of Fronx?",
        a: "The Fronx delivers up to 21.79 km/l (ARAI) with the 1.2L Smart Hybrid variant, and 22.89 km/l with the 1.0 Turbo MT variant.",
      },
    ],
    imageAlt: "Maruti Suzuki Fronx compact SUV coupe in Mumbai",
    colors: [
      { name: "Nexa Blue", hex: "#1d3d6e" },
      { name: "Opulent Red", hex: "#8c1f1f" },
      { name: "Bluish Black", hex: "#0a1320" },
      { name: "Splendid Silver", hex: "#b4b8bd" },
      { name: "Earthen Brown", hex: "#5a3a2a" },
      { name: "Grandeur Grey", hex: "#6b6f75" },
      { name: "Arctic White", hex: "#f0f0eb" },
    ],
    highlights: [
      {
        icon: "🚀",
        title: "1.0L Turbo Boosterjet",
        description:
          "Launch with turbo power — 100 PS direct-injection Boosterjet for agile, responsive driving.",
      },
      {
        icon: "⚡",
        title: "Smart Hybrid Technology",
        description:
          "Smart Hybrid 1.2L K12N delivers 21.79 km/l with idle start-stop and torque assist.",
      },
      {
        icon: "📺",
        title: "Head-Up Display",
        description:
          "Speed, RPM, fuel economy, AC and alerts displayed within your line of sight.",
      },
      {
        icon: "📷",
        title: "360° View Camera",
        description:
          "Full surround view for stress-free parking and reduced blind spots in city traffic.",
      },
    ],
    specs: [
      {
        category: "Engine & Performance",
        items: [
          { label: "1.0L Turbo (Boosterjet)", value: "998cc Turbo Petrol" },
          { label: "Turbo — Max Power", value: "100 PS @ 5500 rpm" },
          { label: "Turbo — Max Torque", value: "147.6 Nm @ 2000-4500 rpm" },
          { label: "Turbo Mileage (MT)", value: "21.5 km/l (ARAI)" },
          { label: "1.2L K12N", value: "1197cc Dual Jet Dual VVT" },
          { label: "K12N — Max Power", value: "90 PS @ 6000 rpm" },
          { label: "K12N — Max Torque", value: "113 Nm @ 4400 rpm" },
          { label: "K12N Mileage (MT/AGS)", value: "21.79 km/l (ARAI)" },
        ],
      },
      {
        category: "Transmission",
        items: [
          { label: "1.0L Turbo", value: "5-Speed MT / 6-Speed AT (Paddle Shift)" },
          { label: "1.2L K12N", value: "5-Speed MT / 5-Speed AGS" },
          { label: "Drive", value: "Front Wheel Drive" },
        ],
      },
      {
        category: "Dimensions & Capacity",
        items: [
          { label: "Length", value: "3,995 mm" },
          { label: "Width", value: "1,765 mm" },
          { label: "Height", value: "1,550 mm" },
          { label: "Wheelbase", value: "2,520 mm" },
          { label: "Ground Clearance", value: "190 mm" },
          { label: "Boot Space", value: "308 L" },
          { label: "Fuel Tank", value: "37 L" },
        ],
      },
      {
        category: "Technology & Comfort",
        items: [
          { label: "Infotainment", value: '9" SmartPlay Pro+ (wireless AA/CP)' },
          { label: "Head-Up Display", value: "Standard on Zeta/Alpha" },
          { label: "360° Camera", value: "Available" },
          { label: "Wireless Charger", value: "Available" },
          { label: "Cruise Control", value: "Standard on top variants" },
          { label: "Connected Car", value: "Suzuki Connect (40+ features)" },
        ],
      },
      {
        category: "Safety",
        items: [
          { label: "Airbags", value: "6 Standard" },
          { label: "HEARTECT Platform", value: "Standard" },
          { label: "ESP + Hill Hold", value: "Standard" },
          { label: "ABS + EBD + TPMS", value: "Standard" },
          { label: "ISOFIX Child Seat Anchors", value: "Standard" },
          { label: "Rear Parking Sensors + Camera", value: "Standard" },
        ],
      },
    ],
  },
  {
    slug: "baleno",
    name: "Baleno",
    fullName: "Maruti Suzuki Baleno",
    segment: "Premium Hatchback",
    startingPrice: 598900,
    tagline: "India's Best-Selling Premium Hatchback",
    description:
      "The Maruti Suzuki Baleno is India's favourite premium hatchback with bold styling, a spacious cabin, and the latest SmartPlay infotainment. Starting at ₹5.98L, it offers the best value in its segment.",
    seating: 5,
    mileage: "22.35 km/l",
    engine: "1197cc K12N Dual Jet",
    keyFeatures: [
      "9-inch SmartPlay Pro+",
      "Head-Up Display",
      "360° Surround View",
      "Smart Hybrid (Alpha)",
      "6 Airbags",
    ],
    variants: [
      { name: "Sigma", exShowroom: 598900, fuelType: "Petrol", transmission: "Manual" },
      { name: "Delta", exShowroom: 699900, fuelType: "Petrol", transmission: "Manual" },
      { name: "Zeta", exShowroom: 812900, fuelType: "Petrol", transmission: "Manual" },
      { name: "Alpha", exShowroom: 942900, fuelType: "Petrol", transmission: "Automatic" },
    ],
    faqs: [
      {
        q: "What is the on-road price of Baleno in Mumbai?",
        a: "The Baleno on-road price in Mumbai starts at approximately ₹6.7 lakhs for the Sigma variant. Contact Shivam NEXA Mumbai for the exact current on-road price.",
      },
      {
        q: "What is the mileage of Baleno?",
        a: "The Baleno delivers up to 22.35 km/l (ARAI) with the 1.2L Dual Jet engine, making it one of the most fuel-efficient hatchbacks in India.",
      },
      {
        q: "Is Baleno available in CNG?",
        a: "The Baleno is available as a petrol-only model. For CNG options in the hatchback segment, consider the Arena range.",
      },
    ],
    imageAlt: "Maruti Suzuki Baleno premium hatchback in Mumbai",
    colors: [
      { name: "Nexa Blue", hex: "#1d3d6e" },
      { name: "Splendid Silver", hex: "#b4b8bd" },
      { name: "Grandeur Grey", hex: "#6b6f75" },
      { name: "Opulent Red", hex: "#8c1f1f" },
      { name: "Pearl Arctic White", hex: "#f0f0eb" },
      { name: "Luxe Beige", hex: "#c9b48a" },
      { name: "Pearl Midnight Black", hex: "#1a1a1a" },
    ],
    highlights: [
      {
        icon: "📺",
        title: "9-inch SmartPlay Pro+",
        description:
          "22.86 cm touchscreen with Advanced Voice Assist, wireless Android Auto and Apple CarPlay.",
      },
      {
        icon: "🎯",
        title: "Head-Up Display",
        description:
          "Industry-first HUD in segment — speed, RPM, fuel economy and alerts in your line of sight.",
      },
      {
        icon: "📷",
        title: "360° View Camera",
        description:
          "Panoramic real-time surround view for safer parking in tight Mumbai spaces.",
      },
      {
        icon: "🛡️",
        title: "6 Airbags Standard",
        description:
          "Safety Shield with 6 airbags, ESP and Hill Hold across the Baleno range.",
      },
    ],
    specs: [
      {
        category: "Engine & Performance",
        items: [
          { label: "Engine", value: "1197cc K12N Dual Jet Dual VVT" },
          { label: "Max Power", value: "90 PS @ 6000 rpm" },
          { label: "Max Torque", value: "113 Nm @ 4400 rpm" },
          { label: "Mileage (Petrol MT)", value: "22.35 km/l (ARAI)" },
          { label: "Mileage (Petrol AGS)", value: "22.94 km/l (ARAI)" },
          { label: "Mileage (CNG)", value: "30.61 km/kg (ARAI)" },
          { label: "Fuel Type", value: "Petrol / S-CNG" },
        ],
      },
      {
        category: "Transmission",
        items: [
          { label: "Manual", value: "5-Speed Manual" },
          { label: "Automatic", value: "5-Speed AGS (Auto Gear Shift)" },
          { label: "Drive", value: "Front Wheel Drive" },
        ],
      },
      {
        category: "Dimensions & Capacity",
        items: [
          { label: "Length", value: "3,990 mm" },
          { label: "Width", value: "1,745 mm" },
          { label: "Height", value: "1,500 mm" },
          { label: "Wheelbase", value: "2,520 mm" },
          { label: "Ground Clearance", value: "170 mm" },
          { label: "Boot Space", value: "318 L" },
          { label: "Fuel Tank", value: "37 L" },
        ],
      },
      {
        category: "Technology & Comfort",
        items: [
          { label: "Infotainment", value: "22.86 cm SmartPlay Pro+ (wireless AA/CP)" },
          { label: "Head-Up Display", value: "Standard on Zeta/Alpha" },
          { label: "360° Camera", value: "Alpha variant" },
          { label: "Audio", value: "Surround Sense by ARKAMYS (Alpha)" },
          { label: "Cruise Control", value: "Standard on Zeta/Alpha" },
          { label: "Auto AC", value: "Standard" },
        ],
      },
      {
        category: "Safety",
        items: [
          { label: "Airbags", value: "6 Standard" },
          { label: "ESP + Hill Hold", value: "Standard" },
          { label: "ABS + EBD + TPMS", value: "Standard" },
          { label: "ISOFIX Child Seat Anchors", value: "Standard" },
          { label: "Rear Parking Sensors + Camera", value: "Standard" },
          { label: "HEARTECT Platform", value: "Standard" },
        ],
      },
    ],
  },
  {
    slug: "invicto",
    name: "Invicto",
    fullName: "Maruti Suzuki Invicto",
    segment: "Luxury MPV",
    startingPrice: 2497400,
    tagline: "The Ultimate Luxury MPV",
    description:
      "The Maruti Suzuki Invicto is the flagship NEXA offering — a strong hybrid luxury MPV with 7-seater premium seating, Toyota-sourced powertrain, and class-leading fuel efficiency of 23.24 km/l.",
    seating: 7,
    mileage: "23.24 km/l",
    engine: "2487cc Strong Hybrid",
    keyFeatures: [
      "Strong Hybrid — 23.24 km/l",
      "7-Seater Captain Seat Layout",
      "Panoramic Sunroof",
      "Toyota-Hino Hybrid Powertrain",
      "ADAS with Adaptive Cruise Control",
    ],
    variants: [
      { name: "Zeta+", exShowroom: 2497400, fuelType: "Hybrid", transmission: "Automatic" },
      { name: "Alpha+", exShowroom: 2856400, fuelType: "Hybrid", transmission: "Automatic" },
    ],
    faqs: [
      {
        q: "What is the on-road price of Invicto in Mumbai?",
        a: "The Invicto on-road price in Mumbai starts at approximately ₹28 lakhs for the Zeta+ variant. Contact Shivam NEXA for a detailed on-road breakup.",
      },
      {
        q: "What is the mileage of Invicto?",
        a: "The Invicto Strong Hybrid delivers 23.24 km/l (ARAI), exceptional for a premium 7-seater MPV.",
      },
      {
        q: "How is Invicto different from XL6?",
        a: "The Invicto is the flagship luxury MPV with a larger 2.5L strong hybrid engine, more premium interiors, and a higher price point vs. the XL6's 1.5L engine.",
      },
    ],
    imageAlt: "Maruti Suzuki Invicto luxury 7-seater MPV in Mumbai",
    colors: [
      { name: "Nexa Blue", hex: "#1d3d6e" },
      { name: "Splendid Silver", hex: "#b4b8bd" },
      { name: "Pearl Metallic Cafe Brown", hex: "#5a3e2a" },
      { name: "Grandeur Grey", hex: "#6b6f75" },
      { name: "Pearl Arctic White", hex: "#f0f0eb" },
    ],
    highlights: [
      {
        icon: "🔋",
        title: "Intelligent Strong Hybrid",
        description:
          "2.0L self-charging Strong Hybrid with e-CVT delivers 23.24 km/l — exceptional for a 7-seater.",
      },
      {
        icon: "👑",
        title: "7-Seater Captain Layout",
        description:
          "Plush captain seats in the second row with 8-way power adjust and memory function on driver seat.",
      },
      {
        icon: "☀️",
        title: "Panoramic Sunroof",
        description:
          "Massive panoramic sunroof with ambient lighting creates an open-sky luxury cabin atmosphere.",
      },
      {
        icon: "🛡️",
        title: "Level 2 ADAS",
        description:
          "Adaptive Cruise Control, Lane Keep Assist, Auto Emergency Braking and 360° view come standard.",
      },
    ],
    specs: [
      {
        category: "Engine & Performance",
        items: [
          { label: "Engine", value: "1987cc Atkinson Cycle + Electric Motor" },
          { label: "System Power", value: "184 PS (combined)" },
          { label: "Engine Power", value: "152 PS @ 6000 rpm" },
          { label: "Engine Torque", value: "188 Nm @ 4400-5200 rpm" },
          { label: "Electric Motor Torque", value: "206 Nm" },
          { label: "Mileage", value: "23.24 km/l (ARAI)" },
        ],
      },
      {
        category: "Transmission",
        items: [
          { label: "Transmission", value: "e-CVT with Paddle Shifters" },
          { label: "Drive Modes", value: "EV / Eco / Normal / Power" },
          { label: "Regenerative Braking", value: "Standard" },
          { label: "Drive", value: "Front Wheel Drive" },
        ],
      },
      {
        category: "Dimensions & Capacity",
        items: [
          { label: "Length", value: "4,755 mm" },
          { label: "Width", value: "1,845 mm" },
          { label: "Height", value: "1,795 mm" },
          { label: "Wheelbase", value: "2,850 mm" },
          { label: "Ground Clearance", value: "185 mm" },
          { label: "Boot Space", value: "239 L (all seats up)" },
          { label: "Fuel Tank", value: "52 L" },
          { label: "Seating", value: "7 (2+2+3 Captain) or 8" },
        ],
      },
      {
        category: "Technology & Comfort",
        items: [
          { label: "Infotainment", value: "26 cm SmartPlay Magnum+ (wireless AA/CP)" },
          { label: "Panoramic Sunroof", value: "Standard" },
          { label: "Ambient Lighting", value: "Multi-Colour Standard" },
          { label: "Driver Seat", value: "8-Way Power Adjust with Memory" },
          { label: "Rear AC Vents", value: "Auto with Roof-Mounted Vents" },
          { label: "Connected Car", value: "Suzuki Connect (26 Safety Features)" },
        ],
      },
      {
        category: "Safety",
        items: [
          { label: "Airbags", value: "6 Standard" },
          { label: "Level 2 ADAS", value: "Adaptive Cruise, Lane Keep, AEB, RCTA" },
          { label: "360° Surround View Camera", value: "Standard with Dynamic Guidelines" },
          { label: "Electronic Parking Brake + Auto Hold", value: "Standard" },
          { label: "ABS + EBD + ESP + TPMS", value: "Standard" },
          { label: "e-Call Emergency Button", value: "Standard" },
        ],
      },
    ],
  },
  {
    slug: "e-vitara",
    name: "e Vitara",
    fullName: "Maruti Suzuki e Vitara",
    segment: "Electric SUV",
    startingPrice: 1099000,
    tagline: "NEXA's First Electric SUV",
    description:
      "The Maruti Suzuki e Vitara is India's most awaited electric SUV from NEXA. With two battery options (49 kWh and 61 kWh), AWD capability, and premium NEXA features, the e Vitara redefines electric mobility.",
    seating: 5,
    mileage: "500 km range (est.)",
    engine: "49 kWh / 61 kWh Battery",
    keyFeatures: [
      "500 km+ Range (61 kWh)",
      "AWD Option Available",
      "Fast Charging Support",
      "Advanced ADAS",
      "Premium NEXA Interior",
    ],
    variants: [
      { name: "Delta 49 kWh", exShowroom: 1099000, fuelType: "Electric", transmission: "Automatic" },
      { name: "Zeta 49 kWh", exShowroom: 1299000, fuelType: "Electric", transmission: "Automatic" },
      { name: "Alpha 61 kWh AWD", exShowroom: 1749000, fuelType: "Electric", transmission: "Automatic" },
    ],
    colors: [
      { name: "Nexa Blue", hex: "#1d3d6e" },
      { name: "Opulent Red", hex: "#8c1f1f" },
      { name: "Grandeur Grey", hex: "#6b6f75" },
      { name: "Arctic White", hex: "#f0f0eb" },
      { name: "Splendid Silver", hex: "#b4b8bd" },
    ],
    highlights: [
      {
        icon: "⚡",
        title: "Zero Tailpipe Emissions",
        description:
          "Drive guilt-free with zero direct CO₂ emissions. The e Vitara is India's cleanest SUV from Maruti Suzuki.",
      },
      {
        icon: "🔋",
        title: "500 km Real-World Range",
        description:
          "The 61 kWh battery delivers up to 500 km on a single charge — Mumbai to Pune and back without stopping.",
      },
      {
        icon: "⚡",
        title: "DC Fast Charging — 37 min",
        description:
          "Recharge to 80% in just 37 minutes using DC fast charging. Compatible with public charging networks across India.",
      },
      {
        icon: "🚙",
        title: "AWD Dual-Motor Performance",
        description:
          "The Alpha variant's dual-motor AWD system delivers 300 Nm torque and 0–100 km/h in just 6.7 seconds.",
      },
    ],
    specs: [
      {
        category: "Motor & Performance",
        items: [
          { label: "Motor Type", value: "Permanent Magnet Synchronous" },
          { label: "Peak Power (49 kWh 2WD)", value: "144 PS (106 kW)" },
          { label: "Peak Power (61 kWh AWD)", value: "184 PS (135 kW)" },
          { label: "Peak Torque (49 kWh)", value: "189 Nm" },
          { label: "Peak Torque (61 kWh AWD)", value: "300 Nm" },
          { label: "0–100 km/h (49 kWh)", value: "8.5 seconds" },
          { label: "0–100 km/h (61 kWh AWD)", value: "6.7 seconds" },
          { label: "Top Speed", value: "150 km/h" },
        ],
      },
      {
        category: "Battery & Charging",
        items: [
          { label: "Battery Options", value: "49 kWh / 61 kWh" },
          { label: "Estimated Range — 49 kWh", value: "~400 km (MIDC)" },
          { label: "Estimated Range — 61 kWh", value: "~500 km (MIDC)" },
          { label: "DC Fast Charging (to 80%)", value: "~37 minutes" },
          { label: "AC Charging — 7.2 kW", value: "~8 hours (0–100%)" },
          { label: "Onboard Charger", value: "7.2 kW AC + 50 kW DC" },
          { label: "Charging Port", value: "CCS2 (DC) + Type 2 (AC)" },
        ],
      },
      {
        category: "Dimensions & Capacity",
        items: [
          { label: "Length", value: "4,275 mm" },
          { label: "Width", value: "1,800 mm" },
          { label: "Height", value: "1,635 mm" },
          { label: "Wheelbase", value: "2,700 mm" },
          { label: "Ground Clearance", value: "210 mm" },
          { label: "Boot Space", value: "490 L (2WD) / 460 L (AWD)" },
          { label: "Fuel Tank / Battery", value: "49 kWh or 61 kWh" },
          { label: "Kerb Weight", value: "1,710–1,900 kg" },
        ],
      },
      {
        category: "Technology & Comfort",
        items: [
          { label: "Infotainment", value: '10.1" SmartPlay Pro+ (wireless AA/CP)' },
          { label: "Instrument Cluster", value: '10.25" Full Digital' },
          { label: "ADAS", value: "Level 2 — Adaptive Cruise, Lane Keep, AEB" },
          { label: "Connected Car", value: "Suzuki Connect App (remote AC, locate)" },
          { label: "Sunroof", value: "Panoramic (Alpha variant)" },
          { label: "Head-Up Display", value: "Available" },
          { label: "Ventilated Seats", value: "Front (Alpha)" },
          { label: "V2L (Vehicle to Load)", value: "2.0 kW — Power devices from your car" },
        ],
      },
      {
        category: "Safety",
        items: [
          { label: "Airbags", value: "6 Standard" },
          { label: "ABS + EBD", value: "Standard on all variants" },
          { label: "Electronic Stability Program", value: "Standard" },
          { label: "Hill Hold & Hill Descent Control", value: "Standard" },
          { label: "360° Surround View Camera", value: "Available" },
          { label: "Tyre Pressure Monitor", value: "Standard" },
          { label: "Global NCAP", value: "5-Star Safety Rating" },
        ],
      },
    ],
    faqs: [
      {
        q: "What is the on-road price of e Vitara in Mumbai?",
        a: "The e Vitara on-road price in Mumbai starts at approximately ₹12.2 lakhs for the Delta variant. EV benefits and subsidies may apply. Contact Shivam NEXA for exact pricing.",
      },
      {
        q: "What is the range of e Vitara?",
        a: "The e Vitara offers up to 500 km range with the 61 kWh battery variant. The 49 kWh variant offers approximately 400 km range (estimated).",
      },
      {
        q: "When will e Vitara deliveries start in Mumbai?",
        a: "Bookings are open at Shivam NEXA. Contact us for the latest delivery timeline and variant availability in Mumbai and Thane.",
      },
    ],
    imageAlt: "Maruti Suzuki e Vitara electric SUV in Mumbai",
  },
];

export function getCarBySlug(slug: string): Car | undefined {
  return CARS.find((c) => c.slug === slug);
}

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function getCarImagePath(slug: string): string {
  return `/cars/${slug}.jpg`;
}

export function formatPrice(price: number): string {
  if (price >= 100000) {
    const lakhs = price / 100000;
    return `₹${lakhs.toFixed(2)}L`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

// Estimated on-road price = ex-showroom + ~12% (RTO + insurance + handling)
export function estimateOnRoadPrice(exShowroom: number): number {
  return Math.round(exShowroom * 1.12);
}

export const DEALER = {
  name: "Shivam Autozone NEXA",
  shortName: "Shivam NEXA",
  phone: "8828199999",
  servicePhone: "9773858585",
  email: "nexa@shivamauto.in",
  website: "https://shivamnexa.com",
  since: 2015,
  cities: ["Mumbai", "Thane", "Navi Mumbai", "Palghar"],
  showrooms: [
    {
      name: "NEXA Andheri",
      city: "Mumbai",
      address:
        "Shivam Centrium, Opp. Kalpita Enclave, Sahar Road, Andheri East, Mumbai - 400069",
      phone: "8600288888",
      email: "nexa@shivamauto.in",
    },
    {
      name: "NEXA Kandivali",
      city: "Mumbai",
      address:
        "1st Floor, Lakshachandi Tower, S.V. Road, Near Kandivali Flyover, Kandivali West, Mumbai - 400067",
      phone: "8828199999",
      email: "nexa@shivamauto.in",
    },
    {
      name: "NEXA Boisar",
      city: "Palghar",
      address:
        "No. 417/15, Bhiwandi-Wada Road, near Sneh Garden, MIDC, Village Gandhare, Wada, Kudus, Maharashtra - 421303",
      phone: "9152001313",
      email: "nexa@shivamauto.in",
    },
    {
      name: "NEXA Wada",
      city: "Palghar",
      address:
        "No. 417/15, Bhiwandi-Wada Road, near Sneh Garden, MIDC, Village Gandhare, Wada, Kudus, Maharashtra - 421303",
      phone: "8433942222",
      email: "nexa@shivamauto.in",
    },
  ],
};
