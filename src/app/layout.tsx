import type { Metadata } from "next";
import { draftMode } from "next/headers";
import dynamic from "next/dynamic";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UtmCapture from "@/components/UtmCapture";
import ChatWidget from "@/components/ChatWidget";
import { autoDealerSchema } from "@/lib/schema";
import { DEALER } from "@/lib/data";
import { getAbsoluteUrl, SITE_URL } from "@/lib/site";
import { SanityLive } from "@/lib/sanity";

const VisualEditing = dynamic(() =>
  import("next-sanity/visual-editing").then((m) => m.VisualEditing)
);

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shivam NEXA — Authorized Maruti Suzuki NEXA Dealer in Mumbai, Thane & Palghar",
    template: "%s | Shivam NEXA Mumbai",
  },
  description:
    "Authorized Maruti Suzuki NEXA dealer in Mumbai, Thane, Navi Mumbai & Palghar since 2015. Book test drives for XL6, Grand Vitara, Jimny, Fronx, Baleno, Invicto & e-Vitara. Get best on-road price.",
  keywords: [
    "NEXA dealer Mumbai",
    "Maruti Suzuki NEXA Mumbai",
    "NEXA cars Mumbai",
    "book test drive Mumbai",
    "Shivam NEXA",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: DEALER.name,
    title: "Shivam NEXA — Authorized Maruti Suzuki NEXA Dealer Mumbai",
    description:
      "Authorized Maruti Suzuki NEXA dealer in Mumbai, Thane & Palghar. Best prices on XL6, Grand Vitara, Jimny, Fronx & more.",
    images: [{ url: getAbsoluteUrl("/og-default.jpg"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: [getAbsoluteUrl("/og-default.jpg")],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealerSchema()) }}
        />
        <Header />
        <UtmCapture />
        <main className="flex-1">{children}</main>
        {isDraftMode && <VisualEditing />}
        <SanityLive />
        <a
          href={`https://wa.me/91${DEALER.phone}?text=Hi, I want help with a NEXA car`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed right-4 bottom-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
        >
          <span className="text-2xl leading-none">💬</span>
        </a>
        <ChatWidget />
        <Footer />
      </body>
    </html>
  );
}
