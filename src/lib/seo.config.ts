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
};

export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article" | "event";
  structuredData?: object;
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
    canonical: "/join-us",
  },
  "/projects": {
    title: "Projects | The Journey Association Morocco",
    description:
      "Learn about The Journey Association's community projects, sustainable initiatives, and impact across Morocco.",
    canonical: "/projects",
  },
  "/volunteers": {
    title: "Volunteer Opportunities | The Journey Association Morocco",
    description:
      "Discover volunteer opportunities and open posts with The Journey Association across Morocco.",
    canonical: "/volunteers",
  },
  "/talents": {
    title: "Talents & Experts | The Journey Association Morocco",
    description:
      "Find talented experts and professionals connected with Morocco's adventure and cultural community.",
    canonical: "/talents",
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
