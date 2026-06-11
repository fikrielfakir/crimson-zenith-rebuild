export const SITE = {
  name: "The Journey Association",
  url: "https://thejourney-ma.org",
  defaultTitle: "The Journey Association | Morocco Adventure & Cultural Journeys",
  defaultDescription:
    "The Journey Association connects Morocco's clubs, events, and cultural activities. Discover festivals, book tickets, and join clubs across Casablanca, Fez, Marrakech and more.",
  defaultImage: "https://thejourney-ma.org/og-image.jpg",
  twitterHandle: "@TheJourneyMA",
  locale: "en_US",
  themeColor: "#1a4a3a",
  languages: ["en", "fr", "ar"] as const,
};

export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article" | "event";
  structuredData?: object;
  keywords?: string;
}

export const routeSEO: Record<string, SEOConfig> = {
  "/": {
    title: "The Journey Association | Morocco Adventure & Cultural Journeys",
    description:
      "Experience Morocco's soul through sustainable journeys. Discover culture, embrace adventure, and create lasting connections with local communities.",
    canonical: "/",
  },
  "/discover": {
    title: "Discover Morocco | Clubs, Events & Activities – The Journey Association",
    description:
      "Explore Morocco's cultural and adventure landscape. Find clubs by city, discover upcoming events, and book experiences across the country.",
    canonical: "/discover",
  },
  "/about": {
    title: "About Us | The Journey Association Morocco",
    description:
      "Learn about The Journey Association — Morocco's network of adventure, cultural, and sustainability clubs connecting communities across the country.",
    canonical: "/about",
  },
  "/clubs": {
    title: "Sports & Cultural Clubs in Morocco | The Journey Association",
    description:
      "Browse Morocco's top sports and cultural clubs. Find clubs in Casablanca, Fez, Marrakech, Rabat, and more. Join or book events today.",
    canonical: "/clubs",
  },
  "/events": {
    title: "Events & Activities in Morocco | The Journey Association",
    description:
      "Find upcoming events and activities across Morocco. From adventure tours to cultural festivals — all in one place.",
    canonical: "/events",
  },
  "/gallery": {
    title: "Gallery | Morocco's Culture & Adventure in Photos – The Journey Association",
    description:
      "Browse stunning photos from Morocco's clubs, events, and adventures. Explore the beauty of Moroccan culture and landscapes.",
    canonical: "/gallery",
    keywords: "Morocco photography, Moroccan culture photos, adventure gallery Morocco",
  },
  "/news": {
    title: "Latest News & Blog | Morocco Adventure & Culture – The Journey Association",
    description:
      "Stay up to date with the latest news, articles, and stories about Morocco's adventure clubs and cultural scene.",
    canonical: "/news",
  },
  "/contact": {
    title: "Contact Us | The Journey Association Morocco",
    description:
      "Get in touch with The Journey Association. We're here to help with clubs, events, memberships, and more.",
    canonical: "/contact",
  },
  "/book": {
    title: "Book Tickets | Morocco Events – The Journey Association",
    description:
      "Book tickets for Morocco's top adventure and cultural events. Fast, secure, and easy online booking.",
    canonical: "/book",
  },
  "/join-us": {
    title: "Join The Journey Association | Become a Member",
    description:
      "Apply for membership to The Journey Association. Connect with Morocco's adventure and cultural community.",
    canonical: "/join",
  },
  "/projects": {
    title: "Projects | The Journey Association Morocco",
    description:
      "Learn about The Journey Association's community projects, sustainable initiatives, and impact across Morocco.",
    canonical: "/projects",
  },
  "/discover/cities": {
    title: "Explore Moroccan Cities | The Journey Association",
    description:
      "Discover the best of Morocco's cities — Fez, Marrakech, Casablanca, Tangier and more. Culture, activities, and clubs by city.",
    canonical: "/discover/cities",
    keywords: "Moroccan cities, explore Morocco, Fez, Marrakech, Casablanca, Tangier, Rabat",
  },
  "/talents/volunteers/spontaneous": {
    title: "Spontaneous Volunteering | The Journey Association Morocco",
    description:
      "Submit a spontaneous volunteer application to The Journey Association. Join our mission for adventure and cultural promotion in Morocco.",
    canonical: "/talents/volunteers/spontaneous",
  },
  "/talents/volunteers/posts": {
    title: "Volunteer Opportunities | The Journey Association Morocco",
    description:
      "Discover open volunteer positions across Morocco with The Journey Association's clubs and projects.",
    canonical: "/talents/volunteers/posts",
  },
  "/talents/experts": {
    title: "Talents & Experts | The Journey Association Morocco",
    description:
      "Find talented experts and professionals connected with Morocco's adventure and cultural community.",
    canonical: "/talents/experts",
  },
  "/talents/work-offers": {
    title: "Job Offers | The Journey Association Morocco",
    description:
      "Browse job and work opportunities at The Journey Association and its partner clubs across Morocco.",
    canonical: "/talents/work-offers",
  },
  "/privacy-policy": {
    title: "Privacy Policy | The Journey Association",
    description: "Read The Journey Association's privacy policy and learn how we handle your data.",
    canonical: "/privacy-policy",
    noIndex: true,
  },
  "/terms-of-service": {
    title: "Terms of Service | The Journey Association",
    description: "Read the terms of service for using The Journey Association's platform and services.",
    canonical: "/terms-of-service",
    noIndex: true,
  },
  "/cookie-policy": {
    title: "Cookie Policy | The Journey Association",
    description: "Learn about how The Journey Association uses cookies on our website.",
    canonical: "/cookie-policy",
    noIndex: true,
  },
};

