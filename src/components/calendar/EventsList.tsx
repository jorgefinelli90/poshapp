import React from 'react';
import Card from '../ui/Card';
import { EventInput } from '@fullcalendar/core';

interface EventsListProps {
  events: EventInput[];
  className?: string;
}

interface GroupedEvents {
  [key: string]: EventInput[];
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

  // Agrupar eventos por mes
  const groupEventsByMonth = (events: EventInput[]): GroupedEvents => {
    return events.reduce((groups: GroupedEvents, event) => {
      const date = new Date(event.start);
      const monthYear = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(event);
      return groups;
    }, {});
  };

  const groupedEvents = groupEventsByMonth(
    events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
  );

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold mb-4">Prox. eventos:</h3>
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
          <div key={monthYear} className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider border-b pb-2">
              {monthYear}
            </h4>
            <div className="space-y-3">
              {monthEvents.map(event => {
                const eventDate = new Date(event.start);
                const isUpcoming = eventDate >= today;
                return (
                  <div 
                    key={event.id} 
                    className={`py-2 ${isUpcoming ? '' : 'text-red-500'} transition-colors duration-200 hover:bg-gray-50 rounded-lg px-2`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span 
                          className="inline-block w-2 h-2 rounded-full"
                          style={{ backgroundColor: event.backgroundColor }}
                        />
                        <span className="font-medium">{event.title}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDaysUntil(eventDate)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 ml-4 mt-1">
                      {eventDate.toLocaleDateString('es-ES', { 
                        weekday: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EventsList;
