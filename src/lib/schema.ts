import { Car, City, DEALER, estimateOnRoadPrice } from "./data";
import { SITE_URL } from "./site";

const OPENING_HOURS = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  opens: "09:00",
  closes: "19:00",
};

export function autoDealerSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: DEALER.name,
    url: SITE_URL,
    telephone: `+91${DEALER.phone}`,
    email: DEALER.email,
    foundingDate: String(DEALER.since),
    areaServed: DEALER.cities.map((city) => ({
      "@type": "City",
      name: city,
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    openingHoursSpecification: OPENING_HOURS,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: DEALER.googleRating,
      reviewCount: DEALER.googleReviewCount,
    },
    brand: {
      "@type": "Brand",
      name: "Maruti Suzuki NEXA",
    },
    department: DEALER.showrooms.map((showroom) => ({
      "@type": "AutoDealer",
      name: `${DEALER.name} — ${showroom.name}`,
      telephone: `+91${showroom.phone}`,
      email: showroom.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: showroom.address,
        addressLocality: showroom.city,
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      openingHoursSpecification: OPENING_HOURS,
    })),
  };
}

export function blogPostingSchema(post: {
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  publishedAt?: string;
  updatedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.description ? { description: post.description } : {}),
    url: post.url,
    ...(post.imageUrl ? { image: post.imageUrl } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    author: {
      "@type": "Organization",
      name: DEALER.name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: DEALER.name,
      url: SITE_URL,
    },
  };
}

export function carPageSchema(car: Car, city: City) {
  const onRoad = estimateOnRoadPrice(car.variants[0].exShowroom);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${car.fullName} in ${city.name}`,
    description: car.description,
    brand: {
      "@type": "Brand",
      name: "Maruti Suzuki",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: onRoad,
      highPrice: estimateOnRoadPrice(car.variants[car.variants.length - 1].exShowroom),
      offerCount: car.variants.length,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "AutoDealer",
        name: DEALER.name,
        url: SITE_URL,
      },
    },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
