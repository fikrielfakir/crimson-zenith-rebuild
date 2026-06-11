import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Heart,
  Bookmark,
  Facebook,
  Twitter,
  Link2,
  Eye,
  ArrowLeft,
  ArrowUp,
  Tag,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

const BlogPost = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const progress = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
      setShowBackToTop(el.scrollTop > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!slug) return;
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/news/${slug}`, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setArticle(data);
      } catch (err: any) {
        setError(err.message ?? "Failed to load article");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const getAuthorName = (): string => {
    if (!article) return "";
    if (typeof article.author === "object" && article.author?.name) return article.author.name;
    if (typeof article.author === "string") return article.author;
    return article.author_name ?? "The Journey Team";
  };

  const getAuthorImage = (): string => {
    if (!article) return "";
    if (typeof article.author === "object" && (article.author?.avatar || article.author?.image))
      return article.author.avatar ?? article.author.image ?? "";
    return "";
  };

  const getAuthorBio = (): string => {
    if (!article) return "";
    if (typeof article.author === "object" && article.author?.bio) return article.author.bio;
    return "";
  };

  const getImage = (): string => {
    if (!article) return "";
    return article.image_url ?? article.cover_image ?? article.image ?? "";
  };

  const getDate = (): string => article?.published_at ?? article?.created_at ?? "";

  const getReadTime = (): string => article?.read_time ?? article?.reading_time ?? "5 min read";

  const getTags = (): string[] => {
    if (!article?.tags) return [];
    if (Array.isArray(article.tags)) return article.tags;
    try { return JSON.parse(article.tags); } catch { return []; }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const authorName = getAuthorName();

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header forceOpaque={true} />
        <div className="flex items-center justify-center py-40">
          <div className="text-center space-y-4">
            <div className="relative w-12 h-12 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-gray-100" />
              <div className="absolute inset-0 rounded-full border-2 border-t-[#D8C18D] animate-spin" />
            </div>
            <p className="text-gray-400 text-sm tracking-wide">Loading article…</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white">
        <Header forceOpaque={true} />
        <div className="flex items-center justify-center py-40">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <span className="text-2xl">📄</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Article not found</h2>
              <p className="text-gray-500 text-sm">{error ?? "This article may have been moved or deleted."}</p>
            </div>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#112250] hover:text-[#D8C18D] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all articles
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const coverImage = getImage();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
        <div
          className="h-full transition-all duration-150 ease-linear"
          style={{
            width: `${readingProgress}%`,
            background: "linear-gradient(90deg, #112250, #D8C18D)",
          }}
        />
      </div>

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[72vh] flex flex-col justify-end overflow-hidden">
        {/* Background image */}
        {coverImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url('${coverImage}')` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#112250] to-[#1a3366]" />
        )}

        {/* Gradient overlay — stronger at bottom for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

        {/* Breadcrumb */}
        <div className="relative z-10 container mx-auto max-w-5xl px-6 pt-36 pb-0">
          <nav className="flex items-center gap-1.5 text-white/60 text-xs mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/news" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90 truncate max-w-[180px]">{article.title}</span>
          </nav>
        </div>

        {/* Hero content */}
        <div className="relative z-10 container mx-auto max-w-5xl px-6 pb-14">
          {article.category && (
            <span className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase text-[#D8C18D] mb-4">
              {article.category}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 max-w-4xl font-heading">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed mb-8 font-body">
              {article.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9 ring-2 ring-white/20">
                <AvatarImage src={getAuthorImage()} alt={authorName} />
                <AvatarFallback className="bg-[#D8C18D] text-[#112250] text-xs font-bold">
                  {authorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white text-sm font-medium leading-none">{authorName}</p>
                {getDate() && (
                  <p className="text-white/50 text-xs mt-0.5">
                    {new Date(getDate()).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>

            <div className="w-px h-6 bg-white/20" />

            <div className="flex items-center gap-1.5 text-white/60 text-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>{getReadTime()}</span>
            </div>

            {article.views !== undefined && (
              <>
                <div className="w-px h-6 bg-white/20" />
                <div className="flex items-center gap-1.5 text-white/60 text-sm">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{article.views.toLocaleString()} views</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── BODY ─────────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16">

            {/* Main content column */}
            <div>
              {/* Action bar */}
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ActionBtn
                    active={isLiked}
                    activeClass="text-red-500 border-red-200 bg-red-50"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    <span>{(article.likes ?? 0) + (isLiked ? 1 : 0)}</span>
                  </ActionBtn>

                  <ActionBtn
                    active={isBookmarked}
                    activeClass="text-[#112250] border-[#112250]/20 bg-[#112250]/5"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-[#112250] text-[#112250]" : ""}`} />
                    <span>{isBookmarked ? "Saved" : "Save"}</span>
                  </ActionBtn>
                </div>

                <div className="flex items-center gap-1">
                  <ShareBtn
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    title="Share on Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </ShareBtn>
                  <ShareBtn
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
                    title="Share on Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </ShareBtn>
                  <button
                    onClick={handleCopy}
                    title="Copy link"
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#D8C18D] hover:text-[#112250] transition-all"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                  {copied && (
                    <span className="text-xs text-green-600 font-medium ml-1 animate-in fade-in">
                      Copied!
                    </span>
                  )}
                </div>
              </div>

              {/* Article content */}
              <div ref={contentRef}>
                {article.content ? (
                  <div
                    className="
                      prose prose-lg max-w-none font-body
                      prose-headings:font-heading prose-headings:text-[#112250]
                      prose-p:text-gray-700 prose-p:leading-relaxed
                      prose-a:text-[#112250] prose-a:no-underline hover:prose-a:text-[#D8C18D]
                      prose-strong:text-gray-900
                      prose-blockquote:border-l-[#D8C18D] prose-blockquote:bg-amber-50/40 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-600
                      prose-img:rounded-2xl prose-img:shadow-lg prose-img:max-w-full
                      prose-code:bg-gray-100 prose-code:px-1.5 prose-code:rounded
                      prose-hr:border-gray-100
                    "
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                ) : article.excerpt ? (
                  <p className="text-lg text-gray-600 leading-relaxed font-body">{article.excerpt}</p>
                ) : null}
              </div>

              {/* Tags */}
              {getTags().length > 0 && (
                <div className="flex flex-wrap gap-2 mt-14 pt-10 border-t border-gray-100">
                  {getTags().map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-[#112250] hover:text-white transition-colors cursor-pointer"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Author card */}
              {authorName && (
                <div className="mt-14 p-8 rounded-2xl bg-gradient-to-br from-[#112250]/5 to-[#D8C18D]/10 border border-[#D8C18D]/20">
                  <p className="text-xs font-semibold tracking-widest uppercase text-[#D8C18D] mb-5">
                    About the Author
                  </p>
                  <div className="flex items-start gap-5">
                    <Avatar className="w-16 h-16 ring-2 ring-[#D8C18D]/30 shrink-0">
                      <AvatarImage src={getAuthorImage()} alt={authorName} />
                      <AvatarFallback className="bg-[#112250] text-[#D8C18D] text-lg font-bold">
                        {authorName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#112250] font-bold text-lg font-heading mb-1">{authorName}</h3>
                      {getAuthorBio() ? (
                        <p className="text-gray-600 text-sm leading-relaxed font-body">{getAuthorBio()}</p>
                      ) : (
                        <p className="text-gray-500 text-sm font-body">Writer at The Journey Association</p>
                      )}
                      <button className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#112250] hover:text-[#D8C18D] transition-colors tracking-wide">
                        Follow
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Back link */}
              <div className="mt-12">
                <Link
                  to="/news"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#112250] transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  Back to all articles
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">

                {/* Share card */}
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-50">
                    <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                      Share Article
                    </p>
                  </div>
                  <div className="p-4 space-y-2">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Facebook className="w-4 h-4 text-blue-600" />
                      </div>
                      Facebook
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-sky-50 text-gray-600 hover:text-sky-600 transition-colors text-sm font-medium"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                        <Twitter className="w-4 h-4 text-sky-500" />
                      </div>
                      Twitter
                    </a>
                    <button
                      onClick={handleCopy}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Link2 className="w-4 h-4 text-gray-500" />
                      </div>
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                </div>

                {/* Stats card */}
                {(article.views !== undefined || article.likes !== undefined || article.comments_count !== undefined) && (
                  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50">
                      <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                        Article Stats
                      </p>
                    </div>
                    <div className="p-4 divide-y divide-gray-50">
                      {article.views !== undefined && (
                        <StatRow icon={<Eye className="w-3.5 h-3.5" />} label="Views" value={article.views.toLocaleString()} />
                      )}
                      {article.likes !== undefined && (
                        <StatRow icon={<Heart className="w-3.5 h-3.5" />} label="Likes" value={(article.likes + (isLiked ? 1 : 0)).toLocaleString()} />
                      )}
                      {article.comments_count !== undefined && (
                        <StatRow icon={<Calendar className="w-3.5 h-3.5" />} label="Comments" value={article.comments_count.toLocaleString()} />
                      )}
                    </div>
                  </div>
                )}

                {/* Reading progress */}
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                      Progress
                    </p>
                    <span className="text-xs font-bold text-[#112250]">{Math.round(readingProgress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${readingProgress}%`,
                        background: "linear-gradient(90deg, #112250, #D8C18D)",
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">{getReadTime()} total</p>
                </div>

              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full bg-[#112250] text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-[#D8C18D] hover:scale-110 ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      <Footer />
    </div>
  );
};

/* ─── small helper components ─────────────────────────────── */

function ActionBtn({
  children,
  active,
  activeClass,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  activeClass: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all ${
        active ? activeClass : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function ShareBtn({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#D8C18D] hover:text-[#112250] transition-all"
    >
      {children}
    </a>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
  );
}

export default BlogPost;
