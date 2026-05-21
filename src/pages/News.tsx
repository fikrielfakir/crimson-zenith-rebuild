import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  TrendingUp,
  Filter,
  Download,
  Mail
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

interface Article {
  id: number;
  title: string;
  excerpt?: string;
  summary?: string;
  content?: string;
  slug?: string;
  author?: { name?: string; avatar?: string } | string;
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
  featured?: boolean;
  is_featured?: boolean;
}

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        const res = await fetch(`/api/news?${params.toString()}`, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : (data.data ?? []));
        setError(null);
      } catch (err: any) {
        setError(err.message ?? 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [searchQuery, selectedCategory]);

  const getAuthorName = (a: Article): string => {
    if (typeof a.author === 'object' && a.author?.name) return a.author.name;
    if (typeof a.author === 'string') return a.author;
    return a.author_name ?? 'The Journey Team';
  };

  const getAuthorImage = (a: Article): string => {
    if (typeof a.author === 'object' && a.author?.avatar) return a.author.avatar;
    return '/api/placeholder/50/50';
  };

  const getImage = (a: Article): string =>
    a.image_url ?? a.cover_image ?? a.image ?? '/api/placeholder/600/300';

  const getDate = (a: Article): string => a.published_at ?? a.created_at ?? '';

  const getReadTime = (a: Article): string => a.read_time ?? a.reading_time ?? '5 min read';

  const getExcerpt = (a: Article): string => a.excerpt ?? a.summary ?? '';

  const isFeatured = (a: Article): boolean => !!(a.featured ?? a.is_featured);

  const getTags = (a: Article): string[] => {
    if (!a.tags) return [];
    if (Array.isArray(a.tags)) return a.tags;
    try { return JSON.parse(a.tags); } catch { return []; }
  };

  const uniqueCategories = Array.from(new Set(articles.map(a => a.category).filter(Boolean)));
  const categories = [
    { id: "all", name: "All Articles", count: articles.length },
    ...uniqueCategories.map(cat => ({
      id: cat as string,
      name: cat as string,
      count: articles.filter(a => a.category === cat).length
    }))
  ];

  const featuredArticle = articles.find(isFeatured) ?? articles[0];
  const regularArticles = featuredArticle
    ? articles.filter(a => a.id !== featuredArticle.id)
    : articles;

  const filteredArticles = selectedCategory === "all"
    ? regularArticles
    : regularArticles.filter(a => a.category === selectedCategory);

  const popularTags = Array.from(
    new Set(articles.flatMap(a => getTags(a)))
  ).slice(0, 10);

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Adventure Tips": return "bg-primary";
      case "Safety Updates": return "bg-destructive";
      case "Member Spotlights": return "bg-success";
      case "Gear Reviews": return "bg-warning";
      default: return "bg-muted";
    }
  };

  const handleReadMore = (article: Article) => {
    if (article.slug) navigate(`/news/${article.slug}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative">
        <PageHero
          pageKey="blog"
          scrollY={scrollY}
          breadcrumbs={[{ label: "Blog" }]}
          defaultTitle="Blog"
          defaultSubtitle="Stay updated with the latest adventure tips, safety guidelines, member spotlights, and gear reviews."
          defaultImage="/attached_assets/generated_images/Atlas_Mountain_Sunrise_9a8b7c6d.png"
        />

        <section className="py-8 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="font-body"
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Button variant="outline" size="sm" className="min-h-[44px]">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                {loading && (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground font-body">Loading articles…</p>
                  </div>
                )}
                {error && (
                  <div className="text-center py-16">
                    <p className="text-destructive font-body mb-4">Could not load articles: {error}</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
                  </div>
                )}
                {!loading && !error && filteredArticles.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground font-body">No articles found.</p>
                  </div>
                )}
                {!loading && !error && filteredArticles.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredArticles.map((article) => (
                        <Card key={article.id} className="group hover:shadow-glow transition-all duration-300">
                          <div className="relative overflow-hidden rounded-t-card">
                            <img 
                              src={getImage(article)} 
                              alt={article.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <Badge className={`absolute top-3 left-3 ${getCategoryColor(article.category)} text-white`}>
                              {article.category ?? 'Article'}
                            </Badge>
                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-lg font-semibold font-heading mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-muted-foreground font-body text-sm mb-4 line-clamp-3">
                              {getExcerpt(article)}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                              <div className="flex items-center gap-2">
                                <img 
                                  src={getAuthorImage(article)} 
                                  alt={getAuthorName(article)}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="font-body">{getAuthorName(article)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span className="font-body">{getReadTime(article)}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground font-body">
                                {getDate(article) ? new Date(getDate(article)).toLocaleDateString() : ''}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary/80"
                                onClick={() => handleReadMore(article)}
                              >
                                Read More →
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="text-center mt-12">
                      <Button variant="outline" className="font-body">
                        Load More Articles
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <div className="lg:col-span-1 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-heading">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Trending
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {articles.slice(0, 3).map((article, index) => (
                      <div key={article.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold font-heading text-sm mb-1 line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-muted-foreground font-body">
                            {getReadTime(article)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {popularTags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading">Popular Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {popularTags.map((tag) => (
                          <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-primary text-primary-foreground">
                  <CardHeader>
                    <CardTitle className="font-heading text-white">Stay Updated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-primary-foreground/80 font-body text-sm mb-4">
                      Get the latest adventure tips, safety updates, and member stories delivered to your inbox.
                    </p>
                    <div className="space-y-3">
                      <Input 
                        placeholder="Your email address"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                      <Button className="w-full bg-secondary hover:bg-secondary/90 text-white">
                        <Mail className="w-4 h-4 mr-2" />
                        Subscribe
                      </Button>
                    </div>
                    <p className="text-xs text-primary-foreground/60 mt-3 font-body">
                      Weekly digest • Unsubscribe anytime
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Newsletter Archive</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { title: "December 2024 Adventure Digest", date: "Dec 1, 2024" },
                      { title: "November 2024 Monthly Roundup", date: "Nov 1, 2024" },
                      { title: "October 2024 Safety Updates", date: "Oct 1, 2024" }
                    ].map((newsletter, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold font-heading text-sm">{newsletter.title}</h4>
                          <p className="text-xs text-muted-foreground font-body">{newsletter.date}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      View All Archives
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default News;
