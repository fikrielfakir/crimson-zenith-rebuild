import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Clock,
  Calendar,
  ArrowRight,
  TrendingUp,
  Mail,
  Tag,
  ChevronRight,
  User,
  Flame,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { routeSEO } from "@/lib/seo.config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { apiFetch, resolveStorageUrl } from "@/lib/apiFetch";

interface Article {
  id: number;
  title: string;
  excerpt?: string;
  summary?: string;
  slug?: string;
  author?: { name?: string; avatar?: string } | string | null;
  author_name?: string;
  published_at?: string;
  created_at?: string;
  category?: string;
  image_url?: string;
  featured_image?: string;
  image?: string;
  tags?: string[] | string;
  views?: number;
}

function getAuthorName(a: Article): string {
  if (typeof a.author === "object" && a.author?.name) return a.author.name;
  if (typeof a.author === "string") return a.author;
  return a.author_name ?? "The Journey Team";
}

function getImage(a: Article): string {
  const raw = a.featured_image ?? a.image_url ?? a.image ?? null;
  return resolveStorageUrl(raw) ?? "/api/placeholder/800/500";
}

function getDate(a: Article): string {
  return a.published_at ?? a.created_at ?? "";
}

function formatDate(d: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getReadTime(a: Article): string {
  if (!a.excerpt && !a.summary) return "3 min read";
  const words = ((a.excerpt ?? "") + " " + (a.summary ?? "")).trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function getTags(a: Article): string[] {
  if (!a.tags) return [];
  if (Array.isArray(a.tags)) return a.tags;
  try {
    return JSON.parse(a.tags as string);
  } catch {
    return [];
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  news: "bg-blue-500",
  announcement: "bg-amber-500",
  event: "bg-emerald-500",
  blog: "bg-purple-500",
};

function getCategoryColor(cat?: string) {
  return CATEGORY_COLORS[cat?.toLowerCase() ?? ""] ?? "bg-primary";
}

function ArticleSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-muted rounded-2xl h-48 mb-4" />
      <div className="h-4 bg-muted rounded w-1/3 mb-2" />
      <div className="h-5 bg-muted rounded w-full mb-1" />
      <div className="h-5 bg-muted rounded w-3/4 mb-3" />
      <div className="h-3 bg-muted rounded w-1/2" />
    </div>
  );
}

export default function News() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [email, setEmail] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    apiFetch(`/api/news?${params}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : (data.posts ?? data.data ?? []));
        setError(null);
      })
      .catch((err) => setError(err.message ?? "Failed to load articles"))
      .finally(() => setLoading(false));
  }, [debouncedSearch, selectedCategory]);

  const uniqueCategories = Array.from(
    new Set(articles.map((a) => a.category).filter(Boolean))
  ) as string[];

  const tabs = [
    { id: "all", label: "All Articles", count: articles.length },
    ...uniqueCategories.map((c) => ({
      id: c,
      label: c.charAt(0).toUpperCase() + c.slice(1),
      count: articles.filter((a) => a.category === c).length,
    })),
  ];

  const filtered =
    selectedCategory === "all"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);
  const trending = [...articles].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 5);
  const allTags = Array.from(new Set(articles.flatMap(getTags))).slice(0, 12);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...routeSEO["/news"]} />
      <Header />

      <PageHero
        pageKey="blog"
        scrollY={scrollY}
        breadcrumbs={[{ label: t("nav.blog") }]}
        defaultTitle={t("nav.blog")}
        defaultSubtitle={t("news.subtitle")}
        defaultImage="https://api.thejourney-ma.org/attached_assets/generated_images/Essaouira_coastal_fortifications_07abbfb6.png"
      />

      {/* ── Filter bar ─────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-3">
            {/* Category tabs */}
            <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                      selectedCategory === tab.id
                        ? "bg-white/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search articles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm bg-muted/50 border-transparent focus:border-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────── */}
      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">

          {/* Left: article feed */}
          <div>
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => <ArticleSkeleton key={i} />)}
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <span className="text-destructive text-2xl">!</span>
                </div>
                <p className="text-muted-foreground">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Try again
                </Button>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-2">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg">No articles found</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Try a different search term or browse all categories.
                </p>
                <Button variant="outline" size="sm" onClick={() => { setSearch(""); setSelectedCategory("all"); }}>
                  Clear filters
                </Button>
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <>
                {/* Featured article */}
                {featured && (
                  <article
                    className="group relative mb-10 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
                    onClick={() => featured.slug && navigate(`/news/${featured.slug}`)}
                  >
                    <div className="relative aspect-[16/7] overflow-hidden">
                      <img
                        src={getImage(featured)}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/api/placeholder/1200/525"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white ${getCategoryColor(featured.category)}`}>
                          {featured.category ?? "Article"}
                        </span>
                        {featured.views !== undefined && (
                          <span className="text-xs text-white/70 flex items-center gap-1">
                            <Flame className="w-3 h-3" /> {featured.views} views
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold font-heading leading-snug mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                        {featured.title}
                      </h2>
                      {(featured.excerpt ?? featured.summary) && (
                        <p className="text-white/80 text-sm line-clamp-2 mb-4 max-w-2xl">
                          {featured.excerpt ?? featured.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-white/70">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {getAuthorName(featured)}
                        </span>
                        {getDate(featured) && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatDate(getDate(featured))}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {getReadTime(featured)}
                        </span>
                      </div>
                    </div>
                  </article>
                )}

                {/* Article grid */}
                {rest.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {rest.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        onClick={() => article.slug && navigate(`/news/${article.slug}`)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right: sidebar */}
          <aside className="space-y-6">
            {/* Trending */}
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="font-semibold font-heading flex items-center gap-2 mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-primary" /> Trending
              </h3>
              {trending.length === 0 ? (
                <p className="text-sm text-muted-foreground">No articles yet.</p>
              ) : (
                <div className="space-y-4">
                  {trending.map((article, i) => (
                    <button
                      key={article.id}
                      className="flex gap-3 w-full text-left group"
                      onClick={() => article.slug && navigate(`/news/${article.slug}`)}
                    >
                      <span className="w-7 h-7 shrink-0 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {getReadTime(article)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="rounded-2xl border bg-card p-5">
                <h3 className="font-semibold font-heading flex items-center gap-2 mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                  <Tag className="w-4 h-4 text-primary" /> Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                      onClick={() => setSearch(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter */}
            <div className="rounded-2xl bg-primary text-primary-foreground p-5">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold font-heading text-lg mb-1">Stay Updated</h3>
              <p className="text-primary-foreground/80 text-sm mb-4">
                Get the latest adventure tips, safety updates, and member stories delivered to your inbox.
              </p>
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/15 border-white/20 text-white placeholder:text-white/50 mb-3 focus:bg-white/20"
              />
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold">
                Subscribe
              </Button>
              <p className="text-xs text-primary-foreground/50 mt-2 text-center">
                Weekly digest · Unsubscribe anytime
              </p>
            </div>

            {/* Categories list */}
            {uniqueCategories.length > 0 && (
              <div className="rounded-2xl border bg-card p-5">
                <h3 className="font-semibold font-heading flex items-center gap-2 mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                  Browse Categories
                </h3>
                <div className="space-y-1">
                  {[
                    { id: "all", label: "All Articles", count: articles.length },
                    ...uniqueCategories.map((c) => ({
                      id: c,
                      label: c.charAt(0).toUpperCase() + c.slice(1),
                      count: articles.filter((a) => a.category === c).length,
                    })),
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3" />
                        {cat.label}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ArticleCard({ article, onClick }: { article: Article; onClick: () => void }) {
  return (
    <article
      className="group flex flex-col rounded-2xl border bg-card overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/9]">
        <img
          src={getImage(article)}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = "/api/placeholder/640/360"; }}
        />
        {article.category && (
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full text-white ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-semibold font-heading text-base leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        {(article.excerpt ?? article.summary) && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {article.excerpt ?? article.summary}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
              <User className="w-3 h-3" />
            </div>
            <span className="truncate max-w-[100px]">{getAuthorName(article)}</span>
          </div>
          <div className="flex items-center gap-3">
            {getDate(article) && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(getDate(article))}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getReadTime(article)}
            </span>
          </div>
        </div>

        <button className="mt-3 text-xs font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all self-start">
          Read more <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </article>
  );
}
