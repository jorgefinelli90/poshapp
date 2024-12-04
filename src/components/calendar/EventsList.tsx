import React from 'react';
import Card from '../ui/Card';
import { EventInput } from '@fullcalendar/core';

interface EventsListProps {
  events: EventInput[];
  className?: string;
}

const EventsList: React.FC<EventsListProps> = ({ events, className = '' }) => {
  const formatDaysUntil = (date: Date) => {
    const now = new Date();
    const diffInTime = date.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
    return diffInDays > 0 ? `Faltan ${diffInDays} días` : 'Hoy';
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold mb-2">All Events</h3>
      <div className="divide-y">
        {events
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
          .map(event => {
            const eventDate = new Date(event.start);
            const isUpcoming = eventDate >= today;
            return (
              <div 
                key={event.id} 
                className={`py-2 ${isUpcoming ? 'opacity-100' : 'text-red-500'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span 
                      className="inline-block w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: event.backgroundColor }}
                    ></span>
                    <span className="font-semibold">{event.title}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDaysUntil(new Date(event.start))}
                  </div>
                </div>
                <div className="text-sm text-gray-500 ml-4">
                  {eventDate.toLocaleDateString('es-ES', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </Card>
  );
};

export default EventsList;
