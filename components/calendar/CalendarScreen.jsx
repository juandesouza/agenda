'use client';

import { useEffect, useState, useCallback } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';
import 'moment/locale/pt';
import 'moment/locale/fr';
import 'moment/locale/it';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchEvents, setActiveEvent } from '@/lib/redux/slices/calendarSlice';
import { Navbar } from '@/components/Navbar';
import { EventModal } from './EventModal';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const localizer = momentLocalizer(moment);

export function CalendarScreen() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.calendar);
  const { user } = useAppSelector((state) => state.auth);

  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Configure moment locale based on i18n
  useEffect(() => {
    const localeMap = {
      en: 'en',
      es: 'es',
      pt: 'pt',
      fr: 'fr',
      it: 'it',
    };
    moment.locale(localeMap[i18n.language] || 'en');
  }, [i18n.language]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSelectSlot = useCallback(({ start, end }) => {
    setSelectedSlot({ start, end });
    setIsModalOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    dispatch(setActiveEvent(event));
    setIsModalOpen(true);
  }, [dispatch]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedSlot(null);
    dispatch(setActiveEvent(null));
  }, [dispatch]);

  const eventStyleGetter = (event) => {
    const color = event.color || user?.color || '#3b82f6';
    return {
      style: {
        backgroundColor: color,
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        padding: '4px 8px',
        fontSize: '0.875rem',
        fontWeight: 500,
      },
    };
  };

  const CustomToolbar = ({ label, onNavigate, onView }) => {
    if (isMobile) {
      return (
        <div className="mb-4 space-y-3">
          {/* Mobile: Date navigation and title */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('PREV')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-base font-semibold text-center flex-1 px-2">{label}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('NEXT')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Mobile: View selector and actions */}
          <div className="flex items-center gap-2">
            <Select value={currentView} onValueChange={onView}>
              <SelectTrigger className="flex-1 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">{t('month')}</SelectItem>
                <SelectItem value="week">{t('week')}</SelectItem>
                <SelectItem value="day">{t('day')}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('TODAY')}
              className="h-9 text-xs px-2"
            >
              {t('today')}
            </Button>
            <Button
              onClick={() => {
                setSelectedSlot(null);
                setIsModalOpen(true);
              }}
              size="sm"
              className="h-9 px-2"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    // Desktop layout
    return (
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('PREV')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold min-w-[200px] text-center">{label}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('NEXT')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('TODAY')}
          >
            {t('today')}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={currentView === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onView('month')}
          >
            {t('month')}
          </Button>
          <Button
            variant={currentView === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onView('week')}
          >
            {t('week')}
          </Button>
          <Button
            variant={currentView === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onView('day')}
          >
            {t('day')}
          </Button>
          <Button
            onClick={() => {
              setSelectedSlot(null);
              setIsModalOpen(true);
            }}
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('createEvent')}
          </Button>
        </div>
      </div>
    );
  };

  // Calculate responsive height
  const getCalendarHeight = () => {
    if (typeof window === 'undefined') return 600;
    if (isMobile) {
      // Mobile: Use viewport height minus navbar, padding, and toolbar
      return Math.max(400, window.innerHeight - 200);
    }
    return 600;
  };

  const [calendarHeight, setCalendarHeight] = useState(getCalendarHeight());

  useEffect(() => {
    const updateHeight = () => {
      setCalendarHeight(getCalendarHeight());
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 text-foreground transition-colors dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-black">
      <Navbar />
      <div className="container mx-auto p-2 sm:p-4">
        <div className="rounded-2xl border border-white/40 bg-white/80 p-3 sm:p-6 shadow-xl glass dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-foreground dark:glass-dark">
          {loading && (
            <div className="mb-4 text-center text-sm text-muted-foreground">
              Loading events...
            </div>
          )}
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: calendarHeight }}
            view={currentView}
            onView={setCurrentView}
            date={currentDate}
            onNavigate={setCurrentDate}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            eventPropGetter={eventStyleGetter}
            components={{
              toolbar: CustomToolbar,
            }}
            messages={{
              next: 'Next',
              previous: 'Previous',
              today: t('today'),
              month: t('month'),
              week: t('week'),
              day: t('day'),
              agenda: 'Agenda',
              date: 'Date',
              time: 'Time',
              event: t('event'),
              noEventsInRange: 'No events in this range',
            }}
          />
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedSlot={selectedSlot}
      />
    </div>
  );
}

