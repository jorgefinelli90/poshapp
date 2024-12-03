import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ShoppingItem } from '../../types/shoppingList';

const categories = [
  'Alimentos',
  'Bebidas',
  'Limpieza',
  'Cuidado Personal',
  'Mascotas',
  'Hogar',
  'Otros'
];

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editItem?: ShoppingItem;
}

const AddItemModal = ({ isOpen, onClose, onAdd, editItem }: AddItemModalProps) => {
  const [name, setName] = useState(editItem?.name || '');
  const [category, setCategory] = useState(editItem?.category || categories[0]);
  const [quantity, setQuantity] = useState(editItem?.quantity || 1);
  const [notes, setNotes] = useState(editItem?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      category,
      quantity,
      notes,
      purchased: false
    });
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setCategory(categories[0]);
    setQuantity(1);
    setNotes('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {editItem ? 'Editar Item' : 'Agregar Item'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Cantidad
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notas (opcional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editItem ? 'Guardar Cambios' : 'Agregar'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddItemModal;
