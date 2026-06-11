import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/SEOHead";
import { routeSEO } from "@/lib/seo.config";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import OurPartners from "@/components/OurPartners";
import PresidentMessageDynamic from "@/components/PresidentMessageDynamic";
import EventsActivitiesCalendar from "@/components/EventsActivitiesCalendar";
import ClubsWithMap from "@/components/ClubsWithMap";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BottomNavbar from "@/components/BottomNavbar";
import LandingApiError from "@/components/LandingApiError";
const heroBackground = "https://api.thejourney-ma.org/attached_assets/hero-bg.jpg";

interface LandingSection {
  sectionKey: string;
  isEnabled: boolean;
}

function useApiHealth() {
  return useQuery({
    queryKey: ["__api_health__"],
    queryFn: async () => {
      const res = await fetch("/api/cms/hero", {
        cache: "no-store",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`API responded with ${res.status}`);
      return true;
    },
    staleTime: 0,
    gcTime: 0,
    retry: 0,
    refetchOnWindowFocus: false,
  });
}

function useLandingSections() {
  return useQuery<LandingSection[]>({
    queryKey: ["landing-sections"],
    queryFn: async () => {
      const res = await fetch("/api/cms/landing-sections", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 30_000,
    retry: 0,
    refetchOnWindowFocus: false,
  });
}

const LandingPageSkeleton = () => (
  <section
    className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans"
    style={{ background: "linear-gradient(180deg,#0d1b42 0%,#112250 60%,#152d6e 100%)" }}
  >
    {/* Blurred hero photo — same src as the real hero, so no visual pop */}
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 blur-sm scale-105"
      style={{ backgroundImage: `url(${heroBackground})` }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/60 to-primary/80" />

    {/* Navbar ghost */}
    <div className="absolute top-0 left-0 right-0 h-20 z-20 flex items-center justify-center px-8">
      <div className="h-10 w-36 rounded-md bg-white/10 animate-pulse" style={{ animationDuration: "1.6s" }} />
    </div>

    {/* Hero content skeleton — mirrors the fixed-layout structure exactly */}
    <div
      className="relative z-10 text-center px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full flex flex-col items-center"
      style={{ marginTop: "3rem" }}
    >
      {/* 180px fixed-height title zone */}
      <div className="w-full flex items-center justify-center" style={{ height: 180 }}>
        <div className="w-full flex flex-col items-center gap-4">
          <div className="h-14 rounded-lg bg-white/15 animate-pulse" style={{ width: "62%", animationDuration: "1.4s" }} />
          <div className="h-14 rounded-lg bg-white/10 animate-pulse" style={{ width: "48%", animationDuration: "1.6s" }} />
        </div>
      </div>

      {/* Subtitle */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-3" style={{ marginTop: "1.5rem" }}>
        <div className="h-5 rounded-md bg-white/12 animate-pulse w-full" style={{ animationDuration: "1.5s" }} />
        <div className="h-5 rounded-md bg-white/10 animate-pulse" style={{ width: "80%", animationDuration: "1.7s" }} />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-5 justify-center items-center" style={{ marginTop: "2rem" }}>
        <div className="h-14 rounded-full bg-secondary/40 animate-pulse" style={{ width: 188, animationDuration: "1.4s" }} />
        <div className="h-14 rounded-full border-2 border-white/25 bg-white/8 animate-pulse" style={{ width: 160, animationDuration: "1.6s" }} />
      </div>
    </div>

    {/* Decorative bottom pattern — identical to real hero */}
    <div className="absolute bottom-0 left-0 right-0 w-full h-auto z-10 pointer-events-none opacity-70">
      <img src="https://api.thejourney-ma.org/attached_assets/pattern%20002_1762097803637.png" alt="" className="w-full h-auto object-cover" />
    </div>
  </section>
);

const Index = () => {
  const location = useLocation();
  const { isLoading, isError } = useApiHealth();
  const { data: sections } = useLandingSections();

  const isOn = (key: string) => {
    if (!sections || sections.length === 0) return true;
    const s = sections.find((s) => s.sectionKey === key);
    return s ? s.isEnabled : true;
  };

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }
  }, [location.hash]);

  if (isLoading) return <LandingPageSkeleton />;
  if (isError) return <LandingApiError />;

  return (
    <div className="min-h-screen">
      <SEOHead {...routeSEO["/"]} />
      <Header />
      {isOn("hero") && <Hero />}
      {isOn("president_message") && <PresidentMessageDynamic />}
      {isOn("about") && <About />}
      {isOn("clubs_map") && <ClubsWithMap />}
      {isOn("events_calendar") && <EventsActivitiesCalendar />}
      {isOn("stats") && <Stats />}
      {isOn("testimonials") && <Testimonials />}
      {isOn("partners") && <OurPartners />}
      {isOn("contact") && <Contact />}
      <Footer />
      <BottomNavbar />
    </div>
  );
};

export default Index;
