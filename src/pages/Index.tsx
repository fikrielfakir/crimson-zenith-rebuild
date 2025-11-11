import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import OurPartners from "@/components/OurPartners";
import PresidentMessage from "@/components/PresidentMessage";
import EventCalendar from "@/components/EventCalendar";
import ClubsWithMap from "@/components/ClubsWithMap";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BottomNavbar from "@/components/BottomNavbar";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.substring(1); // Remove the '#'
      const element = document.getElementById(sectionId);
      if (element) {
        // Use requestAnimationFrame to ensure DOM is fully rendered
        requestAnimationFrame(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        });
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <PresidentMessage />
      <About />
      <ClubsWithMap />
      <EventCalendar />
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
