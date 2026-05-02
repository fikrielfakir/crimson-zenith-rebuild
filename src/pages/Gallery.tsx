import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  Upload, 
  Play, 
  Download, 
  Heart, 
  Share2, 
  X,
  MapPin,
  Calendar,
  User,
  Tag,
  Home,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface GalleryItem {
  id: number;
  type: string;
  url: string;
  thumbnail?: string;
  title: string;
  location?: string;
  date?: string;
  photographer?: string;
  tags?: string[];
  category?: string;
  likes?: number;
  description?: string;
}

const STATIC_GALLERY: GalleryItem[] = [
  {
    id: 1,
    type: "photo",
    url: "/api/placeholder/400/600",
    title: "Atlas Mountain Sunrise",
    location: "High Atlas",
    date: "2024-11-15",
    photographer: "Sarah M.",
    tags: ["mountain", "sunrise", "landscape"],
    category: "mountain",
    likes: 42,
    description: "Breathtaking sunrise over the snow-capped Atlas peaks during our winter trek."
  },
  {
    id: 2,
    type: "photo",
    url: "/api/placeholder/600/400",
    title: "Desert Dunes",
    location: "Merzouga",
    date: "2024-11-10",
    photographer: "Ahmed K.",
    tags: ["desert", "sahara", "landscape"],
    category: "desert",
    likes: 35,
    description: "Golden hour illuminating the endless dunes of the Sahara Desert."
  },
  {
    id: 3,
    type: "video",
    url: "/api/placeholder/400/300",
    thumbnail: "/api/placeholder/400/300",
    title: "Surfing Taghazout",
    location: "Taghazout",
    date: "2024-11-08",
    photographer: "Fatima R.",
    tags: ["surfing", "ocean", "sport"],
    category: "water",
    likes: 28,
    description: "Catching the perfect wave on Morocco's Atlantic coast."
  },
  {
    id: 4,
    type: "photo",
    url: "/api/placeholder/300/400",
    title: "Berber Village Life",
    location: "Imlil Valley",
    date: "2024-11-12",
    photographer: "Omar L.",
    tags: ["culture", "people", "village"],
    category: "cultural",
    likes: 51,
    description: "Daily life in a traditional Berber village nestled in the Atlas Mountains."
  },
  {
    id: 5,
    type: "photo",
    url: "/api/placeholder/500/300",
    title: "Rock Climbing Adventure",
    location: "Todra Gorge",
    date: "2024-11-05",
    photographer: "Hassan M.",
    tags: ["climbing", "adventure", "sport"],
    category: "adventure",
    likes: 33,
    description: "Scaling the limestone cliffs of the spectacular Todra Gorge."
  },
  {
    id: 6,
    type: "photo",
    url: "/api/placeholder/400/500",
    title: "Chefchaouen Blues",
    location: "Chefchaouen",
    date: "2024-11-18",
    photographer: "Layla S.",
    tags: ["architecture", "blue", "city"],
    category: "cultural",
    likes: 67,
    description: "The iconic blue streets of Morocco's most photogenic city."
  },
  {
    id: 7,
    type: "video",
    url: "/api/placeholder/600/400",
    thumbnail: "/api/placeholder/600/400",
    title: "Camel Caravan",
    location: "Erg Chebbi",
    date: "2024-11-14",
    photographer: "Youssef A.",
    tags: ["desert", "camel", "tradition"],
    category: "desert",
    likes: 45,
    description: "Traditional camel caravan crossing the golden dunes at sunset."
  },
  {
    id: 8,
    type: "photo",
    url: "/api/placeholder/350/450",
    title: "Mountain Lake Reflection",
    location: "Ifni Lake",
    date: "2024-11-20",
    photographer: "Nadia H.",
    tags: ["lake", "reflection", "nature"],
    category: "mountain",
    likes: 38,
    description: "Perfect reflections in the crystal-clear waters of Lake Ifni."
  }
];

