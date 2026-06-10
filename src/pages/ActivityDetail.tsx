import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  MapPin,
  Calendar,
  Shield,
  Camera,
  Heart,
  Share2,
  Home,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

/* ── Normalised shape used by the UI ──────────────────────────────── */
interface ActivityData {
  id: number | string;
  title: string;
  description: string;
  longDescription: string;
  images: string[];
  duration: string;
  difficulty: string;
  groupSize: string;
  rating: number;
  price: number | null;
  location: string;
  bestTime: string;
  included: string[];
  notIncluded: string[];
  itinerary: { day: number; title: string; description: string }[];
}

/* ── Static fallback data (slug-keyed) ───────────────────────────── */
const STATIC_ACTIVITIES: Record<string, ActivityData> = {
  "atlas-mountains": {
    id: "atlas-mountains",
    title: "Atlas Mountains Trek",
    description: "Experience breathtaking views and traditional Berber culture in Morocco's highest peaks",
    longDescription: "Embark on an unforgettable journey through the High Atlas Mountains, where snow-capped peaks meet traditional Berber villages. This multi-day trek offers spectacular panoramic views, encounters with local communities, and a chance to witness Morocco's stunning natural beauty from its highest vantage points.",
    images: ["/api/placeholder/800/400?type=event", "/api/placeholder/800/400?type=event", "/api/placeholder/800/400?type=event", "/api/placeholder/800/400?type=event"],
    duration: "3 days", difficulty: "Moderate", groupSize: "8-12 people", rating: 4.8, price: 299,
    location: "High Atlas Mountains, Morocco", bestTime: "April - October",
    included: ["Professional mountain guide", "All meals during trek", "Camping equipment", "Transport to/from trailhead", "Traditional Berber village visit"],
    notIncluded: ["Personal hiking equipment", "Travel insurance", "Tips for guides"],
    itinerary: [
      { day: 1, title: "Arrival & Base Camp Setup", description: "Meet your guide, equipment check, and hike to base camp at 2,800m altitude." },
      { day: 2, title: "Summit Attempt & Village Visit", description: "Early morning summit push to 4,167m, afternoon visit to traditional Berber village." },
      { day: 3, title: "Return Journey", description: "Descent through cedar forests and return to Marrakech." },
    ],
  },
  "sahara-desert": {
    id: "sahara-desert",
    title: "Sahara Desert Adventure",
    description: "Camel trekking and camping under the stars in the world's largest hot desert",
    longDescription: "Discover the magic of the Sahara Desert on this incredible adventure. Travel by camel across golden dunes, experience traditional nomadic culture, and spend nights under some of the clearest starry skies on Earth.",
    images: ["/api/placeholder/800/400?type=event", "/api/placeholder/800/400?type=event", "/api/placeholder/800/400?type=event", "/api/placeholder/800/400?type=event"],
    duration: "2 days", difficulty: "Easy", groupSize: "6-10 people", rating: 4.9, price: 189,
    location: "Merzouga, Erg Chebbi Dunes", bestTime: "October - April",
    included: ["Camel trekking experience", "Desert camp accommodation", "Traditional Berber dinner", "Sunrise/sunset viewing", "Professional guide"],
    notIncluded: ["Transport to Merzouga", "Lunch on day 1", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Desert Entry & Sunset", description: "Arrive in Merzouga, camel trek into dunes, watch sunset, traditional dinner and overnight in desert camp." },
      { day: 2, title: "Sunrise & Return", description: "Early morning sunrise viewing, camel trek back, traditional breakfast." },
    ],
  },
  "atlantique": {
    id: "atlantique",
    title: "Coastal Surfing Experience",
    description: "Learn to surf on Morocco's pristine Atlantic coastline with expert instructors",
    longDescription: "Experience the thrill of surfing on Morocco's stunning Atlantic coast. Our expert instructors will guide you through the basics or help improve your technique on some of the world's most consistent waves.",
    images: ["/api/placeholder/800/400?type=event", "/api/placeholder/800/400?type=event", "/api/placeholder/800/400?type=event", "/api/placeholder/800/400?type=event"],
    duration: "1 day", difficulty: "Beginner", groupSize: "4-8 people", rating: 4.6, price: 89,
    location: "Taghazout, Atlantic Coast", bestTime: "Year-round",
    included: ["Professional surf instructor", "Surfboard rental", "Wetsuit rental", "Beach safety briefing", "Light lunch"],
    notIncluded: ["Transport to Taghazout", "Personal surf equipment", "Accommodation"],
    itinerary: [
      { day: 1, title: "Surf Lesson & Practice", description: "Morning theory session, practical surf lesson, lunch break, afternoon practice session with personalized feedback." },
    ],
  },
};

