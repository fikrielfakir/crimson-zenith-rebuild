import { useState, useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { routeSEO } from "@/lib/seo.config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  Star,
  Search,
  ArrowRight,
  Award,
  Building2,
  Filter,
  X,
  LayoutGrid,
  Map,
} from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";
import { useCmsTranslations } from "@/hooks/useCmsTranslations";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Club {
  id: number;
  name: string;
  slug: string;
  description: string;
  location: string;
  member_count: number | null;
  rating: number | null;
  image: string | null;
  features: string[] | null;
  established: string | null;
  is_featured?: boolean;
  latitude?: number | null;
  longitude?: number | null;
}

interface ClubsPageSettings {
  introHeading?: string;
  introDescription?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
}

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80";

const SATELLITE_STYLE: any = {
  version: 8,
  name: "Satellite",
  sources: {
    satellite: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "© Esri",
      maxzoom: 18,
    },
    labels: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      maxzoom: 18,
    },
  },
  layers: [
    { id: "satellite-layer", type: "raster", source: "satellite", minzoom: 0, maxzoom: 18 },
    { id: "labels-layer", type: "raster", source: "labels", minzoom: 0, maxzoom: 18, paint: { "raster-opacity": 0.7 } },
  ],
};

function ClubCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-card border border-border animate-pulse">
      <div className="h-52 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-muted rounded w-2/3" />
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="flex gap-2 pt-1">
          <div className="h-6 bg-muted rounded-full w-16" />
          <div className="h-6 bg-muted rounded-full w-20" />
        </div>
        <div className="h-10 bg-muted rounded-xl w-full mt-2" />
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}

function ClubCard({ club }: { club: Club }) {
  const tags = Array.isArray(club.features)
    ? club.features.map((f: any) => (typeof f === "string" ? f : f?.text ?? "")).filter(Boolean)
    : [];
  const slug = club.slug || club.name.toLowerCase().replace(/\s+/g, "-");
  const imgSrc = club.image && club.image.trim() ? club.image : PLACEHOLDER;

  return (
    <Link
      to={`/club/${encodeURIComponent(slug)}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative h-52 overflow-hidden bg-muted flex-shrink-0">
        <img
          src={imgSrc}
          alt={club.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {club.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold shadow">
              <Award className="w-3 h-3" /> Featured
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm font-medium drop-shadow">
          <MapPin className="w-4 h-4 text-primary" />
          {club.location}
        </div>
        {club.member_count != null && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white text-sm font-medium drop-shadow">
            <Users className="w-4 h-4 text-primary" />
            {club.member_count.toLocaleString()}
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {club.name}
          </h3>
          {club.rating != null && club.rating > 0 && <StarRating rating={club.rating} />}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {club.description || "A journey club bringing people together through adventure and culture."}
        </p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-2.5 py-0.5 rounded-full font-medium">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2.5 py-0.5 rounded-full">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        <Button
          size="sm"
          className="mt-auto w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold shadow transition-all duration-200 group/btn"
        >
          Explore Club
          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
        </Button>
      </div>
    </Link>
  );
}

function ClubsMap({ clubs }: { clubs: Club[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: SATELLITE_STYLE,
      center: [-6.8498, 33.9716],
      zoom: 5,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    return () => {
      markers.current.forEach(m => m.remove());
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    markers.current.forEach(m => m.remove());
    markers.current = [];

    const mapClubs = clubs.filter(c => c.latitude != null && c.longitude != null);

    mapClubs.forEach(club => {
      const el = document.createElement("div");
      el.className = "club-map-marker";
      el.style.cssText = `
        width:42px; height:42px; border-radius:50%;
        background: radial-gradient(circle at 35% 35%, #2ec4b6, #1a9b8e);
        border:3px solid white; box-shadow:0 2px 8px rgba(0,0,0,0.4);
        cursor:pointer; display:flex; align-items:center; justify-content:center;
        font-weight:700; color:white; font-size:13px; font-family:sans-serif;
        transition: transform 0.2s;
      `;
      el.textContent = club.name.charAt(0).toUpperCase();
      el.addEventListener("mouseenter", () => { el.style.transform = "scale(1.2)"; });
      el.addEventListener("mouseleave", () => { el.style.transform = "scale(1)"; });

      const slug = club.slug || club.name.toLowerCase().replace(/\s+/g, "-");
      const popupHtml = `
        <div style="min-width:180px; padding:4px 0">
          <div style="font-weight:700; font-size:15px; margin-bottom:6px; color:#1a9b8e">${club.name}</div>
          <div style="display:flex; align-items:center; gap:4px; color:#666; font-size:13px; margin-bottom:4px">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            ${club.location}
          </div>
          ${club.member_count ? `<div style="display:flex; align-items:center; gap:4px; color:#666; font-size:13px; margin-bottom:8px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>${club.member_count.toLocaleString()} members</div>` : ""}
          <a href="/club/${encodeURIComponent(slug)}" style="display:inline-block; background:#1a9b8e; color:white; padding:5px 14px; border-radius:20px; font-size:12px; font-weight:600; text-decoration:none">View Club →</a>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 25, closeButton: true, maxWidth: "220px" })
        .setHTML(popupHtml);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([club.longitude!, club.latitude!])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);
    });

    if (mapClubs.length > 0 && map.current) {
      const bounds = new maplibregl.LngLatBounds();
      mapClubs.forEach(c => bounds.extend([c.longitude!, c.latitude!]));
      map.current.fitBounds(bounds, { padding: 80, maxZoom: 10, duration: 800 });
    }
  }, [clubs]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border shadow-lg" style={{ height: "600px" }}>
      <div ref={mapContainer} className="w-full h-full" />
      {clubs.filter(c => c.latitude != null && c.longitude != null).length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 backdrop-blur-sm rounded-2xl">
          <Map className="w-16 h-16 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-medium">No map coordinates available</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Add latitude & longitude to clubs in the admin panel</p>
        </div>
      )}
    </div>
  );
}

