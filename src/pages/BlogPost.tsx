import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  User, 
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
  ChevronDown
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BlogPost = () => {
  const [readingProgress, setReadingProgress] = useState(65);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock article data
  const article = {
    id: 1,
    title: "Atlas Mountains Open New Trekking Routes for 2025",
    content: `
      <p>The High Atlas Mountains have unveiled three spectacular new trekking routes that promise to revolutionize mountain adventures in Morocco. These carefully planned trails offer unprecedented access to remote peaks and hidden valleys that were previously restricted to expert climbers only.</p>

      <h2>The Three New Routes</h2>
      
      <h3>1. The Toubkal Circuit Extension</h3>
      <p>Building on the famous Toubkal Circuit, this extension adds two additional days to explore the remote eastern flanks of Jbel Toubkal. The route includes overnight stays in traditional Berber villages and offers stunning sunrise views from previously inaccessible viewpoints.</p>
      
      <p><strong>Key highlights:</strong></p>
      <ul>
        <li>Duration: 7 days (extension of the classic 5-day circuit)</li>
        <li>Difficulty: Moderate to challenging</li>
        <li>Maximum elevation: 4,200m</li>
        <li>Best months: April-October</li>
      </ul>

      <h3>2. The Hidden Valley Trail</h3>
      <p>This newly opened route takes adventurers through the mysterious Azzaden Valley, following ancient caravan paths that connect remote mountain communities. The trail features dramatic waterfalls, alpine lakes, and traditional terraced farming systems.</p>
      
      <blockquote>
        <p>"The Hidden Valley Trail represents everything we love about Morocco's mountains - authentic culture, pristine nature, and the spirit of adventure that connects us all." - Rachid Benali, Route Developer</p>
      </blockquote>

      <h3>3. The Photographer's Paradise Loop</h3>
      <p>Designed in collaboration with our Photography Collective, this route maximizes scenic opportunities while maintaining sustainable visitor numbers. Each day's trek is planned around optimal lighting conditions for landscape photography.</p>

      <h2>Safety and Sustainability</h2>
      <p>All new routes have been developed with strict safety and environmental protocols. Local guides have been specially trained for these trails, and visitor numbers are carefully managed to preserve the pristine mountain environment.</p>
      
      <p>The development of these routes also supports local communities through:</p>
      <ul>
        <li>Employment opportunities for local guides and porters</li>
        <li>Income generation through guesthouse accommodations</li>
        <li>Cultural exchange programs</li>
        <li>Environmental conservation initiatives</li>
      </ul>

      <h2>Booking Information</h2>
      <p>Reservations for the 2025 season open on January 1st, 2025. Early booking is strongly recommended as these routes have limited capacity to ensure quality experiences and environmental protection.</p>
      
      <p>Each route includes:</p>
      <ul>
        <li>Certified mountain guide</li>
        <li>All camping and safety equipment</li>
        <li>Traditional meals prepared by local communities</li>
        <li>Environmental impact offset programs</li>
        <li>Emergency evacuation insurance</li>
      </ul>
    `,
    author: {
      name: "Rachid Benali",
      bio: "Rachid is a certified mountain guide with over 15 years of experience in the Atlas Mountains. He has led expeditions to all major peaks in Morocco and is passionate about sustainable mountain tourism.",
      image: "/api/placeholder/100/100",
      socialLinks: {
        twitter: "@rachidbenali",
        instagram: "@atlas_adventures"
      }
    },
    publishDate: "2024-12-15",
    readTime: "8 min read",
    category: "Adventure Tips",
    tags: ["atlas mountains", "trekking", "new routes", "sustainability", "adventure"],
    image: "/api/placeholder/1200/600",
    stats: {
      views: 1247,
      likes: 89,
      shares: 23,
      comments: 15
    }
  };

  const relatedArticles = [
    {
      id: 2,
      title: "Essential Gear for High Atlas Trekking",
      image: "/api/placeholder/300/200",
      category: "Gear Reviews",
      readTime: "6 min read"
    },
    {
      id: 3,
      title: "Berber Culture: Understanding Mountain Communities", 
      image: "/api/placeholder/300/200",
      category: "Cultural",
      readTime: "10 min read"
    },
    {
      id: 4,
      title: "Weather Patterns in the Atlas Mountains",
      image: "/api/placeholder/300/200", 
      category: "Safety",
      readTime: "5 min read"
    }
  ];

  const comments = [
    {
      id: 1,
      author: "Sarah Martinez",
      avatar: "/api/placeholder/40/40",
      date: "2 days ago",
      content: "This is exactly what I've been waiting for! The Hidden Valley Trail sounds incredible. Already planning my trip for spring 2025.",
      likes: 12,
      replies: [
        {
          id: 2,
          author: "Ahmed Hassan",
          avatar: "/api/placeholder/40/40", 
          date: "1 day ago",
          content: "Same here! Would love to connect if you're looking for a trekking partner.",
          likes: 3
        }
      ]
    },
    {
      id: 3,
      author: "Mountain Explorer",
      avatar: "/api/placeholder/40/40",
      date: "3 days ago", 
      content: "Great to see sustainable development in the Atlas. The focus on community support is commendable.",
      likes: 8,
      replies: []
    }
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Featured Image */}
      <section className="relative h-[60vh] overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto max-w-4xl">
            <Badge className="bg-primary text-white mb-4">
              {article.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={article.author.image} alt={article.author.name} />
                  <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-body">{article.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="font-body">{new Date(article.publishDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="font-body">{article.readTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="font-body">{article.stats.views} views</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Article Content */}
            <div className="lg:col-span-3">
              <div className="max-w-3xl">
                {/* Social Share Actions */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleLike}
                      className={isLiked ? "text-red-500 border-red-500" : ""}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                      {article.stats.likes + (isLiked ? 1 : 0)}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleBookmark}
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

                {/* Article Body */}
                <div 
                  className="prose prose-lg max-w-none font-body"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Author Bio */}
                <Card className="mt-12">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={article.author.image} alt={article.author.name} />
                        <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold font-heading mb-2">{article.author.name}</h3>
                        <p className="text-muted-foreground font-body text-sm mb-3">{article.author.bio}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Twitter className="w-4 h-4 mr-2" />
                            {article.author.socialLinks.twitter}
                          </Button>
                          <Button variant="outline" size="sm">
                            Follow
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comments Section */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold font-heading mb-6">
                    Comments ({comments.length + comments.reduce((acc, comment) => acc + comment.replies.length, 0)})
                  </h3>
                  
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={comment.avatar} alt={comment.author} />
                              <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold font-heading">{comment.author}</span>
                                <span className="text-xs text-muted-foreground font-body">{comment.date}</span>
                              </div>
                              <p className="font-body text-sm mb-3">{comment.content}</p>
                              <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm">
                                  <ChevronUp className="w-4 h-4 mr-1" />
                                  {comment.likes}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <ChevronDown className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MessageCircle className="w-4 h-4 mr-1" />
                                  Reply
                                </Button>
                              </div>
                              
                              {/* Replies */}
                              {comment.replies.length > 0 && (
                                <div className="mt-4 pl-4 border-l-2 border-muted space-y-4">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="flex gap-3">
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage src={reply.avatar} alt={reply.author} />
                                        <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-semibold font-heading text-sm">{reply.author}</span>
                                          <span className="text-xs text-muted-foreground font-body">{reply.date}</span>
                                        </div>
                                        <p className="font-body text-sm mb-2">{reply.content}</p>
                                        <div className="flex items-center gap-4">
                                          <Button variant="ghost" size="sm">
                                            <ChevronUp className="w-3 h-3 mr-1" />
                                            {reply.likes}
                                          </Button>
                                          <Button variant="ghost" size="sm">
                                            <ChevronDown className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Social Sharing Sidebar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-sm">Share This Article</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook ({Math.floor(article.stats.shares * 0.6)})
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter ({Math.floor(article.stats.shares * 0.4)})
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Share2 className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </CardContent>
                </Card>

                {/* Article Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-sm">Article Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-body">Views</span>
                      <span className="font-semibold">{article.stats.views.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-body">Likes</span>
                      <span className="font-semibold">{article.stats.likes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-body">Shares</span>
                      <span className="font-semibold">{article.stats.shares}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-body">Comments</span>
                      <span className="font-semibold">{article.stats.comments}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Articles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Related Articles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedArticles.map((related) => (
                      <div key={related.id} className="group cursor-pointer">
                        <img 
                          src={related.image} 
                          alt={related.title}
                          className="w-full h-20 object-cover rounded-button mb-2 group-hover:scale-105 transition-transform duration-300"
                        />
                        <h4 className="font-semibold font-heading text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-body">{related.category}</span>
                          <span className="font-body">{related.readTime}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Scroll to Top */}
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