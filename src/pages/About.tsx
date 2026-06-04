import Header from "@/components/Header";
import HeaderSpacer from "@/components/HeaderSpacer";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Users, MapPin, Target, Heart } from "lucide-react";

const About = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Our Mission",
      desc: "To inspire youth and communities through meaningful adventure, cultural discovery, and personal growth across Morocco's diverse landscapes.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Our Community",
      desc: "A growing network of clubs, volunteers, and passionate explorers united by a love for Morocco's nature, history, and culture.",
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: "Our Reach",
      desc: "Operating across Morocco's major cities — from the Atlantic coast to the Sahara — with clubs in Rabat, Casablanca, Marrakech, Fes, and beyond.",
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Our Values",
      desc: "Respect for nature, inclusivity, cultural pride, and a commitment to making adventure accessible for every Moroccan.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header forceOpaque />
      <HeaderSpacer />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            About The Journey Association
          </h1>
          <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
            Morocco's leading network of adventure and cultural clubs, dedicated
            to inspiring youth through exploration, community, and purpose.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-heading text-foreground mb-4">
                Who We Are
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Journey Association (جمعية الرحلة) was founded with a simple
                belief: that every young Moroccan deserves the opportunity to
                discover their country, connect with its heritage, and grow
                through adventure.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We organize treks, cultural tours, sporting events, and community
                projects that bring people together across Morocco's cities,
                mountains, and deserts.
              </p>
              <Link
                to="/clubs"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Explore Our Clubs
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center h-64">
              <div className="text-center text-primary/40">
                <MapPin className="w-16 h-16 mx-auto mb-3" />
                <p className="font-medium text-primary/60">Morocco</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold font-heading text-foreground text-center mb-12">
            What Drives Us
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-background rounded-xl p-6 shadow-sm border border-border/50"
              >
                <div className="mb-4">{v.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-4">
            Ready to Join the Journey?
          </h2>
          <p className="text-muted-foreground mb-8">
            Become a member of one of our clubs and start exploring Morocco with
            like-minded adventurers.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/join"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Join Us
            </Link>
            <Link
              to="/contact"
              className="border border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
