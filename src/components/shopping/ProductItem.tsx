import React from 'react';
import { Check, Trash2, Edit } from 'lucide-react';
import { Product } from '../../types/shopping';
import { categories } from '../../utils/categories';

interface ProductItemProps {
  product: Product;
  onToggle: (id: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const category = categories.find(c => c.id === product.category);

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg mb-2 ${
      product.completed ? 'bg-gray-100' : 'bg-white'
    }`}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(product.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            product.completed
              ? 'border-primary bg-primary text-white'
              : 'border-gray-300'
          }`}
        >
          {product.completed && <Check size={14} />}
        </button>
        <div>
          <p className={`font-medium ${product.completed ? 'line-through text-gray-500' : ''}`}>
            {product.name}
          </p>
          <p className="text-sm text-gray-500">
            {category?.name} • Quantity: {product.quantity}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(product)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Edit size={18} className="text-gray-500" />
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Trash2 size={18} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default ProductItem;