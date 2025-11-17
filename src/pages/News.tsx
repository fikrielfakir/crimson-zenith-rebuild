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
  Mail,
  Home,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock news articles data
  const articles = [
    {
      id: 1,
      title: "Atlas Mountains Open New Trekking Routes for 2025",
      excerpt: "Discover newly accessible high-altitude trails that offer breathtaking views and challenging terrain for experienced hikers.",
      content: "The High Atlas Mountains have unveiled three spectacular new trekking routes...",
      author: "Rachid Benali",
      authorImage: "/api/placeholder/50/50",
      date: "2024-12-15",
      category: "Adventure Tips",
      image: "/api/placeholder/800/400",
      readTime: "5 min read",
      tags: ["trekking", "atlas", "routes", "2025"],
      featured: true
    },
    {
      id: 2,
      title: "Essential Safety Guidelines for Desert Adventures",
      excerpt: "Updated safety protocols and equipment recommendations for Sahara Desert expeditions during peak season.",
      content: "As we enter the optimal desert season, our safety team has compiled...",
      author: "Dr. Laila Mansouri",
      authorImage: "/api/placeholder/50/50", 
      date: "2024-12-12",
      category: "Safety Updates",
      image: "/api/placeholder/600/300",
      readTime: "8 min read",
      tags: ["safety", "desert", "equipment"],
      featured: false
    },
    {
      id: 3,
      title: "Member Spotlight: From Beginner to Mountain Guide",
      excerpt: "Hassan's inspiring journey from his first club hike to becoming a certified mountain guide in just two years.",
      content: "Two years ago, Hassan attended his first Atlas Hikers meetup...",
      author: "Fatima El-Khoury",
      authorImage: "/api/placeholder/50/50",
      date: "2024-12-10",
      category: "Member Spotlights", 
      image: "/api/placeholder/600/400",
      readTime: "6 min read",
      tags: ["member", "guide", "inspiration"],
      featured: false
    },
    {
      id: 4,
      title: "2024 Gear Review: Best Hiking Boots for Morocco",
      excerpt: "Comprehensive testing of 15 hiking boot models across Morocco's diverse terrains, from desert to mountain peaks.",
      content: "Our gear testing team spent six months evaluating hiking boots...",
      author: "Omar Zerouali",
      authorImage: "/api/placeholder/50/50",
      date: "2024-12-08",
      category: "Gear Reviews",
      image: "/api/placeholder/700/350",
      readTime: "12 min read",
      tags: ["gear", "boots", "review", "hiking"],
      featured: false
    },
    {
      id: 5,
      title: "Sustainable Tourism Initiative Launched",
      excerpt: "New partnership with local communities aims to preserve Morocco's natural heritage while supporting local economies.",
      content: "We're excited to announce our new sustainable tourism initiative...",
      author: "Aicha Benomar",
      authorImage: "/api/placeholder/50/50",
      date: "2024-12-05",
      category: "Adventure Tips",
      image: "/api/placeholder/600/300",
      readTime: "7 min read",
      tags: ["sustainability", "community", "environment"],
      featured: true
    },
    {
      id: 6,
      title: "Winter Photography Workshop Results",
      excerpt: "Stunning captures from our recent High Atlas winter photography workshop showcase the beauty of snow-capped peaks.",
      content: "Last week's winter photography workshop exceeded all expectations...",
      author: "Youssef Alami",
      authorImage: "/api/placeholder/50/50",
      date: "2024-12-03",
      category: "Member Spotlights",
      image: "/api/placeholder/500/400",
      readTime: "4 min read",
      tags: ["photography", "winter", "workshop"],
      featured: false
    }
  ];

  const categories = [
    { id: "all", name: "All Articles", count: articles.length },
    { id: "Adventure Tips", name: "Adventure Tips", count: articles.filter(a => a.category === "Adventure Tips").length },
    { id: "Safety Updates", name: "Safety Updates", count: articles.filter(a => a.category === "Safety Updates").length },
    { id: "Member Spotlights", name: "Member Spotlights", count: articles.filter(a => a.category === "Member Spotlights").length },
    { id: "Gear Reviews", name: "Gear Reviews", count: articles.filter(a => a.category === "Gear Reviews").length }
  ];

  const featuredArticle = articles.find(article => article.featured) || articles[0];
  const regularArticles = articles.filter(article => !article.featured || article.id !== featuredArticle.id);

  const filteredArticles = selectedCategory === "all" 
    ? regularArticles 
    : regularArticles.filter(article => article.category === selectedCategory);

  const popularTags = ["trekking", "safety", "gear", "desert", "photography", "community", "guides"];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Adventure Tips": return "bg-primary";
      case "Safety Updates": return "bg-destructive";
      case "Member Spotlights": return "bg-success";
      case "Gear Reviews": return "bg-warning";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative">
        {/* Hero Section with Background Image */}
        <section className="relative py-20 overflow-hidden" style={{ paddingTop: '15rem' }}>
          {/* Background Image with Parallax */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/attached_assets/generated_images/Atlas_Mountain_Sunrise_9a8b7c6d.png')`,
              transform: `translateY(${scrollY * 0.3}px)`,
              filter: 'brightness(0.6) contrast(1.1) saturate(1.2)',
            }}
          />

          {/* Gradient Overlay for Better Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />

          {/* Content */}
          <div className="relative container mx-auto px-6">
            {/* Breadcrumb Navigation */}
            <nav className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link 
                    to="/" 
                    className="flex items-center text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40"
                  >
                    <Home className="w-4 h-4 mr-1.5" />
                    Home
                  </Link>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-2 text-white/50" />
                  <span className="text-white font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 shadow-lg">
                    Blog
                  </span>
                </li>
              </ol>
            </nav>

            {/* Main Heading */}
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
                Blog
              </h1>
              <p className="text-lg md:text-xl text-white/95 max-w-2xl leading-relaxed drop-shadow-lg">
                Stay updated with the latest adventure tips, safety guidelines, member spotlights, and gear reviews. Your go-to resource for all things Morocco exploration.
              </p>
            </div>
          </div>
        </section>

      {/* Category Navigation */}
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
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Articles Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="group hover:shadow-glow transition-all duration-300">
                    <div className="relative overflow-hidden rounded-t-card">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className={`absolute top-3 left-3 ${getCategoryColor(article.category)} text-white`}>
                        {article.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold font-heading mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground font-body text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <img 
                            src={article.authorImage} 
                            alt={article.author}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-body">{article.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span className="font-body">{article.readTime}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-body">
                          {new Date(article.date).toLocaleDateString()}
                        </span>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                          Read More →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Load More Button */}
              <div className="text-center mt-12">
                <Button variant="outline" className="font-body">
                  Load More Articles
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Trending */}
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
                          {article.readTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Tags Cloud */}
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

              {/* Newsletter Signup */}
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

              {/* Newsletter Archive */}
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