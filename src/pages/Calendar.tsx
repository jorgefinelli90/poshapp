import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import { Calendar as CalendarIcon } from 'lucide-react';
import FullCalendar, { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { eventService } from '../services/eventService';
import { useAuthContext } from '../context/AuthContext';
import EventModal from '../components/calendar/EventModal';
import EventsList from '../components/calendar/EventsList';
import Button from '../components/ui/Button';

const Calendar = () => {
  const { user } = useAuthContext();
  const [events, setEvents] = useState<EventInput[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

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
    console.log('Fecha seleccionada:', selectInfo.start);
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

  const handleEventClick = async (clickInfo: EventClickArg) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      try {
        await eventService.deleteEvent(clickInfo.event.id);
        setEvents(prevEvents => prevEvents.filter(event => event.id !== clickInfo.event.id));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
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
    <PageContainer title="Calendar">
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-primary" size={24} />
            <h2 className="text-lg font-semibold">Calendar</h2>
          </div>
          <Button onClick={() => { 
            setSelectedDate(new Date());
            setModalOpen(true);
          }}>
            Add Event
          </Button>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
          }}
          events={events}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          eventColor="#378006"
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
        />
      </Card>
      {modalOpen && (
        <EventModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleModalSave}
          initialDate={selectedDate}
        />
      )}
      <EventsList events={events} className="mt-4" />
    </PageContainer>
  );
};

export default Calendar;