/* ── Helpers ─────────────────────────────────────────────────────── */
function toSlug(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function splitLines(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  return String(val).split(/\n|•|;/).map((s) => s.trim()).filter(Boolean);
}

function detectDifficulty(category = '', title = ''): string {
  const t = `${category} ${title}`.toLowerCase();
  if (t.includes('easy') || t.includes('beginner') || t.includes('cultural') || t.includes('photo')) return 'Easy';
  if (t.includes('hard') || t.includes('expert') || t.includes('advanced') || t.includes('climb')) return 'Hard';
  return 'Moderate';
}

function mapApiToActivity(e: any): ActivityData {
  const imgs: string[] = [];
  if (e.image) imgs.push(e.image);
  if (Array.isArray(e.images)) imgs.push(...e.images.filter((i: any) => i && i !== e.image));
  if (imgs.length === 0) imgs.push('/api/placeholder/800/400?type=event');

  const included = splitLines(e.included ?? e.highlights);
  const notIncluded = splitLines(e.notIncluded ?? e.not_included);

  const itinerary: ActivityData['itinerary'] = [];
  if (e.importantInfo) {
    itinerary.push({ day: 1, title: 'Important Information', description: e.importantInfo });
  }
  if (e.locationDetails) {
    itinerary.push({ day: itinerary.length + 1, title: 'Location Details', description: e.locationDetails });
  }

  return {
    id: e.id,
    title: e.title ?? 'Event',
    description: e.subtitle ?? e.description ?? '',
    longDescription: e.description ?? '',
    images: imgs.slice(0, 4),
    duration: e.duration ?? 'Full day',
    difficulty: detectDifficulty(e.category, e.title),
    groupSize: e.groupSize ?? (e.maxParticipants ? `Up to ${e.maxParticipants} people` : 'Small group'),
    rating: e.rating ?? 4.7,
    price: e.price ?? e.originalPrice ?? null,
    location: e.location ?? '',
    bestTime: 'All year',
    included,
    notIncluded,
    itinerary: itinerary.length ? itinerary : [{ day: 1, title: 'Full Experience', description: e.description ?? '' }],
  };
}

/* ── Component ───────────────────────────────────────────────────── */
const ActivityDetail = () => {
  const { t } = useTranslation();
  const { activityName } = useParams();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [AutoScroll({ playOnInit: true, speed: 1 })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  /* Scroll / visibility effects */
  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  /* Data fetching: try API, then fall back to static */
  useEffect(() => {
    if (!activityName) { setIsLoading(false); return; }

    const load = async () => {
      try {
        /* 1. If activityName looks like a numeric id, try fetching by id */
        if (/^\d+$/.test(activityName)) {
          const res = await fetch(`/api/booking/events/${activityName}`);
          if (res.ok) {
            const data = await res.json();
            const raw = data.event ?? data;
            if (raw?.id) { setActivity(mapApiToActivity(raw)); return; }
          }
        }

        /* 2. Fetch all events and find a title-slug match */
        const res = await fetch('/api/booking/events');
        if (res.ok) {
          const data = await res.json();
          const events: any[] = data.events ?? data.data ?? [];
          const match = events.find((e) => {
            const slug = toSlug(e.title ?? '');
            return slug === activityName || String(e.id) === activityName;
          });
          if (match) { setActivity(mapApiToActivity(match)); return; }
        }
      } catch {
        // fall through
      }

      /* 3. Static fallback */
      const staticData = STATIC_ACTIVITIES[activityName];
      if (staticData) { setActivity(staticData); return; }

      setActivity(null);
    };

    load().finally(() => setIsLoading(false));
  }, [activityName]);

  /* Carousel navigation */
  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const getDifficultyColor = (d: string) => {
    switch (d) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 space-y-6 max-w-4xl">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Not found ── */
  if (!activity) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">{t('common.activityNotFound', 'Activity Not Found')}</h1>
          <p className="text-muted-foreground mb-8">{t('common.activityNotFoundDesc', "The activity you're looking for doesn't exist.")}</p>
          <Button onClick={() => navigate('/discover')}>{t('common.browseAllActivities')}</Button>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Main render ── */
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="relative">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden" style={{ paddingTop: '15rem' }}>
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'hsl(var(--primary))', transform: `translateY(${scrollY * 0.3}px)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
              backgroundSize: '50px 50px, 80px 80px',
              transform: `translateY(${scrollY * 0.1}px)`,
            }}
          />

          <div className="relative container mx-auto px-6">
            {/* Breadcrumb */}
            <nav className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link to="/" className="flex items-center text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40">
                    <Home className="w-4 h-4 mr-1.5" />Home
                  </Link>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-2 text-white/50" />
                  <Link to="/discover" className="text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40">
                    Activities
                  </Link>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-2 text-white/50" />
                  <span className="text-white font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 shadow-lg">
                    {activity.title}
                  </span>
                </li>
              </ol>
            </nav>

            {/* Heading */}
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} mb-8`}>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
                {activity.title}
              </h1>
              <p className="text-base md:text-xl text-white/95 max-w-2xl leading-relaxed drop-shadow-lg">
                {activity.description}
              </p>
            </div>

            {/* Image carousel */}
            <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="relative max-w-5xl mx-auto">
                <div className="overflow-hidden rounded-xl shadow-2xl" ref={emblaRef}>
                  <div className="flex">
                    {activity.images.map((image, index) => (
                      <div key={index} className="flex-[0_0_100%] min-w-0">
                        <div className="relative aspect-[16/9]">
                          <img
                            src={image}
                            alt={`${activity.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/api/placeholder/800/400?type=event'; }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={scrollPrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110" aria-label="Previous image">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={scrollNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110" aria-label="Next image">
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="flex justify-center gap-2 mt-4">
                  {activity.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => emblaApi?.scrollTo(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'}`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left column */}
            <div className="lg:col-span-2">
              {/* Thumbnail grid */}
              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activity.images.map((image, index) => (
                    <div key={index} className="relative overflow-hidden rounded-lg aspect-video">
                      <img
                        src={image}
                        alt={`${activity.title} ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/api/placeholder/800/400?type=event'; }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <div className="overflow-x-auto">
                  <TabsList className="grid w-full grid-cols-3 min-w-[280px]">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                    <TabsTrigger value="included">What's Included</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">About This Experience</h3>
                    <p className="text-muted-foreground leading-relaxed">{activity.longDescription}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {activity.location && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center"><MapPin className="w-4 h-4 mr-2" />Location</h4>
                        <p className="text-muted-foreground">{activity.location}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center"><Calendar className="w-4 h-4 mr-2" />Best Time to Visit</h4>
                      <p className="text-muted-foreground">{activity.bestTime}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="space-y-4">
                  <h3 className="text-2xl font-bold mb-4">Day by Day Itinerary</h3>
                  {activity.itinerary.map((item, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">Day {item.day}: {item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="included" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {activity.included.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-4 text-green-700 flex items-center"><Shield className="w-4 h-4 mr-2" />What's Included</h4>
                        <ul className="space-y-2">
                          {activity.included.map((item, index) => (
                            <li key={index} className="flex items-center text-sm">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-3 shrink-0" />{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {activity.notIncluded.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-4 text-red-700">Not Included</h4>
                        <ul className="space-y-2">
                          {activity.notIncluded.map((item, index) => (
                            <li key={index} className="flex items-center text-sm">
                              <span className="w-2 h-2 bg-red-500 rounded-full mr-3 shrink-0" />{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {activity.included.length === 0 && activity.notIncluded.length === 0 && (
                      <p className="text-muted-foreground col-span-2">Contact us for details on what's included.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold text-primary">
                        {activity.price != null ? `$${activity.price}` : 'Contact us'}
                      </CardTitle>
                      <p className="text-muted-foreground">per person</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsBookmarked(!isBookmarked)}>
                        <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current text-red-500' : ''}`} />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <div className="flex items-center"><Clock className="w-4 h-4 mr-1" /><span className="text-sm font-medium">{activity.duration}</span></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Group Size</span>
                      <div className="flex items-center"><Users className="w-4 h-4 mr-1" /><span className="text-sm font-medium">{activity.groupSize}</span></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Difficulty</span>
                      <Badge className={getDifficultyColor(activity.difficulty)}>{activity.difficulty}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Rating</span>
                      <div className="flex items-center"><Star className="w-4 h-4 text-yellow-400 fill-current mr-1" /><span className="text-sm font-medium">{activity.rating}</span></div>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <Link to={`/book?event=${encodeURIComponent(String(activity.id))}`}>
                      <Button className="w-full" size="lg">
                        Book Now{activity.price != null ? ` — $${activity.price}` : ''}
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" size="lg">
                      <Camera className="w-4 h-4 mr-2" />{t('common.viewPhotos', 'View Photos')}
                    </Button>
                    <Link to="/contact">
                      <Button variant="outline" className="w-full" size="lg">{t('common.askQuestions')}</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />Back to Activities
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ActivityDetail;
