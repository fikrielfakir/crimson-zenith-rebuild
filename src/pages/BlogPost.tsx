import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  Bookmark,
  Eye,
  ArrowLeft,
  ArrowUp,
  Tag,
  ChevronRight,
  Link2,
  Share2,
  X,
  ZoomIn,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useAuth } from "@/hooks/useAuth";

/* ─── types ────────────────────────────────────────────────── */
interface BlogArticle {
  id: number;
  title: string;
  content?: string;
  excerpt?: string;
  slug?: string;
  author?: { name?: string; bio?: string; avatar?: string; image?: string } | string;
  author_name?: string;
  published_at?: string;
  created_at?: string;
  category?: string;
  image?: string;
  image_url?: string;
  cover_image?: string;
  read_time?: string;
  reading_time?: string;
  tags?: string[] | string;
  views?: number;
  likes?: number;
  shares?: number;
  comments_count?: number;
}

/* ─── helpers ──────────────────────────────────────────────── */
function getField<T>(obj: BlogArticle | null, ...keys: (keyof BlogArticle)[]): T | undefined {
  if (!obj) return undefined;
  for (const k of keys) if (obj[k] !== undefined) return obj[k] as unknown as T;
  return undefined;
}

/* ─── component ────────────────────────────────────────────── */
const BlogPost = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [article, setArticle]     = useState<BlogArticle | null>(null);
  const [related, setRelated]     = useState<BlogArticle[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [isSaved, setIsSaved]     = useState(false);
  const [copied, setCopied]       = useState(false);
  const [progress, setProgress]   = useState(0);
  const [showTop, setShowTop]     = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  /* reading progress */
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setProgress(Math.min(100, (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100));
      setShowTop(el.scrollTop > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close lightbox on Escape */
  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxSrc(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxSrc]);

  /* fetch article */
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    fetch(`/api/news/${slug}`, { credentials: "include" })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setArticle)
      .catch(e => setError(e.message ?? "Failed to load article"))
      .finally(() => setLoading(false));
  }, [slug]);

  /* fetch related after article loads */
  useEffect(() => {
    if (!article) return;
    fetch("/api/news?limit=10", { credentials: "include" })
      .then(r => r.ok ? r.json() : [])
      .then((data: any) => {
        const list: BlogArticle[] = Array.isArray(data) ? data : (data?.data ?? data?.posts ?? []);
        setRelated(
          list
            .filter(a => a.slug !== slug && a.id !== article.id)
            .slice(0, 3)
        );
      })
      .catch(() => {});
  }, [article, slug]);

  /* derived helpers */
  const authorName  = (): string => {
    if (!article) return "";
    if (typeof article.author === "object" && article.author?.name) return article.author.name;
    if (typeof article.author === "string") return article.author;
    return article.author_name ?? t("news.defaultAuthorName");
  };
  const authorImg   = (): string => {
    if (!article) return "";
    if ((article as any).author_avatar) return (article as any).author_avatar;
    if (typeof article.author === "object") return article.author?.avatar ?? article.author?.image ?? "";
    return "";
  };
  const authorBio   = (): string => {
    if (!article) return "";
    if (typeof article.author === "object" && article.author?.bio) return article.author.bio;
    return t("news.defaultAuthorBio");
  };
  const coverImg    = (): string =>
    getField<string>(article, "image_url", "cover_image", "image") ?? "";
  const pubDate     = (): string => article?.published_at ?? article?.created_at ?? "";
  const readTime    = (): string => article?.read_time ?? article?.reading_time ?? "5 min read";
  const tags        = (): string[] => {
    if (!article?.tags) return [];
    if (Array.isArray(article.tags)) return article.tags;
    try { return JSON.parse(article.tags as string); } catch { return []; }
  };

  /* share actions */
  const pageUrl   = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = article?.title ?? "";

  const shareFacebook  = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, "_blank", "noopener,width=600,height=400");
  const shareTwitter   = () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareTitle)}`, "_blank", "noopener,width=600,height=400");
  const shareWhatsApp  = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareTitle + " " + pageUrl)}`, "_blank", "noopener");
  const copyLink       = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  /* save — requires login */
  const handleSave = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setIsSaved(v => !v);
  };

  /* click on images inside article body → lightbox */
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      const src = (target as HTMLImageElement).src;
      if (src) setLightboxSrc(src);
    }
  };

  const relatedCover = (a: BlogArticle) =>
    (a as any).image_url ?? (a as any).cover_image ?? (a as any).image ?? "";

  /* ── loading ── */
  if (loading) return (
    <div className="min-h-screen bg-white">
      <Header forceOpaque={true} />
      <div className="flex items-center justify-center py-40">
        <div className="text-center space-y-4">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-gray-100" />
            <div className="absolute inset-0 rounded-full border-2 border-t-[#D8C18D] animate-spin" />
          </div>
          <p className="text-gray-400 text-sm tracking-wide">{t("news.loadingArticle")}</p>
        </div>
      </div>
      <Footer />
    </div>
  );

  /* ── error ── */
  if (error || !article) return (
    <div className="min-h-screen bg-white">
      <Header forceOpaque={true} />
      <div className="flex items-center justify-center py-40">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto text-2xl">📄</div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t("news.articleNotFound")}</h2>
            <p className="text-gray-500 text-sm">{error ?? t("news.articleNotFoundDesc")}</p>
          </div>
          <Link to="/news" className="inline-flex items-center gap-2 text-sm font-medium text-[#112250] hover:text-[#D8C18D] transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t("news.backToAllArticles")}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );

  /* ── OG structured data ── */
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt ?? "",
    image: coverImg() ? [coverImg()] : undefined,
    datePublished: pubDate(),
    author: { "@type": "Person", name: authorName() },
    publisher: { "@type": "Organization", name: "The Journey Association" },
  };

  /* ═══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-white">

      {/* OG / Twitter meta */}
      <SEOHead
        title={article.title}
        description={article.excerpt ?? ""}
        image={coverImg() || undefined}
        type="article"
        canonical={`/news/${slug}`}
        keywords={tags().join(", ")}
        structuredData={structuredData}
      />

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px]">
        <div
          className="h-full transition-all duration-150"
          style={{ width: `${progress}%`, background: "linear-gradient(90deg,#112250,#D8C18D)" }}
        />
      </div>

      <Header />

      {/* ── HERO — dark navy section ─────────────────────────── */}
      <section className="bg-[#112250] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #D8C18D 0%, transparent 50%), radial-gradient(circle at 80% 20%, #D8C18D 0%, transparent 50%)" }}
        />

        <div className="relative container mx-auto max-w-5xl px-6 pt-48 pb-14">
          {/* breadcrumb */}
          <nav className="flex items-center gap-1.5 text-white/50 text-xs mb-8">
            <Link to="/" className="hover:text-white/80 transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link to="/news" className="hover:text-white/80 transition-colors">{t("nav.blog")}</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-white/70 truncate max-w-[200px]">{article.title}</span>
          </nav>

          {/* category badge */}
          {article.category && (
            <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-[#D8C18D] mb-5">
              {article.category}
            </span>
          )}

          {/* title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6 max-w-4xl font-heading">
            {article.title}
          </h1>

          {/* excerpt */}
          {article.excerpt && (
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed mb-10 font-body">
              {article.excerpt}
            </p>
          )}

          {/* author / meta row */}
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-[#D8C18D]/30">
                <AvatarImage src={authorImg()} alt={authorName()} />
                <AvatarFallback className="bg-[#D8C18D] text-[#112250] text-sm font-bold">
                  {authorName().charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white text-sm font-semibold leading-none">{authorName()}</p>
                {pubDate() && (
                  <p className="text-white/50 text-xs mt-1">
                    {new Date(pubDate()).toLocaleDateString(
                      i18n.language === "ar" ? "ar-MA" : i18n.language === "fr" ? "fr-MA" : i18n.language === "es" ? "es-ES" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="w-px h-6 bg-white/15" />

            <div className="flex items-center gap-1.5 text-white/50 text-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>{readTime()}</span>
            </div>

            {article.views !== undefined && (
              <>
                <div className="w-px h-6 bg-white/15" />
                <div className="flex items-center gap-1.5 text-white/50 text-sm">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t("news.viewsCount", { count: article.views.toLocaleString() })}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── COVER IMAGE — smaller, clickable ─────────────────── */}
      {coverImg() && (
        <div
          className="w-full bg-gray-100 overflow-hidden cursor-zoom-in group relative"
          style={{ maxHeight: "380px" }}
          onClick={() => setLightboxSrc(coverImg())}
        >
          <img
            src={coverImg()}
            alt={article.title}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            style={{ maxHeight: "380px", display: "block" }}
            onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
          />
          {/* zoom hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
            <div className="bg-white/90 rounded-full p-2 shadow-lg">
              <ZoomIn className="w-5 h-5 text-[#112250]" />
            </div>
          </div>
        </div>
      )}

      {/* ── BODY ─────────────────────────────────────────────── */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-14">

            {/* ── Main column ── */}
            <div>
              {/* action bar — Save only */}
              <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100">

                {/* save */}
                <button
                  onClick={handleSave}
                  title={!isAuthenticated ? t("news.loginToSave") : undefined}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all ${
                    isSaved
                      ? "border-[#112250]/20 bg-[#112250]/5 text-[#112250]"
                      : "border-gray-200 text-gray-500 hover:border-[#112250]/20 hover:text-[#112250]"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? "fill-[#112250]" : ""}`} />
                  <span>{isSaved ? t("news.saved") : t("news.save")}</span>
                </button>

                {/* mobile share trigger */}
                <button
                  onClick={shareTwitter}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 text-gray-500 text-sm font-medium hover:border-[#D8C18D] hover:text-[#112250] transition-all ml-auto"
                >
                  <Share2 className="w-4 h-4" />
                  {t("news.share")}
                </button>
              </div>

              {/* article content — images inside are clickable */}
              {article.content ? (
                <div
                  onClick={handleContentClick}
                  className="
                    prose prose-lg max-w-none font-body
                    prose-headings:font-heading prose-headings:text-[#112250]
                    prose-p:text-gray-700 prose-p:leading-[1.85]
                    prose-a:text-[#112250] prose-a:no-underline hover:prose-a:text-[#D8C18D]
                    prose-strong:text-gray-900
                    prose-blockquote:border-l-[3px] prose-blockquote:border-[#D8C18D]
                    prose-blockquote:bg-amber-50/40 prose-blockquote:py-3 prose-blockquote:px-5
                    prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-gray-600
                    prose-img:rounded-2xl prose-img:shadow-md prose-img:max-w-[60%] prose-img:mx-auto
                    prose-img:cursor-zoom-in
                    prose-code:bg-gray-100 prose-code:px-1.5 prose-code:rounded prose-code:text-sm
                    prose-hr:border-gray-100
                    [&_p:first-of-type::first-letter]:text-6xl [&_p:first-of-type::first-letter]:font-bold
                    [&_p:first-of-type::first-letter]:text-[#112250] [&_p:first-of-type::first-letter]:float-left
                    [&_p:first-of-type::first-letter]:mr-2 [&_p:first-of-type::first-letter]:leading-none
                    [&_p:first-of-type::first-letter]:mt-1
                  "
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : article.excerpt ? (
                <p className="text-lg text-gray-700 leading-[1.85] font-body">{article.excerpt}</p>
              ) : null}

              {/* tags */}
              {tags().length > 0 && (
                <div className="flex flex-wrap gap-2 mt-14 pt-10 border-t border-gray-100">
                  {tags().map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-[#112250] hover:text-white transition-colors cursor-pointer"
                    >
                      <Tag className="w-3 h-3" />{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* author bio card */}
              <div className="mt-14 p-7 rounded-2xl bg-gradient-to-br from-[#112250]/5 to-[#D8C18D]/10 border border-[#D8C18D]/20">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#D8C18D] mb-5">{t("news.aboutAuthor")}</p>
                <div className="flex items-start gap-5">
                  <Avatar className="w-16 h-16 ring-2 ring-[#D8C18D]/30 shrink-0">
                    <AvatarImage src={authorImg()} alt={authorName()} />
                    <AvatarFallback className="bg-[#112250] text-[#D8C18D] text-lg font-bold">
                      {authorName().charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#112250] font-bold text-lg font-heading mb-1">{authorName()}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed font-body">{authorBio()}</p>
                    <button className="mt-3 text-xs font-semibold text-[#112250] hover:text-[#D8C18D] transition-colors tracking-wide flex items-center gap-1">
                      {t("news.follow")} <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* related articles */}
              {related.length > 0 && (
                <div className="mt-16 pt-10 border-t border-gray-100">
                  <h2 className="text-xl font-bold text-[#112250] font-heading mb-7">{t("news.relatedArticles")}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {related.map(a => (
                      <Link
                        key={a.id}
                        to={`/news/${a.slug}`}
                        className="group block rounded-2xl overflow-hidden border border-gray-100 hover:border-[#D8C18D]/40 hover:shadow-lg transition-all duration-300"
                      >
                        {/* thumbnail */}
                        <div className="relative bg-[#112250]/10 overflow-hidden" style={{ aspectRatio: "16/9" }}>
                          {relatedCover(a) ? (
                            <img
                              src={relatedCover(a)}
                              alt={a.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={e => { (e.target as HTMLImageElement).parentElement!.style.background = "#112250"; }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#112250] to-[#1a3366] flex items-center justify-center">
                              <span className="text-white/20 text-4xl font-heading font-bold">J</span>
                            </div>
                          )}
                          {a.category && (
                            <span className="absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase text-[#D8C18D] bg-[#112250]/80 px-2 py-1 rounded-full">
                              {a.category}
                            </span>
                          )}
                        </div>
                        {/* text */}
                        <div className="p-4">
                          <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#112250] transition-colors line-clamp-2 font-heading mb-2 leading-snug">
                            {a.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>{(a as any).read_time ?? (a as any).reading_time ?? "5 min"}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* back link */}
              <div className="mt-12">
                <Link to="/news" className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-[#112250] transition-colors group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  {t("news.backToAllArticles")}
                </Link>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-5">

                {/* Share card */}
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-50">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">{t("news.shareArticle")}</p>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <SidebarShareBtn
                      onClick={shareFacebook}
                      bg="bg-blue-50 hover:bg-blue-100"
                      iconBg="bg-blue-100"
                      textColor="text-blue-700"
                      label="Facebook"
                      icon={
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-600">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      }
                    />
                    <SidebarShareBtn
                      onClick={shareTwitter}
                      bg="bg-sky-50 hover:bg-sky-100"
                      iconBg="bg-sky-100"
                      textColor="text-sky-700"
                      label="Twitter / X"
                      icon={
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-sky-500">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      }
                    />
                    <SidebarShareBtn
                      onClick={shareWhatsApp}
                      bg="bg-green-50 hover:bg-green-100"
                      iconBg="bg-green-100"
                      textColor="text-green-700"
                      label="WhatsApp"
                      icon={
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      }
                    />
                    <button
                      onClick={copyLink}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                        <Link2 className="w-4 h-4 text-gray-500" />
                      </div>
                      {copied ? <span className="text-green-600 font-semibold">{t("news.copied")}</span> : t("news.copyLink")}
                    </button>
                  </div>
                </div>

                {/* Reading progress */}
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">{t("news.reading")}</p>
                    <span className="text-xs font-bold text-[#112250]">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${progress}%`, background: "linear-gradient(90deg,#112250,#D8C18D)" }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">{readTime()} {t("news.total")}</p>
                </div>

              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full bg-[#112250] text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-[#D8C18D] hover:scale-110 ${
          showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* ── Lightbox ─────────────────────────────────────────── */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            onClick={() => setLightboxSrc(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <img
            src={lightboxSrc}
            alt={article?.title ?? ""}
            className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

/* ─── small helper components ─────────────────────────────── */

function SidebarShareBtn({
  onClick, bg, iconBg, textColor, label, icon,
}: {
  onClick: () => void;
  bg: string;
  iconBg: string;
  textColor: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-2.5 rounded-xl ${bg} transition-colors text-sm font-medium ${textColor}`}
    >
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      {label}
    </button>
  );
}

export default BlogPost;
