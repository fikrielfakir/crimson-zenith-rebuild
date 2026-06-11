import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { resolveStorageUrl } from "@/lib/apiFetch";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "react-calendar";
const gnaoua = "https://api.thejourney-ma.org/attached_assets/gnaoua-festival.jpg";
const timitar = "https://api.thejourney-ma.org/attached_assets/timitar-festival.jpg";
import "react-calendar/dist/Calendar.css";

interface CalEvent {
  id: number | string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  price: string;
  featured: boolean;
}

/* ── Static fallback events (shown only when the API returns nothing) ── */
const FALLBACK_EVENTS: CalEvent[] = [
  {
    id: 1,
    title: "Gnaoua World Music Festival",
    date: "June 21-23, 2025",
    time: "7:00 PM - 11:00 PM",
    location: "Essaouira",
    description: "A vibrant celebration of Gnaoua music and culture, featuring international artists and traditional performances.",
    image: gnaoua,
    price: "$45",
    featured: true,
  },
  {
    id: 2,
    title: "Timitar Festival",
    date: "July 15-20, 2025",
    time: "6:00 PM - 12:00 AM",
    location: "Agadir",
    description: "A festival showcasing a fusion of traditional and world music, celebrating Morocco's rich musical heritage.",
    image: timitar,
    price: "$65",
    featured: false,
  },
  {
    id: 3,
    title: "Mawazine Festival",
    date: "May 24 – June 1, 2025",
    time: "8:00 PM - 2:00 AM",
    location: "Rabat",
    description: "One of the world's largest music festivals featuring international and Moroccan artists across multiple genres.",
    image: gnaoua,
    price: "$35",
    featured: true,
  },
  {
    id: 4,
    title: "Rose Festival",
    date: "May 10-12, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "Kelaat M'Gouna",
    description: "Annual celebration of the rose harvest in the Valley of Roses with traditional music, dances, and rose picking.",
    image: timitar,
    price: "$25",
    featured: false,
  },
  {
    id: 5,
    title: "Fez Festival of World Sacred Music",
    date: "September 14-22, 2025",
    time: "7:30 PM - 11:30 PM",
    location: "Fez",
    description: "Spiritual and sacred music from around the world performed in the mystical setting of ancient Fez.",
    image: gnaoua,
    price: "$55",
    featured: true,
  },
  {
    id: 6,
    title: "Marrakech International Film Festival",
    date: "November 29 – December 7, 2025",
    time: "6:00 PM - 12:00 AM",
    location: "Marrakech",
    description: "Prestigious film festival showcasing international cinema in the magical city of Marrakech.",
    image: timitar,
    price: "$75",
    featured: false,
  },
];

/* ── Helpers ─────────────────────────────────────────────────────────── */
const FALLBACK_IMG = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";

function formatEventDate(raw: string | undefined | null): string {
  if (!raw) return "Date TBD";
  try {
    const d = new Date(raw);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return raw;
  }
}