// ─── JSON-LD Builders ────────────────────────────────────────────────────────

export function buildOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/logo-atj.png`,
      width: 200,
      height: 200,
    },
    sameAs: [
      "https://twitter.com/TheJourneyMA",
      "https://www.facebook.com/TheJourneyAssociation",
      "https://www.instagram.com/thejourney.ma",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["English", "French", "Arabic"],
    },
    areaServed: { "@type": "Country", name: "Morocco" },
    description: SITE.defaultDescription,
  };
}

export function buildBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE.url}${item.url}`,
    })),
  };
}

export function buildLocalBusinessStructuredData(club: {
  name: string;
  description?: string;
  image?: string;
  url?: string;
  latitude?: number | string;
  longitude?: number | string;
  location?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: club.name,
    description: club.description ?? "",
    image: club.image ?? SITE.defaultImage,
    url: club.url ?? SITE.url,
    ...(club.latitude && club.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: Number(club.latitude),
            longitude: Number(club.longitude),
          },
        }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: club.location ?? "Morocco",
      addressCountry: "MA",
    },
    parentOrganization: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  };
}

export function buildEventStructuredData(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  image?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    ...(event.endDate && { endDate: event.endDate }),
    ...(event.image && { image: event.image }),
    url: event.url ?? SITE.url,
    location: {
      "@type": "Place",
      name: event.location ?? "Morocco",
      address: {
        "@type": "PostalAddress",
        addressCountry: "MA",
      },
    },
    organizer: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  };
}

export function buildArticleStructuredData(article: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    image: article.image ?? SITE.defaultImage,
    url: article.url,
    author: {
      "@type": "Person",
      name: article.author ?? SITE.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/logo-atj.png`,
      },
    },
  };
}

/** Returns hreflang alternate URLs for a given canonical path */
export function buildHreflangLinks(canonicalPath: string) {
  const base = SITE.url;
  const path = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;
  return [
    { lang: "en", url: `${base}${path}` },
    { lang: "fr", url: `${base}${path}` },
    { lang: "ar", url: `${base}${path}` },
    { lang: "x-default", url: `${base}${path}` },
  ];
}
