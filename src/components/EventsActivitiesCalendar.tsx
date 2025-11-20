import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, MapPin, Clock, Heart, Share2, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "react-calendar";
import gnaoua from "@/assets/gnaoua-festival.jpg";
import timitar from "@/assets/timitar-festival.jpg";
import "react-calendar/dist/Calendar.css";
import "./EventsActivitiesCalendar.css";

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  endDate?: string;
  location: string;
  locationDetails?: string;
  duration?: string;
  category: string;
  languages?: string;
  minAge?: number;
  maxPeople?: number;
  price?: number;
  maxParticipants?: number;
  currentParticipants?: number;
  highlights?: string;
  included?: string;
  notIncluded?: string;
  importantInfo?: string;
  status: string;
  image?: string;
  isAssociationEvent?: boolean;
  clubName?: string;
}

const EventsActivitiesCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const eventsPerPage = 2;

  // Fetch both association and club events from the database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Fetch association events and club events in parallel
        const [associationRes, clubsRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/clubs')
        ]);
        
        const associationData = await associationRes.json();
        const clubsData = await clubsRes.json();
        
        // Get all club events
        const clubEventsPromises = (clubsData.clubs || []).map(async (club: any) => {
          try {
            const eventsRes = await fetch(`/api/clubs/${club.id}/events`);
            const eventsData = await eventsRes.json();
            return (eventsData.events || []).map((event: any) => ({
              ...event,
              clubName: club.name,
              isAssociationEvent: false
            }));
          } catch {
            return [];
          }
        });
        
        const clubEventsArrays = await Promise.all(clubEventsPromises);
        const clubEvents = clubEventsArrays.flat();
        
        // Combine association and club events
        const associationEvents = (associationData.events || []).map((event: any) => ({
          ...event,
          isAssociationEvent: true
        }));
        
        const allEvents = [...associationEvents, ...clubEvents];
        setEvents(allEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  // Helper function to format date
  const formatEventDate = (eventDate: string, endDate?: string) => {
    const start = new Date(eventDate);
    if (!endDate) {
      return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } else {
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  };

  // Helper function to format time
  const formatEventTime = (eventDate: string, endDate?: string) => {
    const start = new Date(eventDate);
    if (!endDate) {
      return start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    const end = new Date(endDate);
    
    return `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  };

  // Filter events by selected date
  const filteredEvents = events.filter((event) => {
    if (!selectedDate) return true;
    
    const eventStart = new Date(event.eventDate);
    const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
    const selected = new Date(selectedDate);
    
    // Set all dates to midnight for comparison
    eventStart.setHours(0, 0, 0, 0);
    eventEnd.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    
    // Check if selected date falls within the event date range
    return selected >= eventStart && selected <= eventEnd;
  });

  const totalEvents = filteredEvents.length;
  const cities = new Set(filteredEvents.map(e => e.location)).size;

  const displayedEvents = filteredEvents.slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage);
  
  // Reset to first page when date changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedDate]);

  return (
    <section className="bg-white">
      <div className="mx-auto" style={{ 
        maxWidth: '1200px', 
        paddingTop: '80px', 
        paddingBottom: '80px', 
        paddingLeft: '40px', 
        paddingRight: '40px' 
      }}>
        {/* Header Section */}
        <div className="text-center" style={{ marginBottom: '40px' }}>
          <h2 className="font-['Poppins'] font-bold" style={{ 
            fontSize: '38px', 
            lineHeight: '1.3', 
            color: '#0A0A0A',
            marginBottom: '12px'
          }}>
            Events & Activities <span style={{ color: '#D4B26A' }}>Calendar</span>
          </h2>
          <p className="font-['Inter']" style={{ 
            fontSize: '16px', 
            color: '#666A73'
          }}>
            Discover upcoming adventures and cultural experiences across Morocco
          </p>
        </div>
        
        {/* Main Content Grid */}
        <div className="flex gap-10 items-start" style={{ 
          display: 'flex',
          alignItems: 'flex-start',
          gap: '40px'
        }}>
          {/* Calendar Panel - Left Side (30-32%) */}
          <div style={{ 
            width: '32%',
            flexShrink: 0
          }}>
            <div className="events-activities-calendar">
              {/* Calendar Component */}
              <Card className="border-none mb-4" style={{ 
                backgroundColor: '#FFFFFF',
                boxShadow: 'none',
                padding: '20px',
                borderRadius: '12px'
              }}>
                <CalendarComponent
                  onChange={handleDateChange}
                  value={selectedDate}
                  className="w-full"
                />
              </Card>
              
              {/* Selected Date Info Box */}
              <div className="mb-4" style={{ 
                backgroundColor: '#F9EBD0',
                borderRadius: '10px',
                padding: '12px 16px'
              }}>
                <div className="flex items-center gap-2 mb-1">
                  <CalendarIcon className="w-4 h-4" style={{ color: '#555555' }} />
                  <span className="font-['Inter'] uppercase" style={{ 
                    fontSize: '12px', 
                    color: '#555555', 
                    fontWeight: 500 
                  }}>
                    Selected Date
                  </span>
                </div>
                <div className="font-['Inter']" style={{ 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: '#0A0A0A'
                }}>
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              
              {/* Stats Row - 2 cards side by side */}
              <div className="flex gap-3">
                <div className="text-center" style={{ 
                  backgroundColor: '#F9F9F9',
                  borderRadius: '10px',
                  width: '140px',
                  height: '70px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px'
                }}>
                  <div className="font-['Inter'] font-bold" style={{ 
                    fontSize: '24px', 
                    color: '#0A0A0A'
                  }}>
                    {totalEvents}
                  </div>
                  <div className="font-['Inter']" style={{ 
                    fontSize: '13px', 
                    color: '#757575' 
                  }}>
                    Total Events
                  </div>
                </div>
                <div className="text-center" style={{ 
                  backgroundColor: '#F9F9F9',
                  borderRadius: '10px',
                  width: '140px',
                  height: '70px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px'
                }}>
                  <div className="font-['Inter'] font-bold" style={{ 
                    fontSize: '24px', 
                    color: '#0A0A0A'
                  }}>
                    {cities}
                  </div>
                  <div className="font-['Inter']" style={{ 
                    fontSize: '13px', 
                    color: '#757575' 
                  }}>
                    Cities
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Events List - Right Side (68-70%) */}
          <div style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {loading ? (
              <div className="text-center py-12">
                <p className="font-['Inter'] text-gray-500">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-['Inter'] text-gray-500">No events found. Please check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6" style={{ marginBottom: '24px' }}>
                {displayedEvents.map((event) => (
                  <Card 
                    key={event.id} 
                    className="border-none overflow-hidden"
                    style={{ 
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      borderRadius: '16px',
                      transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.01)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                    }}
                  >
                    {/* Image Section - Top */}
                    <div className="relative" style={{ width: '100%', height: '240px' }}>
                      <img 
                        src={event.id % 2 === 0 ? timitar : gnaoua} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                        style={{ 
                          borderTopLeftRadius: '16px', 
                          borderTopRightRadius: '16px' 
                        }}
                      />
                      
                      {/* Icons - Top Right of Image */}
                      <div className="absolute flex gap-2" style={{ 
                        top: '14px', 
                        right: '14px' 
                      }}>
                        <button 
                          className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                          style={{ 
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            transition: 'all 0.25s ease-in-out'
                          }}
                        >
                          <Heart className="w-4 h-4" style={{ color: '#666A73' }} strokeWidth={2} />
                        </button>
                        <button 
                          className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                          style={{ 
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            transition: 'all 0.25s ease-in-out'
                          }}
                        >
                          <Share2 className="w-4 h-4" style={{ color: '#666A73' }} strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Content Section - Bottom */}
                    <div style={{ padding: '20px 24px' }}>
                      {/* Organization Badge */}
                      <div style={{ marginBottom: '8px' }}>
                        <Badge 
                          variant={event.isAssociationEvent ? "default" : "secondary"}
                          className="font-['Inter'] text-xs flex items-center gap-1 w-fit"
                          style={{
                            backgroundColor: event.isAssociationEvent ? '#D4B26A' : '#F3F4F6',
                            color: event.isAssociationEvent ? '#FFFFFF' : '#374151',
                            padding: '4px 10px',
                            borderRadius: '6px'
                          }}
                        >
                          {event.isAssociationEvent ? (
                            <>
                              <CalendarIcon className="w-3 h-3" />
                              Journey Association
                            </>
                          ) : (
                            <>
                              <Building2 className="w-3 h-3" />
                              {event.clubName}
                            </>
                          )}
                        </Badge>
                      </div>
                      
                      {/* Event Title */}
                      <h3 className="font-['Poppins'] font-bold" style={{ 
                        fontSize: '20px', 
                        color: '#0A0A0A', 
                        lineHeight: '1.3',
                        marginBottom: '6px'
                      }}>
                        {event.title}
                      </h3>
                      
                      {/* Date & Time & Location Row */}
                      <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: '8px' }}>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" style={{ color: '#666A73' }} />
                          <span className="font-['Inter']" style={{ 
                            fontSize: '13px', 
                            color: '#666A73' 
                          }}>
                            {formatEventTime(event.eventDate, event.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" style={{ color: '#666A73' }} />
                          <span className="font-['Inter']" style={{ 
                            fontSize: '13px', 
                            color: '#666A73' 
                          }}>
                            {event.location}
                          </span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="font-['Inter'] line-clamp-2" style={{ 
                        fontSize: '14px', 
                        color: '#444444', 
                        lineHeight: '1.6', 
                        marginBottom: '10px' 
                      }}>
                        {event.description}
                      </p>
                      
                      {/* Price and Button */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="font-['Poppins'] font-bold" style={{ 
                          fontSize: '16px', 
                          color: '#D4B26A' 
                        }}>
                          {event.price ? `${event.price} MAD` : 'Free'}
                        </div>
                        <Button 
                          className="font-['Poppins'] font-medium"
                          style={{
                            backgroundColor: '#D4B26A',
                            color: '#FFFFFF',
                            borderRadius: '10px',
                            padding: '10px 22px',
                            fontSize: '14px',
                            transition: 'background-color 0.25s ease-in-out'
                          }}
                          onClick={() => navigate(`/book?event=${event.id}`)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#C9A758';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#D4B26A';
                          }}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {Array.from({ length: Math.ceil(filteredEvents.length / eventsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: index === currentPage ? '#D4B26A' : '#E5E7EB',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.25s ease-in-out'
                  }}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsActivitiesCalendar;