function formatEventTime(raw: string | undefined | null): string {
  if (!raw) return "";
  try {
    const d = new Date(raw);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function mapApiEvent(e: any, index: number): CalEvent {
  const rawDate = e.eventDate ?? e.startDate ?? e.event_date ?? e.start_date;
  const imageUrl = e.image || (Array.isArray(e.images) && e.images[0]) || FALLBACK_IMG;

  return {
    id: e.id,
    title: e.title ?? "Untitled Event",
    date: formatEventDate(rawDate),
    time: formatEventTime(rawDate),
    location: e.location ?? "",
    description: e.description ?? "",
    image: imageUrl,
    price: e.price != null ? `$${e.price}` : "Contact us",
    featured: index === 0 || (e.isAssociationEvent ?? false),
  };
}

/* ── Component ───────────────────────────────────────────────────────── */
const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(0);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const eventsPerPage = 3;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/booking/events");
        if (res.ok) {
          const data = await res.json();
          const raw: any[] = data.events ?? data.data ?? [];
          const active = raw.filter(
            (e) => e.isActive !== false && e.status !== "cancelled"
          );
          if (active.length > 0) {
            setEvents(active.map(mapApiEvent));
            return;
          }
        }
      } catch {
        // fall through to fallback
      }
      setEvents(FALLBACK_EVENTS);
    };

    fetchEvents();
  }, []);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) setSelectedDate(value);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) =>
      Math.min(Math.floor((events.length - 1) / eventsPerPage), prev + 1)
    );
  };

  const totalEvents = events.length;
  const cities = new Set(events.map((e) => e.location).filter(Boolean)).size;

  return (
    <section id="events" className="py-16 bg-white scroll-mt-32">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-3" style={{ color: "#111827" }}>
            Events & Activities <span style={{ color: "#FBBF24" }}>Calendar</span>
          </h2>
          <p className="font-['Inter'] text-base text-gray-600 max-w-2xl mx-auto">
            Discover upcoming adventures and cultural experiences across Morocco
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8" style={{ paddingTop: "60px", paddingBottom: "60px" }}>
          {/* Calendar Panel */}
          <div className="lg:col-span-4">
            <Card
              className="border-none h-full flex flex-col"
              style={{ backgroundColor: "#FFFFFF", boxShadow: "0 0 12px rgba(0,0,0,0.05)", borderRadius: "16px", padding: "24px" }}
            >
              <h3 className="font-['Inter'] text-base font-semibold mb-4" style={{ color: "#1F2937" }}>
                Event Calendar
              </h3>

              <div className="calendar-container mb-4">
                <CalendarComponent
                  onChange={handleDateChange}
                  value={selectedDate}
                  className="clean-calendar w-full border-none"
                />
              </div>

              <div
                className="p-3 rounded-lg mb-4"
                style={{ backgroundColor: "#FFF8E6", border: "1px solid #FEF3C7" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CalendarIcon className="w-4 h-4" style={{ color: "#FBBF24" }} />
                  <span className="font-['Inter'] text-xs font-medium text-gray-700">Selected Date</span>
                </div>
                <div className="font-['Inter'] text-sm font-medium text-gray-900">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <div
                  className="text-center p-3"
                  style={{ backgroundColor: "#FAFAFA", borderRadius: "12px", border: "1px solid #E5E7EB" }}
                >
                  <div className="text-2xl font-bold font-['Inter']" style={{ color: "#111827" }}>
                    {totalEvents}
                  </div>
                  <div className="text-xs font-['Inter'] text-gray-600">Total Events</div>
                </div>
                <div
                  className="text-center p-3"
                  style={{ backgroundColor: "#FAFAFA", borderRadius: "12px", border: "1px solid #E5E7EB" }}
                >
                  <div className="text-2xl font-bold font-['Inter']" style={{ color: "#111827" }}>
                    {cities}
                  </div>
                  <div className="text-xs font-['Inter'] text-gray-600">Cities</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Events List */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="space-y-8 flex-grow">
              {events
                .slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage)
                .map((event) => (
                  <Card
                    key={event.id}
                    className="border-none overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    style={{ backgroundColor: "#FFFFFF", boxShadow: "0 0 14px rgba(0,0,0,0.06)", borderRadius: "16px" }}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ height: "280px" }}>
                      <img
                        src={resolveStorageUrl(event.image && !event.image.startsWith("blob:") ? event.image : null) ?? FALLBACK_IMG}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                      />
                      {event.featured && (
                        <div className="absolute top-4 right-4">
                          <span
                            className="px-3 py-1 text-xs font-semibold rounded-full"
                            style={{ backgroundColor: "#FBBF24", color: "#111827" }}
                          >
                            Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-['Poppins'] text-lg font-bold mb-3" style={{ color: "#111827" }}>
                        {event.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 mb-3 text-sm" style={{ color: "#6B7280" }}>
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="w-4 h-4" />
                          <span className="font-['Inter']">{event.date}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span className="font-['Inter']">{event.time}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span className="font-['Inter']">{event.location}</span>
                          </div>
                        )}
                      </div>

                      <p className="font-['Inter'] text-sm line-clamp-2 mb-4" style={{ color: "#4B5563" }}>
                        {event.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="font-['Inter'] text-lg font-bold" style={{ color: "#F97316" }}>
                          From {event.price}
                        </div>
                        <Button
                          className="font-['Inter'] text-sm font-medium text-white px-5 py-2 transition-all duration-200 hover:opacity-90"
                          style={{ backgroundColor: "#111827", borderRadius: "8px" }}
                          onClick={() => navigate(`/book?event=${event.id}`)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-['Inter'] border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
                style={{ color: "#111827" }}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <span className="font-['Inter'] text-sm px-4 py-2" style={{ color: "#6B7280" }}>
                Page {currentPage + 1} of {Math.max(1, Math.ceil(events.length / eventsPerPage))}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= Math.ceil(events.length / eventsPerPage) - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-['Inter'] border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
                style={{ color: "#111827" }}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCalendar;
