import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SmartEventCalendar from "@/components/SmartEventCalendar";

const SmartEvents = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: 'Events', href: '/events' },
        { label: 'Smart Calendar' }
      ]} />

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Smart Events Calendar
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the perfect events for you with our AI-powered calendar. 
            Get personalized recommendations, smart filtering, and intelligent insights.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <SmartEventCalendar />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SmartEvents;