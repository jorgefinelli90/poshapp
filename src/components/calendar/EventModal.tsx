import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: { title: string; type: string; start: Date; end: Date; allDay: boolean }) => void;
  initialDate: Date;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, initialDate }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('plan');
  const [start, setStart] = useState(initialDate);
  const [end, setEnd] = useState(initialDate);
  const [allDay, setAllDay] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setStart(initialDate);
      setEnd(initialDate);
    }
  }, [isOpen, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (allDay) {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    onSave({
      title,
      type,
      start: startDate,
      end: endDate,
      allDay
    });

    // Reset form
    setTitle('');
    setType('plan');
    setAllDay(true);
    onClose();
  };

  const formatDateForInput = (date: Date) => {
    if (allDay) {
      return date.toISOString().split('T')[0];
    }
    return date.toISOString().slice(0, 16);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value="cita">Cita</option>
            <option value="aniversario">Aniversario</option>
            <option value="plan">Plan</option>
            <option value="compra">Compra</option>
            <option value="viaje">Viaje</option>
          </select>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="allDay"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="allDay" className="text-sm font-medium text-gray-700">
            All Day Event
          </label>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
              Start
            </label>
            <input
              type={allDay ? "date" : "datetime-local"}
              id="start"
              value={formatDateForInput(start)}
              onChange={(e) => setStart(new Date(e.target.value))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
              End
            </label>
            <input
              type={allDay ? "date" : "datetime-local"}
              id="end"
              value={formatDateForInput(end)}
              onChange={(e) => setEnd(new Date(e.target.value))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
              min={formatDateForInput(start)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EventModal;
