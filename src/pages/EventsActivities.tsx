import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import EventsActivitiesCalendar from "@/components/EventsActivitiesCalendar";

const EventsActivities = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <Breadcrumbs items={[{ label: 'Events & Activities' }]} />

      <EventsActivitiesCalendar />

      <Footer />
    </div>
  );
};

export default EventsActivities;
