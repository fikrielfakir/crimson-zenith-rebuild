import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  Share2, 
  Heart, 
  Bookmark, 
  Facebook, 
  Twitter, 
  MessageCircle,
  ArrowUp,
  Tag,
  Eye,
  ChevronUp,
  ChevronDown,
  Home,
  ChevronRight
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
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const progress = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!slug) return;
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/news/${slug}`, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setArticle(data);
      } catch (err: any) {
        setError(err.message ?? 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const getAuthorName = (): string => {
    if (!article) return '';
    if (typeof article.author === 'object' && article.author?.name) return article.author.name;
    if (typeof article.author === 'string') return article.author;
    return article.author_name ?? 'The Journey Team';
  };

  const getAuthorImage = (): string => {
    if (!article) return '/api/placeholder/100/100';
    if (typeof article.author === 'object' && (article.author?.avatar || article.author?.image))
      return article.author.avatar ?? article.author.image ?? '/api/placeholder/100/100';
    return '/api/placeholder/100/100';
  };

  const getAuthorBio = (): string => {
    if (!article) return '';
    if (typeof article.author === 'object' && article.author?.bio) return article.author.bio;
    return '';
  };

  const getImage = (): string => {
    if (!article) return '/api/placeholder/1200/600';
    return article.image_url ?? article.cover_image ?? article.image ?? '/api/placeholder/1200/600';
  };

  const getDate = (): string => article?.published_at ?? article?.created_at ?? '';

  const getReadTime = (): string => article?.read_time ?? article?.reading_time ?? '5 min read';

  const getTags = (): string[] => {
    if (!article?.tags) return [];
    if (Array.isArray(article.tags)) return article.tags;
    try { return JSON.parse(article.tags); } catch { return []; }
  };

  const authorName = getAuthorName();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground font-body">Loading article…</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <p className="text-destructive font-body mb-4">{error ?? 'Article not found'}</p>
            <Link to="/news">
              <Button variant="outline">Back to Blog</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <section className="relative h-[60vh] overflow-hidden">
        <img 
          src={getImage()} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto max-w-4xl">
            {article.category && (
              <Badge className="bg-primary text-white mb-4">
                {article.category}
              </Badge>
            )}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-heading leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={getAuthorImage()} alt={authorName} />
                  <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-body">{authorName}</span>
              </div>
              {getDate() && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="font-body">{new Date(getDate()).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="font-body">{getReadTime()}</span>
              </div>
              {article.views !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span className="font-body">{article.views} views</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-3">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-6 border-b">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                      className={isLiked ? "text-red-500 border-red-500" : ""}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                      {(article.likes ?? 0) + (isLiked ? 1 : 0)}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={isBookmarked ? "text-primary border-primary" : ""}
                    >
                      <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                      {isBookmarked ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Twitter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {article.content && (
                  <div 
                    className="prose prose-lg max-w-none font-body prose-img:max-w-full prose-img:h-auto prose-img:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                )}
                {!article.content && article.excerpt && (
                  <p className="font-body text-lg text-muted-foreground">{article.excerpt}</p>
                )}

                {getTags().length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t">
                    {getTags().map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {(authorName || getAuthorBio()) && (
                  <Card className="mt-12">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={getAuthorImage()} alt={authorName} />
                          <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold font-heading mb-2">{authorName}</h3>
                          {getAuthorBio() && (
                            <p className="text-muted-foreground font-body text-sm mb-3">{getAuthorBio()}</p>
                          )}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Follow
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-sm">Share This Article</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => navigator.clipboard.writeText(window.location.href)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </CardContent>
                </Card>

                {(article.views !== undefined || article.likes !== undefined) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading text-sm">Article Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {article.views !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="font-body">Views</span>
                          <span className="font-semibold">{article.views.toLocaleString()}</span>
                        </div>
                      )}
                      {article.likes !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="font-body">Likes</span>
                          <span className="font-semibold">{article.likes}</span>
                        </div>
                      )}
                      {article.shares !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="font-body">Shares</span>
                          <span className="font-semibold">{article.shares}</span>
                        </div>
                      )}
                      {article.comments_count !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="font-body">Comments</span>
                          <span className="font-semibold">{article.comments_count}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Back to Top
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
