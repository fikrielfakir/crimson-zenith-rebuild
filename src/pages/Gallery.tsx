import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
  Tag
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<any>(null);

  // Mock gallery data
  const galleryItems = [
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

  const categories = [
    { id: "all", name: "All", count: galleryItems.length },
    { id: "mountain", name: "Mountains", count: galleryItems.filter(item => item.category === "mountain").length },
    { id: "desert", name: "Desert", count: galleryItems.filter(item => item.category === "desert").length },
    { id: "cultural", name: "Cultural", count: galleryItems.filter(item => item.category === "cultural").length },
    { id: "water", name: "Water", count: galleryItems.filter(item => item.category === "water").length },
    { id: "adventure", name: "Adventure", count: galleryItems.filter(item => item.category === "adventure").length }
  ];

  const filteredItems = selectedCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const featuredVideos = galleryItems.filter(item => item.type === "video");

  const openLightbox = (item: any) => {
    setLightboxImage(item);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const getMasonryItemClass = (index: number) => {
    const patterns = [
      "md:row-span-2", // Tall
      "md:col-span-2", // Wide
      "", // Regular
      "md:row-span-2", // Tall
      "", // Regular
      "md:col-span-2", // Wide
      "", // Regular
      "md:row-span-2" // Tall
    ];
    return patterns[index % patterns.length];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-6 gap-1 opacity-20">
          {galleryItems.slice(0, 18).map((item, index) => (
            <div key={index} className="relative overflow-hidden">
              <img 
                src={item.url} 
                alt=""
                className="w-full h-24 object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0" style={{ background: 'var(--gradient-overlay)' }} />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-heading">
            Adventure Memories
          </h1>
          <p className="text-xl text-white/90 mb-8 font-body max-w-2xl mx-auto">
            Explore stunning photography and videos from our community's incredible journeys across Morocco.
          </p>
          <Button className="bg-secondary hover:bg-secondary/90 text-lg px-8 py-3 h-auto">
            <Upload className="w-5 h-5 mr-2" />
            Share Your Photos
          </Button>
        </div>
      </section>

      {/* Filter Tabs */}
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
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:flex">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="font-body">
                  {category.name} ({category.count})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Main Gallery */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Masonry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {filteredItems.map((item, index) => (
              <Card 
                key={item.id}
                className={`group cursor-pointer hover:shadow-glow transition-all duration-300 overflow-hidden ${getMasonryItemClass(index)}`}
                onClick={() => openLightbox(item)}
              >
                <div className="relative h-full">
                  <img 
                    src={item.url} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Video Play Button */}
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold font-heading mb-1">{item.title}</h3>
                    <div className="flex items-center gap-2 text-xs opacity-90 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span className="font-body">{item.location}</span>
                      <span>•</span>
                      <User className="w-3 h-3" />
                      <span className="font-body">{item.photographer}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs font-body">{item.likes}</span>
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

      {/* Featured Videos */}
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
                    src={video.thumbnail} 
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
                  <p className="text-sm text-muted-foreground font-body mb-3">{video.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-body">{video.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span className="font-body">{video.likes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Section */}
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

      {/* Lightbox Modal */}
      {lightboxImage && (
        <Dialog open={!!lightboxImage} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-4xl p-0 bg-black">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={closeLightbox}
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
                <p className="font-body mb-4">{lightboxImage.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="font-body">{lightboxImage.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className="font-body">{new Date(lightboxImage.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="font-body">{lightboxImage.photographer}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Heart className="w-4 h-4 mr-1" />
                      {lightboxImage.likes}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {lightboxImage.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;