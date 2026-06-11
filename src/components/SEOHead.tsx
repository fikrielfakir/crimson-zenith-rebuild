import { Helmet } from "react-helmet-async";
import { SITE } from "@/lib/seo.config";

interface HreflangLink {
  lang: string;
  url: string;
}

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "event";
  noIndex?: boolean;
  structuredData?: object | object[];
  keywords?: string;
  hreflang?: HreflangLink[];
}

const SEOHead = ({
  title,
  description,
  canonical,
  image,
  type = "website",
  noIndex = false,
  structuredData,
  keywords,
  hreflang,
}: SEOHeadProps) => {
  const fullTitle = title
    ? title.includes(SITE.name)
      ? title
      : `${title} | ${SITE.name}`
    : SITE.defaultTitle;

  const metaDescription = description ?? SITE.defaultDescription;
  const ogImage = image ?? SITE.defaultImage;
  const canonicalUrl = canonical
    ? `${SITE.url}${canonical.startsWith("/") ? canonical : `/${canonical}`}`
    : undefined;

  const defaultKeywords =
    "Morocco clubs, Moroccan events, adventure Morocco, cultural activities Morocco, sustainable tourism Morocco, Fez club, Casablanca events, Marrakech activities";
  const metaKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  const defaultHreflang = canonicalUrl
    ? [
        { lang: "en", url: canonicalUrl },
        { lang: "fr", url: canonicalUrl },
        { lang: "ar", url: canonicalUrl },
        { lang: "x-default", url: canonicalUrl },
      ]
    : [];

  const hreflangLinks = hreflang ?? defaultHreflang;

  const jsonLdItems = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <meta
        name="robots"
        content={
          noIndex
            ? "noindex, nofollow"
            : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        }
      />

      {/* Hreflang — multilingual (EN / FR / AR) */}
      {hreflangLinks.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content={SITE.name} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="fr_MA" />
      <meta property="og:locale:alternate" content="ar_MA" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* JSON-LD Structured Data */}
      {jsonLdItems.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
