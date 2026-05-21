import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar as CalendarIcon, MapPin, Clock, Heart, Share2, Building2, CheckCircle2, Radio, Timer, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "react-calendar";
import noEventsImage from "@/assets/no-events.png";
import "react-calendar/dist/Calendar.css";
import "./EventsActivitiesCalendar.css";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: number | string;
  title: string;
  description: string;
  eventDate?: string;
  startDate?: string;
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

/* ─── Status config ─────────────────────────────────────────────── */
const STATUS_CONFIG: Record<string, {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
  Icon: React.ElementType;
  pulse: boolean;
}> = {
  upcoming: {
    label: 'Upcoming',
    bg: '#EFF6FF',
    text: '#1D4ED8',
    border: '#BFDBFE',
    dot: '#3B82F6',
    Icon: Timer,
    pulse: false,
  },
  ongoing: {
    label: 'Ongoing',
    bg: '#F0FDF4',
    text: '#15803D',
    border: '#BBF7D0',
    dot: '#22C55E',
    Icon: Radio,
    pulse: true,
  },
  completed: {
    label: 'Completed',
    bg: '#F9FAFB',
    text: '#6B7280',
    border: '#E5E7EB',
    dot: '#9CA3AF',
    Icon: CheckCircle2,
    pulse: false,
  },
};

const StatusBadge = ({ status }: { status: string }) => {
  const key = (status || '').toLowerCase();
  const cfg = STATUS_CONFIG[key];
  if (!cfg) return null;
  const { Icon } = cfg;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-['Inter'] border"
      style={{ backgroundColor: cfg.bg, color: cfg.text, borderColor: cfg.border }}
    >
      {cfg.pulse ? (
        <span className="relative flex h-2 w-2">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: cfg.dot }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ backgroundColor: cfg.dot }}
          />
        </span>
      ) : (
        <Icon size={11} strokeWidth={2.5} />
      )}
      {cfg.label}
    </span>
  );
};

/* ─── Filter tabs ────────────────────────────────────────────────── */
const STATUS_FILTERS = ['All', 'Upcoming', 'Ongoing', 'Completed'] as const;

const FAVORITES_KEY = 'journey_favorite_events';

const EventsActivitiesCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const eventsPerPage = 2;

  const toggleFavorite = (e: React.MouseEvent, eventId: string | number) => {
    e.stopPropagation();
    const id = String(eventId);
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast({ title: 'Removed from favorites' });
      } else {
        next.add(id);
        toast({ title: 'Added to favorites', description: 'Event saved to your favorites.' });
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const handleShare = async (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    const url = `${window.location.origin}/book?event=${event.id}`;
    const shareData = {
      title: event.title,
      text: `Check out this event: ${event.title} — ${event.location}`,
      url,
    };
    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: 'Link copied!', description: 'Event link copied to clipboard.' });
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        toast({ title: 'Link copied!', description: 'Event link copied to clipboard.' });
      } catch {
        toast({ title: 'Could not share', description: 'Please copy the URL manually.', variant: 'destructive' });
      }
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/booking/events');
        const data = await response.json();
        const raw: any[] = Array.isArray(data) ? data : (data.events || []);

        const mappedEvents: Event[] = raw.map((e: any) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          startDate:           e.startDate           ?? e.start_date,
          endDate:             e.endDate             ?? e.end_date,
          eventDate:           e.eventDate           ?? e.event_date,
          location:            e.location,
          locationDetails:     e.locationDetails     ?? e.location_details,
          duration:            e.duration,
          category:            e.category,
          languages:           Array.isArray(e.languages) ? e.languages.join(', ') : (e.languages ?? ''),
          minAge:              e.minAge              ?? e.min_age,
          maxPeople:           e.maxPeople           ?? e.max_people,
          price:               e.price,
          maxParticipants:     e.maxParticipants     ?? e.max_participants,
          currentParticipants: e.currentParticipants ?? e.current_participants ?? 0,
          highlights:          Array.isArray(e.highlights)  ? e.highlights.join('\n')  : (e.highlights  ?? ''),
          included:            Array.isArray(e.included)    ? e.included.join('\n')    : (e.included    ?? ''),
          notIncluded:         Array.isArray(e.not_included ?? e.notIncluded) ? (e.not_included ?? e.notIncluded).join('\n') : (e.not_included ?? e.notIncluded ?? ''),
          importantInfo:       e.importantInfo       ?? e.important_info,
          status:              e.status,
          image:               e.image,
          isAssociationEvent:  e.isAssociationEvent  ?? e.is_association_event ?? false,
          clubName:            e.clubName,
        }));

        setEvents(mappedEvents);
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
      setCurrentPage(0);
    }
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
    setCurrentPage(0);
  };

  const formatEventDate = (eventDate: string, endDate?: string) => {
    const start = new Date(eventDate);
    if (!endDate) return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const end = new Date(endDate);
    if (start.toDateString() === end.toDateString())
      return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const formatEventTime = (eventDate: string, endDate?: string) => {
    const start = new Date(eventDate);
    if (!endDate) return start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const end = new Date(endDate);
    return `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} – ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  };

  /* Determine effective status: auto-classify past events as completed */
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const getEffectiveStatus = (event: Event): string => {
    const rawStatus = (event.status || '').toLowerCase();
    if (rawStatus === 'completed') return 'completed';
    const dateToUse = event.endDate || event.startDate || event.eventDate;
    if (dateToUse) {
      const eventEnd = new Date(dateToUse);
      eventEnd.setHours(0, 0, 0, 0);
      if (eventEnd < now) return 'completed';
    }
    return rawStatus;
  };

  /* Find the single most-recent past event to show in non-Completed views */
  const allPastEvents = events
    .filter(ev => getEffectiveStatus(ev) === 'completed')
    .sort((a, b) => {
      const da = new Date(a.endDate || a.startDate || a.eventDate || '').getTime();
      const db = new Date(b.endDate || b.startDate || b.eventDate || '').getTime();
      return db - da; // descending — most recent first
    });
  const lastPassedEventId = allPastEvents[0]?.id ?? null;

  /* Filter: date (optional) + status tab */
  const filteredEvents = events.filter((event) => {
    const effectiveStatus = getEffectiveStatus(event);

    /* Status filter */
    if (statusFilter !== 'All') {
      if (effectiveStatus !== statusFilter.toLowerCase()) return false;
    } else {
      /* In "All" view: hide completed events except the single most-recent one */
      if (effectiveStatus === 'completed' && String(event.id) !== String(lastPassedEventId)) return false;
    }

    /* Date filter — only active when a date has been explicitly picked */
    if (selectedDate) {
      const dateToUse = event.startDate || event.eventDate;
      if (!dateToUse) return false;
      const eventStart = new Date(dateToUse);
      const eventEnd   = event.endDate ? new Date(event.endDate) : eventStart;
      const sel        = new Date(selectedDate);
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(0, 0, 0, 0);
      sel.setHours(0, 0, 0, 0);
      if (sel < eventStart || sel > eventEnd) return false;
    }

    return true;
  });

  /* Sort: upcoming first, then ongoing, then completed, by date */
  const statusOrder: Record<string, number> = { upcoming: 0, ongoing: 1, completed: 2 };
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const sa = statusOrder[getEffectiveStatus(a)] ?? 9;
    const sb = statusOrder[getEffectiveStatus(b)] ?? 9;
    if (sa !== sb) return sa - sb;
    const da = new Date(a.startDate || a.eventDate || '').getTime();
    const db = new Date(b.startDate || b.eventDate || '').getTime();
    return da - db;
  });

  const totalEvents    = sortedEvents.length;
  const cities         = new Set(sortedEvents.map(e => e.location)).size;
  const displayedEvents = sortedEvents.slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage);
  const totalPages      = Math.ceil(sortedEvents.length / eventsPerPage);

  useEffect(() => { setCurrentPage(0); }, [statusFilter, selectedDate]);

  return (
    <section className="bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-20" style={{ maxWidth: '1200px' }}>

        {/* Header */}
        <div className="text-center" style={{ marginBottom: '40px' }}>
          <h2 className="font-['Poppins'] font-bold" style={{ fontSize: '38px', lineHeight: '1.3', color: '#0A0A0A', marginBottom: '12px' }}>
            Events & Activities <span style={{ color: '#D4B26A' }}>Calendar</span>
          </h2>
          <p className="font-['Inter']" style={{ fontSize: '16px', color: '#666A73' }}>
            Discover upcoming adventures and cultural experiences across Morocco
          </p>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-2 flex-wrap justify-center" style={{ marginBottom: '32px' }}>
          {STATUS_FILTERS.map((f) => {
            const active = statusFilter === f;
            const cfg = f !== 'All' ? STATUS_CONFIG[f.toLowerCase()] : null;
            return (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold font-['Inter'] border transition-all duration-200"
                style={{
                  backgroundColor: active ? (cfg ? cfg.bg : '#111f50') : '#FFFFFF',
                  color:           active ? (cfg ? cfg.text : '#FFFFFF') : '#6B7280',
                  borderColor:     active ? (cfg ? cfg.border : '#111f50') : '#E5E7EB',
                  boxShadow:       active ? '0 2px 8px rgba(0,0,0,0.10)' : 'none',
                }}
              >
                {cfg && <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: cfg.dot }} />}
                {f}
              </button>
            );
          })}
        </div>

        {/* Main grid */}
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10">

          {/* Calendar Panel */}
          <div className="w-full lg:w-[32%] lg:flex-shrink-0">
            <div className="events-activities-calendar">
              <Card className="border-none mb-4" style={{ backgroundColor: '#FFFFFF', boxShadow: 'none', padding: '20px', borderRadius: '12px' }}>
                <CalendarComponent
                  onChange={handleDateChange}
                  value={selectedDate}
                  className="w-full"
                  tileContent={({ date, view }) => {
                    if (view !== 'month') return null;
                    const d = date.toISOString().slice(0, 10);
                    const match = events.find(ev => {
                      const start = (ev.startDate || ev.eventDate || '').slice(0, 10);
                      const end   = (ev.endDate   || start).slice(0, 10);
                      return start && d >= start && d <= end;
                    });
                    if (!match) return null;
                    const dotColor = STATUS_CONFIG[(match.status || '').toLowerCase()]?.dot ?? '#D4B26A';
                    return (
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: dotColor }} />
                      </div>
                    );
                  }}
                />
              </Card>

              {/* Active date filter pill */}
              {selectedDate ? (
                <div className="flex items-center justify-between mb-4" style={{ backgroundColor: '#EFF6FF', borderRadius: '10px', padding: '10px 14px', border: '1px solid #BFDBFE' }}>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" style={{ color: '#1D4ED8' }} />
                    <div>
                      <div className="font-['Inter']" style={{ fontSize: '11px', color: '#1D4ED8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Filtered by date</div>
                      <div className="font-['Inter']" style={{ fontSize: '13px', fontWeight: 700, color: '#1E40AF' }}>
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <button onClick={clearDateFilter} className="p-1 rounded-full hover:bg-blue-100 transition-colors" title="Clear date filter">
                    <X className="w-4 h-4" style={{ color: '#1D4ED8' }} />
                  </button>
                </div>
              ) : (
                <div className="mb-4" style={{ backgroundColor: '#F9EBD0', borderRadius: '10px', padding: '12px 16px' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarIcon className="w-4 h-4" style={{ color: '#555555' }} />
                    <span className="font-['Inter'] uppercase" style={{ fontSize: '12px', color: '#555555', fontWeight: 500 }}>All dates shown</span>
                  </div>
                  <div className="font-['Inter']" style={{ fontSize: '13px', color: '#888', lineHeight: '1.4' }}>
                    Click a date to filter events
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex gap-3">
                {[
                  { value: totalEvents, label: 'Total Events' },
                  { value: cities,      label: 'Cities' },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center flex-1" style={{ backgroundColor: '#F9F9F9', borderRadius: '10px', minHeight: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
                    <div className="font-['Inter'] font-bold" style={{ fontSize: '24px', color: '#0A0A0A' }}>{value}</div>
                    <div className="font-['Inter']" style={{ fontSize: '13px', color: '#757575' }}>{label}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Events List */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#D4B26A] border-t-transparent mb-3" />
                <p className="font-['Inter'] text-gray-500">Loading events...</p>
              </div>
            ) : sortedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <img src={noEventsImage} alt="No events" style={{ height: '260px', width: 'auto', maxWidth: '100%' }} />
                <h3 className="font-['Poppins'] font-semibold" style={{ fontSize: '22px', color: '#0A0A0A', marginTop: '16px', marginBottom: '8px' }}>
                  No Events Found
                </h3>
                <p className="font-['Inter']" style={{ fontSize: '15px', color: '#666A73', maxWidth: '360px', textAlign: 'center', lineHeight: '1.6' }}>
                  {selectedDate
                    ? 'No events on this date. Try a different date or clear the filter.'
                    : 'No events match the selected filter.'}
                </p>
                {(selectedDate || statusFilter !== 'All') && (
                  <button
                    onClick={() => { clearDateFilter(); setStatusFilter('All'); }}
                    className="mt-4 px-5 py-2 rounded-full text-sm font-semibold font-['Inter'] border transition-colors"
                    style={{ backgroundColor: '#111f50', color: '#fff', border: 'none' }}
                  >
                    Show All Events
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" style={{ marginBottom: '24px' }}>
                  {displayedEvents.map((event) => {
                    const dateStr = event.startDate || event.eventDate;
                    const imgSrc  = event.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
                    const effectiveStatus = getEffectiveStatus(event);
                    const isPast = effectiveStatus === 'completed';
                    const cardEl = (
                      <Card
                        key={event.id}
                        className="border-none overflow-hidden"
                        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', borderRadius: '16px', transition: 'transform 0.25s, box-shadow 0.25s', cursor: isPast ? 'not-allowed' : 'pointer', opacity: isPast ? 0.5 : 1, filter: isPast ? 'grayscale(50%)' : 'none' }}
                        onMouseEnter={e => { if (!isPast) { e.currentTarget.style.transform = 'scale(1.01)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)'; } }}
                        onMouseLeave={e => { if (!isPast) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; } }}
                        onClick={() => { if (!isPast) navigate(`/book?event=${event.id}`); }}
                      >
                        {/* Image */}
                        <div className="relative" style={{ width: '100%', height: '200px' }}>
                          <img
                            src={imgSrc}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
                            onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'; }}
                          />

                          {/* Status badge — top left */}
                          <div className="absolute" style={{ top: '12px', left: '12px' }}>
                            <StatusBadge status={effectiveStatus} />
                          </div>

                          {/* Action icons — top right */}
                          <div className="absolute flex gap-2" style={{ top: '12px', right: '12px' }}>
                            <button
                              onClick={e => toggleFavorite(e, event.id)}
                              className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                              style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.15)', transition: 'all 0.25s' }}
                              title={favorites.has(String(event.id)) ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <Heart
                                className="w-4 h-4"
                                style={{
                                  color: favorites.has(String(event.id)) ? '#ef4444' : '#666A73',
                                  fill: favorites.has(String(event.id)) ? '#ef4444' : 'none',
                                  transition: 'color 0.2s, fill 0.2s',
                                }}
                                strokeWidth={2}
                              />
                            </button>
                            <button
                              onClick={e => handleShare(e, event)}
                              className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                              style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.15)', transition: 'all 0.25s' }}
                              title="Share event"
                            >
                              <Share2 className="w-4 h-4" style={{ color: '#666A73' }} strokeWidth={2} />
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '18px 20px' }}>
                          {/* Organisation badge */}
                          <div style={{ marginBottom: '8px' }}>
                            <Badge
                              variant={event.isAssociationEvent ? 'default' : 'secondary'}
                              className="font-['Inter'] text-xs flex items-center gap-1 w-fit"
                              style={{
                                backgroundColor: event.isAssociationEvent ? '#D4B26A' : '#F3F4F6',
                                color: event.isAssociationEvent ? '#FFFFFF' : '#374151',
                                padding: '4px 10px', borderRadius: '6px'
                              }}
                            >
                              {event.isAssociationEvent ? (
                                <><CalendarIcon className="w-3 h-3" />Journey Association</>
                              ) : (
                                <><Building2 className="w-3 h-3" />{event.clubName || 'Club Event'}</>
                              )}
                            </Badge>
                          </div>

                          {/* Title */}
                          <h3 className="font-['Poppins'] font-bold" style={{ fontSize: '18px', color: '#0A0A0A', lineHeight: '1.3', marginBottom: '6px' }}>
                            {event.title}
                          </h3>

                          {/* Date / Location */}
                          <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: '8px' }}>
                            {dateStr && (
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-3.5 h-3.5" style={{ color: '#D4B26A' }} />
                                <span className="font-['Inter']" style={{ fontSize: '12px', color: '#666A73' }}>
                                  {formatEventDate(dateStr, event.endDate)}
                                </span>
                              </div>
                            )}
                            {event.eventDate && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" style={{ color: '#D4B26A' }} />
                                <span className="font-['Inter']" style={{ fontSize: '12px', color: '#666A73' }}>
                                  {formatEventTime(event.eventDate, event.endDate)}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" style={{ color: '#D4B26A' }} />
                              <span className="font-['Inter']" style={{ fontSize: '12px', color: '#666A73' }}>{event.location}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="font-['Inter'] line-clamp-2" style={{ fontSize: '13px', color: '#444444', lineHeight: '1.6', marginBottom: '14px' }}>
                            {event.description}
                          </p>

                          {/* Price + Button */}
                          <div className="flex items-center justify-between">
                            <div className="font-['Poppins'] font-bold" style={{ fontSize: '16px', color: '#D4B26A' }}>
                              {event.price ? `${event.price} MAD` : 'Free'}
                            </div>
                            <Button
                              className="font-['Poppins'] font-medium"
                              disabled={isPast}
                              style={{ backgroundColor: isPast ? '#D1D5DB' : '#D4B26A', color: isPast ? '#9CA3AF' : '#FFFFFF', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', transition: 'background-color 0.25s', cursor: isPast ? 'not-allowed' : 'pointer' }}
                              onClick={e => { e.stopPropagation(); if (!isPast) navigate(`/book?event=${event.id}`); }}
                              onMouseEnter={e => { if (!isPast) e.currentTarget.style.backgroundColor = '#C9A758'; }}
                              onMouseLeave={e => { if (!isPast) e.currentTarget.style.backgroundColor = '#D4B26A'; }}
                            >
                              {isPast ? 'Event Ended' : 'Book Now'}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                    if (isPast) {
                      return (
                        <TooltipProvider key={event.id} delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>{cardEl}</div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="font-['Inter'] text-sm px-3 py-2">
                              This event has ended
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    }
                    return cardEl;
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        style={{
                          width: i === currentPage ? '24px' : '10px',
                          height: '10px',
                          borderRadius: i === currentPage ? '5px' : '50%',
                          backgroundColor: i === currentPage ? '#D4B26A' : '#E5E7EB',
                          border: 'none', cursor: 'pointer', padding: 0,
                          transition: 'all 0.25s ease-in-out'
                        }}
                        aria-label={`Page ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsActivitiesCalendar;
