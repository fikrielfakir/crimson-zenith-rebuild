import { Helmet } from "react-helmet-async";
import { SITE } from "@/lib/seo.config";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "event";
  noIndex?: boolean;
  structuredData?: object;
  keywords?: string;
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

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content={SITE.name} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:locale" content={SITE.locale} />
      <meta property="og:locale:alternate" content="fr_MA" />
      <meta property="og:locale:alternate" content="ar_MA" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