const Clubs = () => {
  const [scrollY, setScrollY] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedFeature, setSelectedFeature] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: rawData, isLoading, isError } = useQuery({
    queryKey: ["clubs-page"],
    queryFn: async () => {
      const res = await apiFetch("/api/clubs");
      if (!res.ok) throw new Error("Failed to fetch clubs");
      return res.json();
    },
  });

  const { data: pageSettings } = useQuery<ClubsPageSettings>({
    queryKey: ["clubs-page-settings-public"],
    queryFn: async () => {
      try {
        const res = await apiFetch("/api/cms/clubs-page");
        if (!res.ok) return {};
        return res.json();
      } catch { return {}; }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const tr = useCmsTranslations("clubs-page");

  const introHeading = tr("2", "intro_heading", pageSettings?.introHeading ?? "Join a Community of Adventurers");
  const introDescription = tr("2", "intro_description", pageSettings?.introDescription ?? "From the Atlantic to the Sahara, our clubs connect passionate explorers across Morocco's most iconic destinations.");
  const ctaHeading = tr("3", "cta_heading", pageSettings?.ctaHeading ?? "Start your own club");
  const ctaDescription = tr("3", "cta_description", pageSettings?.ctaDescription ?? "Passionate about a region or activity? Create a club and build your community of adventurers.");
  const ctaButtonText = tr("3", "cta_button_text", pageSettings?.ctaButtonText ?? "Get Started");

  const clubs: Club[] = useMemo(() => {
    const list = Array.isArray(rawData) ? rawData : rawData?.clubs ?? rawData?.data ?? [];
    return list.filter((c: any) => c.is_active !== false);
  }, [rawData]);

  const cities = useMemo(() => {
    const set = new Set(clubs.map((c) => c.location).filter(Boolean));
    return Array.from(set).sort();
  }, [clubs]);

  const allFeatures = useMemo(() => {
    const set = new Set<string>();
    clubs.forEach((c) => {
      (c.features ?? []).forEach((f: any) => {
        const label = typeof f === "string" ? f : f?.text ?? "";
        if (label) set.add(label);
      });
    });
    return Array.from(set).sort();
  }, [clubs]);

  const filtered = useMemo(() => {
    return clubs.filter((c) => {
      const matchSearch =
        search.trim() === "" ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.description ?? "").toLowerCase().includes(search.toLowerCase());
      const matchCity = selectedCity === "all" || c.location === selectedCity;
      const matchFeature =
        selectedFeature === "all" ||
        (c.features ?? []).some((f: any) => {
          const label = typeof f === "string" ? f : f?.text ?? "";
          return label === selectedFeature;
        });
      return matchSearch && matchCity && matchFeature;
    });
  }, [clubs, search, selectedCity, selectedFeature]);

  const totalMembers = useMemo(() => clubs.reduce((sum, c) => sum + (c.member_count ?? 0), 0), [clubs]);
  const hasFilters = search.trim() !== "" || selectedCity !== "all" || selectedFeature !== "all";

  const clearFilters = () => {
    setSearch("");
    setSelectedCity("all");
    setSelectedFeature("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...routeSEO["/clubs"]} />
      <Header />

      <main>
        <PageHero
          pageKey="clubs"
          scrollY={scrollY}
          breadcrumbs={[{ label: "Clubs" }]}
          defaultTitle="Our Adventure Clubs"
          defaultSubtitle="Join passionate communities across Morocco's most iconic destinations — from the Atlas to the Atlantic."
        />

        {/* Stats bar */}
        {!isLoading && clubs.length > 0 && (
          <section className="bg-primary text-white py-6">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-3 divide-x divide-white/20 text-center">
                <div className="px-4">
                  <div className="text-2xl md:text-3xl font-bold">{clubs.length}</div>
                  <div className="text-xs md:text-sm text-white/75 mt-0.5 flex items-center justify-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> Active Clubs
                  </div>
                </div>
                <div className="px-4">
                  <div className="text-2xl md:text-3xl font-bold">
                    {totalMembers > 0 ? totalMembers.toLocaleString() : "—"}
                  </div>
                  <div className="text-xs md:text-sm text-white/75 mt-0.5 flex items-center justify-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Members
                  </div>
                </div>
                <div className="px-4">
                  <div className="text-2xl md:text-3xl font-bold">{cities.length}</div>
                  <div className="text-xs md:text-sm text-white/75 mt-0.5 flex items-center justify-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Cities
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Intro section (CMS-driven) */}
        {(introHeading || introDescription) && (
          <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-6 max-w-3xl text-center">
              {introHeading && (
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{introHeading}</h2>
              )}
              {introDescription && (
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{introDescription}</p>
              )}
            </div>
          </section>
        )}

        {/* Search, Filters & View Toggle */}
        <section className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search clubs by name or description…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 rounded-xl bg-muted/50 border-border focus:bg-background"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="h-10 rounded-xl border border-border bg-muted/50 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors cursor-pointer"
                >
                  <option value="all">All cities</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {allFeatures.length > 0 && (
                <div className="shrink-0">
                  <select
                    value={selectedFeature}
                    onChange={(e) => setSelectedFeature(e.target.value)}
                    className="h-10 rounded-xl border border-border bg-muted/50 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors cursor-pointer"
                  >
                    <option value="all">All activities</option>
                    {allFeatures.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              )}

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0 px-2"
                >
                  <X className="w-4 h-4" /> Clear
                </button>
              )}

              {/* View toggle */}
              <div className="flex items-center gap-1 bg-muted rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === "map"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Map className="w-4 h-4" />
                  <span className="hidden sm:inline">Map</span>
                </button>
              </div>
            </div>

            {!isLoading && (
              <p className="mt-2 text-xs text-muted-foreground">
                {hasFilters
                  ? `${filtered.length} of ${clubs.length} clubs`
                  : `${clubs.length} club${clubs.length !== 1 ? "s" : ""} across Morocco`}
              </p>
            )}
          </div>
        </section>

        {/* Content: Grid or Map */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-6">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <ClubCardSkeleton key={i} />)}
              </div>
            ) : isError ? (
              <div className="text-center py-24">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Unable to load clubs</h3>
                <p className="text-muted-foreground mb-6">Please check your connection and try again.</p>
                <Button onClick={() => window.location.reload()} className="rounded-xl">Retry</Button>
              </div>
            ) : viewMode === "map" ? (
              <ClubsMap clubs={filtered} />
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No clubs found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filters.</p>
                <Button variant="outline" onClick={clearFilters} className="rounded-xl gap-2">
                  <X className="w-4 h-4" /> Clear filters
                </Button>
              </div>
            ) : (
              <>
                {filtered.some((c) => c.is_featured) && (
                  <div className="mb-10">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-primary mb-5 flex items-center gap-2">
                      <Award className="w-4 h-4" /> Featured
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filtered.filter((c) => c.is_featured).map((club) => (
                        <ClubCard key={club.id} club={club} />
                      ))}
                    </div>
                    {filtered.some((c) => !c.is_featured) && (
                      <div className="mt-10 mb-5 border-t border-border pt-8">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Building2 className="w-4 h-4" /> All Clubs
                        </h2>
                      </div>
                    )}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.filter((c) => !c.is_featured).map((club) => (
                    <ClubCard key={club.id} club={club} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA Banner */}
        {!isLoading && !isError && (
          <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: "36px 36px",
              }}
            />
            <div className="container mx-auto px-6 relative z-10 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow">{ctaHeading}</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto leading-relaxed">{ctaDescription}</p>
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-bold rounded-full px-10 shadow-xl transition-all duration-300"
              >
                <Link to={pageSettings?.ctaButtonLink ?? "/join-us"}>
                  {ctaButtonText}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Clubs;
