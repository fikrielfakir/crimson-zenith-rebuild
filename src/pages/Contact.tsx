import { useState, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { routeSEO } from "@/lib/seo.config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import PageHero from "@/components/PageHero";

const ContactPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...routeSEO["/contact"]} />
      <Header />
      <main className="relative">
        <PageHero
          pageKey="contact"
          scrollY={scrollY}
          breadcrumbs={[{ label: "Contact" }]}
          defaultTitle="Contact Us"
          defaultSubtitle="Have questions about your next adventure? Our friendly team is here to help you plan the perfect Moroccan experience. Get in touch with us today."
          defaultImage="/attached_assets/generated_images/Essaouira_coastal_fortifications_07abbfb6.png"
        />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
