import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onDelete: (eventId: string) => void;
  onEdit: (eventData: any) => void;
}

const EventDetailsModal = ({ isOpen, onClose, event, onDelete, onEdit }: EventDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(event?.title || '');
  const [type, setType] = useState(event?.type || '');

  useEffect(() => {
    setTitle(event?.title || '');
    setType(event?.type || '');
  }, [event]);

  if (!isOpen || !event) return null;

  const handleSave = () => {
    const updatedEvent = {
      ...event,
      title: title || event.title,
      type: type || event.type
    };
    onEdit(updatedEvent);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Editar Evento' : 'Detalles del Evento'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="cita">Cita</option>
                <option value="aniversario">Aniversario</option>
                <option value="plan">Plan</option>
                <option value="compra">Compra</option>
                <option value="viaje">Viaje</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{event.title}</h3>
              <p className="text-sm text-gray-500 capitalize">{event.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Inicio:</span>{' '}
                {format(new Date(event.start), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Fin:</span>{' '}
                {format(new Date(event.end), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Todo el día:</span> {event.allDay ? 'Sí' : 'No'}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                Guardar
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => onDelete(event.id)}>
                Eliminar
              </Button>
              <Button onClick={() => {
                setTitle(event.title);
                setType(event.type);
                setIsEditing(true);
              }}>
                Modificar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
