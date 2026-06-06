import SEOHead from "@/components/SEOHead";
import { routeSEO } from "@/lib/seo.config";
import Header from "@/components/Header";
import HeaderSpacer from "@/components/HeaderSpacer";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import EventsActivitiesCalendar from "@/components/EventsActivitiesCalendar";

const EventsActivities = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...routeSEO["/events"]} />
      <Header forceOpaque />
      <HeaderSpacer />
      <Breadcrumbs items={[{ label: 'Events & Activities' }]} />

      <EventsActivitiesCalendar />

      <Footer />
    </div>
  );
};

export default EventsActivities;
