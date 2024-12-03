import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Copy, Trash2, Edit2 } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AddItemModal from '../components/shopping/AddItemModal';
import { ShoppingItem } from '../types/shoppingList';
import { useAuthContext } from '../context/AuthContext';
import { 
  createShoppingList, 
  addItem, 
  updateItem, 
  deleteItem,
  subscribeToShoppingList
} from '../services/shoppingListService';

const categories = [
  'Alimentos',
  'Bebidas',
  'Limpieza',
  'Cuidado Personal',
  'Mascotas',
  'Hogar',
  'Otros'
];

const ShoppingListPage = () => {
  const { user } = useAuthContext();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | undefined>();
  const [listId, setListId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Inicializar o cargar la lista de compras
      const initializeList = async () => {
        const id = await createShoppingList(user.uid);
        setListId(id);
      };

      // Suscribirse a cambios en la lista
      const unsubscribe = subscribeToShoppingList(user.uid, (updatedItems) => {
        setItems(updatedItems);
      });

      if (!listId) {
        initializeList();
      }

      return () => unsubscribe();
    }
  }, [user]);

  const handleAddItem = async (newItem: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (listId) {
      await addItem(listId, newItem);
    }
  };

  const handleEditItem = (item: ShoppingItem) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleUpdateItem = async (updates: Partial<ShoppingItem>) => {
    if (listId && editingItem) {
      await updateItem(listId, editingItem.id, updates);
      setEditingItem(undefined);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (listId) {
      await deleteItem(listId, itemId);
    }
  };

  const handleToggleItem = async (item: ShoppingItem) => {
    if (listId) {
      await updateItem(listId, item.id, { purchased: !item.purchased });
    }
  };

  const handleCopyList = () => {
    const listText = items
      .map(item => `- ${item.name} (${item.quantity})`)
      .join('\n');
    navigator.clipboard.writeText(listText);
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Lista de Compras</h1>
          <div className="flex gap-2">
            <Button onClick={handleCopyList} variant="secondary">
              <Copy className="w-4 h-4 mr-2" />
              Copiar Lista
            </Button>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Item
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="grid gap-4">
          {categories.map(category => (
            <Card key={category}>
              <h2 className="text-lg font-semibold mb-2">{category}</h2>
              <div className="space-y-2">
                {items
                  .filter(item => item.category === category)
                  .map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.purchased}
                          onChange={() => handleToggleItem(item)}
                          className="form-checkbox h-5 w-5 text-primary rounded"
                        />
                        <div>
                          <span className={item.purchased ? 'line-through text-gray-400' : ''}>
                            {item.name} ({item.quantity})
                          </span>
                          {item.notes && (
                            <p className="text-sm text-gray-500">{item.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <AddItemModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(undefined);
        }}
        onAdd={editingItem ? handleUpdateItem : handleAddItem}
        editItem={editingItem}
      />
    </PageContainer>
  );
};

export default ShoppingListPage;