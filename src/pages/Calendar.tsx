import React, { useState, useEffect, useRef } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import FullCalendar, { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import { eventService } from '../services/eventService';
import { useAuthContext } from '../context/AuthContext';
import EventModal from '../components/calendar/EventModal';
import EventsList from '../components/calendar/EventsList';
import Button from '../components/ui/Button';
import EventDetailsModal from '../components/calendar/EventDetailsModal';
import './Calendar.css';

const Calendar = () => {
  const { user } = useAuthContext();
  const [events, setEvents] = useState<EventInput[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const calendarRef = useRef<any>(null);
  const [isMonthView, setIsMonthView] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await eventService.getEvents();
        setEvents(fetchedEvents.map(event => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          allDay: event.allDay,
          backgroundColor: getEventColor(event.type)
        })));
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const selectedDate = new Date(selectInfo.start);
    selectedDate.setHours(new Date().getHours());
    selectedDate.setMinutes(new Date().getMinutes());
    setSelectedDate(selectedDate);
    setModalOpen(true);
    selectInfo.view.calendar.unselect();
  };

  const handleModalSave = async (eventData: { title: string; type: string; start: Date; end: Date; allDay: boolean }) => {
    try {
      const newEvent = {
        ...eventData,
        createdBy: user?.uid || 'unknown'
      };
      const eventId = await eventService.createEvent(newEvent);
      const eventWithColor = {
        ...newEvent,
        id: eventId,
        backgroundColor: getEventColor(eventData.type)
      };
      setEvents(prevEvents => [...prevEvents, eventWithColor]);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      type: clickInfo.event.extendedProps.type,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      allDay: clickInfo.event.allDay
    });
  };

  const handleEventDrop = async (dropInfo: EventDropArg) => {
    try {
      await eventService.updateEvent(dropInfo.event.id, {
        start: dropInfo.event.start,
        end: dropInfo.event.end
      });
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'cita': return '#FF5733';
      case 'aniversario': return '#FFC300';
      case 'plan': return '#DAF7A6';
      case 'compra': return '#C70039';
      case 'viaje': return '#900C3F';
      default: return '#378006';
    }
  };

  return (
    <PageContainer title="Calendario">
      <div className="relative">
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="text-primary" size={20} />
              <div className="flex items-center space-x-2">
                <button 
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors text-sm"
                  onClick={() => {
                    if (calendarRef.current) {
                      const api = calendarRef.current.getApi();
                      setIsMonthView(!isMonthView);
                      api.changeView(isMonthView ? 'timeGridWeek' : 'dayGridMonth');
                    }
                  }}
                >
                  {isMonthView ? 'Vista Mensual' : 'Vista Semanal'}
                </button>
              </div>
            </div>
          </div>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={isMonthView ? 'dayGridMonth' : 'timeGridWeek'}
            locale={esLocale}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek'
            }}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            dateClick={(info) => {
              const clickedDate = new Date(info.date);
              clickedDate.setHours(new Date().getHours());
              clickedDate.setMinutes(new Date().getMinutes());
              setSelectedDate(clickedDate);
              setModalOpen(true);
            }}
            longPressDelay={0}
            selectLongPressDelay={0}
            eventLongPressDelay={0}
            selectMinDistance={0}
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              prev: '',
              next: ''
            }}
            buttonIcons={{
              prev: 'chevron-left',
              next: 'chevron-right'
            }}
            eventColor="#378006"
            height="auto"
          />
        </Card>

        <button
          onClick={() => { 
            setSelectedDate(new Date());
            setModalOpen(true);
          }}
          className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors z-50"
        >
          <Plus size={24} />
        </button>

        {modalOpen && (
          <EventModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleModalSave}
            initialDate={selectedDate}
          />
        )}

        <EventDetailsModal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent || { title: '', type: '', start: new Date(), end: new Date(), allDay: false }}
          onDelete={(eventId) => {
            const deleteEvent = async () => {
              try {
                await eventService.deleteEvent(eventId);
                setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
                setSelectedEvent(null);
              } catch (error) {
                console.error('Error deleting event:', error);
              }
            };
            deleteEvent();
          }}
          onEdit={async (eventData) => {
            try {
              if (!eventData.title || !eventData.type) {
                console.error('Error: Title and type fields must be defined.');
                return;
              }

              await eventService.updateEvent(eventData.id, {
                title: eventData.title,
                type: eventData.type
              });

              setEvents(prevEvents => 
                prevEvents.map(event => 
                  event.id === eventData.id 
                    ? {...event, title: eventData.title, type: eventData.type}
                    : event
                )
              );

              setSelectedEvent(null);
            } catch (error) {
              console.error('Error updating event:', error);
            }
          }}
        />

        <div className="mt-4">
          <EventsList events={events} className="bg-white rounded-lg shadow" />
        </div>
      </div>
    </PageContainer>
  );
};

export default Calendar;