const normalizeMediaItem = (item: any, index: number): GalleryItem => ({
  id: item.id ?? index + 1000,
  type: item.type ?? item.mime_type?.startsWith('video') ? 'video' : 'photo',
  url: item.url ?? item.file_url ?? item.path ?? '/api/placeholder/400/300',
  thumbnail: item.thumbnail ?? item.thumb_url ?? undefined,
  title: item.title ?? item.name ?? item.filename ?? `Media ${index + 1}`,
  location: item.location ?? undefined,
  date: item.created_at ?? item.date ?? undefined,
  photographer: item.photographer ?? item.uploaded_by ?? undefined,
  tags: Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []),
  category: item.category ?? undefined,
  likes: item.likes ?? undefined,
  description: item.description ?? item.caption ?? undefined,
});

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(STATIC_GALLERY);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch('/api/admin/media', { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        const items: any[] = Array.isArray(data) ? data : (data.data ?? []);
        if (items.length > 0) {
          setGalleryItems(items.map(normalizeMediaItem));
        }
      } catch {
        // Silently fall back to static data
      }
    };
    fetchMedia();
  }, []);

  const uniqueCategories = Array.from(
    new Set(galleryItems.map(i => i.category).filter(Boolean))
  ) as string[];

  const categories = [
    { id: "all", name: "All", count: galleryItems.length },
    ...uniqueCategories.map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: galleryItems.filter(i => i.category === cat).length,
    }))
  ];

  const filteredItems = selectedCategory === "all"
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  const featuredVideos = galleryItems.filter(item => item.type === "video");

  const getMasonryItemClass = (index: number) => {
    const patterns = [
      "md:row-span-2",
      "md:col-span-2",
      "",
      "md:row-span-2",
      "",
      "md:col-span-2",
      "",
      "md:row-span-2"
    ];
    return patterns[index % patterns.length];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative">
        <section className="relative py-20 overflow-hidden" style={{ paddingTop: '15rem' }}>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/attached_assets/generated_images/Chefchaouen_blue_streets_272376ab.png')`,
              transform: `translateY(${scrollY * 0.3}px)`,
              filter: 'brightness(0.6) contrast(1.1) saturate(1.2)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />

          <div className="relative container mx-auto px-6">
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
                    Gallery
                  </span>
                </li>
              </ol>
            </nav>

            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
                Gallery
              </h1>
              <p className="text-lg md:text-xl text-white/95 max-w-2xl leading-relaxed drop-shadow-lg">
                Explore stunning moments captured during our adventures across Morocco. From mountain peaks to desert dunes, witness the beauty through our community's lens.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input 
                    type="text"
                    placeholder="Search photos..."
                    className="pl-10 pr-4 py-2 border rounded-button font-body w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground font-body">
                {filteredItems.length} items found
              </div>
            </div>
            
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full lg:w-auto lg:flex" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="font-body">
                    {category.name} ({category.count})
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
              {filteredItems.map((item, index) => (
                <Card 
                  key={item.id}
                  className={`group cursor-pointer hover:shadow-glow transition-all duration-300 overflow-hidden ${getMasonryItemClass(index)}`}
                  onClick={() => setLightboxImage(item)}
                >
                  <div className="relative h-full">
                    <img 
                      src={item.url} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-semibold font-heading mb-1">{item.title}</h3>
                      <div className="flex items-center gap-2 text-xs opacity-90 mb-2">
                        {item.location && (
                          <>
                            <MapPin className="w-3 h-3" />
                            <span className="font-body">{item.location}</span>
                          </>
                        )}
                        {item.photographer && (
                          <>
                            <span>•</span>
                            <User className="w-3 h-3" />
                            <span className="font-body">{item.photographer}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span className="text-xs font-body">{item.likes ?? 0}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-white hover:bg-white/20">
                            <Share2 className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-white hover:bg-white/20">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {featuredVideos.length > 0 && (
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Featured Videos</h2>
                <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
                  Watch our most popular adventure videos and get inspired for your next journey
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredVideos.map((video) => (
                  <Card key={video.id} className="group hover:shadow-elegant transition-all duration-300">
                    <div className="relative">
                      <img 
                        src={video.thumbnail ?? video.url} 
                        alt={video.title}
                        className="w-full h-48 object-cover rounded-t-card"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button className="w-16 h-16 rounded-full bg-secondary hover:bg-secondary/90 group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-8 h-8 ml-1" />
                        </Button>
                      </div>
                      <Badge className="absolute top-3 right-3 bg-primary text-white">
                        Video
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold font-heading mb-2">{video.title}</h3>
                      {video.description && (
                        <p className="text-sm text-muted-foreground font-body mb-3">{video.description}</p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        {video.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="font-body">{video.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span className="font-body">{video.likes ?? 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Share Your Adventure</h2>
            <p className="text-xl text-primary-foreground/80 font-body mb-8 max-w-2xl mx-auto">
              Upload your photos and videos to inspire fellow adventurers and build our community gallery
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="border-2 border-dashed border-primary-foreground/30 rounded-card p-8 hover:border-primary-foreground/50 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-primary-foreground/70" />
                <p className="font-body text-primary-foreground/80 mb-4">
                  Drag and drop your files here, or click to browse
                </p>
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  Choose Files
                </Button>
              </div>
              <p className="text-xs text-primary-foreground/60 mt-4 font-body">
                Supported formats: JPG, PNG, MP4, MOV. Max file size: 50MB
              </p>
            </div>
          </div>
        </section>

        {lightboxImage && (
          <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
            <DialogContent className="max-w-4xl p-0 bg-black">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                  onClick={() => setLightboxImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
                
                <img 
                  src={lightboxImage.url} 
                  alt={lightboxImage.title}
                  className="w-full max-h-[80vh] object-contain"
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  <h3 className="text-xl font-semibold font-heading mb-2">{lightboxImage.title}</h3>
                  {lightboxImage.description && (
                    <p className="font-body mb-4">{lightboxImage.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      {lightboxImage.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="font-body">{lightboxImage.location}</span>
                        </div>
                      )}
                      {lightboxImage.date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className="font-body">{new Date(lightboxImage.date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {lightboxImage.photographer && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span className="font-body">{lightboxImage.photographer}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Heart className="w-4 h-4 mr-1" />
                        {lightboxImage.likes ?? 0}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {lightboxImage.tags && lightboxImage.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {lightboxImage.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Gallery;
