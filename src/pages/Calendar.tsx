import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import { Calendar as CalendarIcon } from 'lucide-react';

const Calendar = () => {
  return (
    <PageContainer title="Calendar">
      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="text-primary" size={24} />
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
        </div>
        <p className="text-text-light">No upcoming events. Add your first event!</p>
      </Card>
    </PageContainer>
  );
};

export default Calendar;