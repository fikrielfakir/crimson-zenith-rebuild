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
import { Skeleton } from "@/components/ui/skeleton";

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

const LandingPageSkeleton = () => (
  <div className="min-h-screen bg-primary animate-pulse">
    <div className="h-16 bg-white/5 border-b border-white/10" />
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-6">
      <Skeleton className="h-16 w-3/4 max-w-lg bg-white/10" />
      <Skeleton className="h-12 w-1/2 max-w-md bg-white/10" />
      <Skeleton className="h-5 w-full max-w-xl bg-white/10" />
      <Skeleton className="h-5 w-4/5 max-w-lg bg-white/10" />
      <div className="flex gap-4 mt-4">
        <Skeleton className="h-12 w-44 rounded-full bg-white/10" />
        <Skeleton className="h-12 w-36 rounded-full bg-white/10" />
      </div>
    </div>
  </div>
);

const Index = () => {
  const location = useLocation();
  const { isLoading, isError } = useApiHealth();

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    }
  }, [location.hash]);

  if (isLoading) {
    return <LandingPageSkeleton />;
  }

  if (isError) {
    return <LandingApiError />;
  }

  return (
    <div className="min-h-screen">
      <SEOHead {...routeSEO["/"]} />
      <Header />
      <Hero />
      <PresidentMessageDynamic />
      <About />
      <ClubsWithMap />
      <EventsActivitiesCalendar />
      <Stats />
      <Testimonials />
      <OurPartners />
      <Contact />
      <Footer />
      <BottomNavbar />
    </div>
  );
};

export default Index;
