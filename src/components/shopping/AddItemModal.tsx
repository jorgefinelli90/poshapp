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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-surface rounded-lg p-6 w-full max-w-md mx-auto shadow-lg"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-text-light hover:text-text hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-text mb-6">
          {editItem ? 'Editar Item' : 'Agregar Item'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              placeholder="Ingresa el nombre del item"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text mb-1">
              Categoría
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-text mb-1">
              Cantidad
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-text mb-1">
              Notas (opcional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
              placeholder="Agrega notas adicionales..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editItem ? 'Guardar Cambios' : 'Agregar'}
            </Button>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
};

export default AddItemModal;