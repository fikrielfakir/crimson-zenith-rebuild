import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, MapPin, Clock, Heart, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "react-calendar";
import gnaoua from "@/assets/gnaoua-festival.jpg";
import timitar from "@/assets/timitar-festival.jpg";
import "react-calendar/dist/Calendar.css";
import "./EventsActivitiesCalendar.css";

const EventsActivitiesCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const eventsPerPage = 2;

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const events = [
    {
      id: 1,
      title: "Gnaoua World Music Festival",
      date: "June 21-23, 2024",
      time: "7:00 PM - 11:00 PM",
      location: "Essaouira",
      description: "A vibrant celebration of Gnaoua music and culture, featuring international artists and traditional performances.",
      image: gnaoua,
      price: "350 MAD",
    },
    {
      id: 2,
      title: "Gnaoua World Music Festival",
      date: "June 21-23, 2024",
      time: "7:00 PM - 11:00 PM",
      location: "Essaouira",
      description: "A vibrant celebration of Gnaoua music and culture, featuring international artists and traditional performances.",
      image: timitar,
      price: "350 MAD",
    },
    {
      id: 3,
      title: "Timitar Festival",
      date: "July 15-20, 2024", 
      time: "6:00 PM - 12:00 AM",
      location: "Agadir",
      description: "A festival showcasing a fusion of traditional and world music, celebrating Morocco's rich musical heritage.",
      image: timitar,
      price: "450 MAD",
    },
    {
      id: 4,
      title: "Mawazine Festival",
      date: "May 24-June 1, 2024",
      time: "8:00 PM - 2:00 AM",
      location: "Rabat",
      description: "One of the world's largest music festivals featuring international and Moroccan artists across multiple genres.",
      image: gnaoua,
      price: "250 MAD",
    },
    {
      id: 5,
      title: "Rose Festival",
      date: "May 10-12, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "Kelaat M'Gouna",
      description: "Annual celebration of the rose harvest in the Valley of Roses with traditional music and dances.",
      image: timitar,
      price: "180 MAD",
    },
  ];

  const totalEvents = events.length;
  const cities = new Set(events.map(e => e.location)).size;

  const displayedEvents = events.slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage);

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
        <div className="text-center mb-12">
          <h2 className="font-['Poppins'] font-bold mb-2" style={{ 
            fontSize: '36px', 
            lineHeight: '1.3', 
            color: '#0A0A0A' 
          }}>
            Events & Activities <span style={{ color: '#D4B26A' }}>Calendar</span>
          </h2>
          <p className="font-['Inter']" style={{ 
            fontSize: '16px', 
            color: '#666A73', 
            marginTop: '8px' 
          }}>
            Discover upcoming adventures and cultural experiences across Morocco
          </p>
        </div>
        
        {/* Main Content Grid */}
        <div className="flex gap-8 items-start" style={{ 
          display: 'flex',
          alignItems: 'flex-start',
          gap: '32px'
        }}>
          {/* Calendar Panel - Left Side (30-35%) */}
          <div style={{ 
            width: '320px',
            flexShrink: 0
          }}>
            <div className="events-activities-calendar">
              {/* Calendar Component */}
              <Card className="border-none mb-4" style={{ 
                backgroundColor: '#FFFFFF',
                boxShadow: 'none',
                padding: '20px'
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
                borderRadius: '8px',
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
                  color: '#000000' 
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
                    fontSize: '22px', 
                    color: '#000000' 
                  }}>
                    {totalEvents}
                  </div>
                  <div className="font-['Inter']" style={{ 
                    fontSize: '14px', 
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
                    fontSize: '22px', 
                    color: '#000000' 
                  }}>
                    {cities}
                  </div>
                  <div className="font-['Inter']" style={{ 
                    fontSize: '14px', 
                    color: '#757575' 
                  }}>
                    Cities
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Events List - Right Side (65-70%) */}
          <div style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div className="space-y-6" style={{ marginBottom: '24px' }}>
              {displayedEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className="border-none overflow-hidden"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                    borderRadius: '16px',
                    height: '280px',
                    width: '100%',
                    maxWidth: '800px',
                    transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
                  }}
                >
                  <div className="flex h-full">
                    {/* Image Section - Left 40% */}
                    <div className="relative" style={{ width: '40%', height: '100%' }}>
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                        style={{ 
                          borderTopLeftRadius: '16px', 
                          borderBottomLeftRadius: '16px' 
                        }}
                      />
                      
                      {/* Icons - Top Right of Image */}
                      <div className="absolute flex gap-2" style={{ 
                        top: '10px', 
                        right: '10px' 
                      }}>
                        <button 
                          className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                          style={{ 
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.25s ease-in-out'
                          }}
                        >
                          <Heart className="w-4 h-4" style={{ color: '#666A73' }} strokeWidth={2} />
                        </button>
                        <button 
                          className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                          style={{ 
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.25s ease-in-out'
                          }}
                        >
                          <Share2 className="w-4 h-4" style={{ color: '#666A73' }} strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Content Section - Right 60% */}
                    <div className="flex flex-col justify-between" style={{ 
                      width: '60%', 
                      padding: '20px 24px' 
                    }}>
                      <div>
                        {/* Event Title */}
                        <h3 className="font-['Poppins'] font-bold mb-1" style={{ 
                          fontSize: '20px', 
                          color: '#0A0A0A', 
                          lineHeight: '1.3' 
                        }}>
                          {event.title}
                        </h3>
                        
                        {/* Date & Time */}
                        <div className="flex items-center gap-1.5 mb-1" style={{ marginTop: '4px' }}>
                          <Clock className="w-4 h-4" style={{ color: '#666A73' }} />
                          <span className="font-['Inter']" style={{ 
                            fontSize: '14px', 
                            color: '#666A73' 
                          }}>
                            {event.time}
                          </span>
                        </div>
                        
                        {/* Location */}
                        <div className="flex items-center gap-1.5 mb-2" style={{ marginTop: '2px' }}>
                          <MapPin className="w-4 h-4" style={{ color: '#666A73' }} />
                          <span className="font-['Inter']" style={{ 
                            fontSize: '14px', 
                            color: '#666A73' 
                          }}>
                            {event.location}
                          </span>
                        </div>
                        
                        {/* Description */}
                        <p className="font-['Inter'] line-clamp-2" style={{ 
                          fontSize: '14px', 
                          color: '#444', 
                          lineHeight: '1.6', 
                          marginTop: '10px' 
                        }}>
                          {event.description}
                        </p>
                      </div>
                      
                      {/* Price and Button */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="font-['Inter'] font-bold" style={{ 
                          fontSize: '16px', 
                          color: '#D4B26A' 
                        }}>
                          {event.price}
                        </div>
                        <Button 
                          className="font-['Poppins'] font-medium"
                          style={{
                            backgroundColor: '#D4B26A',
                            color: '#FFFFFF',
                            borderRadius: '10px',
                            padding: '10px 20px',
                            fontSize: '14px',
                            transition: 'background-color 0.25s ease-in-out'
                          }}
                          onClick={() => navigate(`/book?event=${encodeURIComponent(event.title)}`)}
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
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-2 mt-auto">
              {Array.from({ length: Math.ceil(events.length / eventsPerPage) }).map((_, index) => (
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
