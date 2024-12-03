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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const unsubscribe = subscribeToShoppingList((updatedItems) => {
        setItems(updatedItems);
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleAddItem = async (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addItem(item);
    } catch (error) {
      console.error('Error al agregar item:', error);
    }
  };

  const handleEditItem = (item: ShoppingItem) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleUpdateItem = async (item: ShoppingItem, updates: Partial<ShoppingItem>) => {
    try {
      await updateItem(item.id, updates);
    } catch (error) {
      console.error('Error al actualizar item:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItem(itemId);
    } catch (error) {
      console.error('Error al eliminar item:', error);
    }
  };

  const handleToggleItem = async (item: ShoppingItem) => {
    try {
      await updateItem(item.id, { purchased: !item.purchased });
    } catch (error) {
      console.error('Error al actualizar estado del item:', error);
    }
  };

  const handleCopyList = () => {
    const listText = items
      .map(item => `- ${item.name} (${item.quantity})`)
      .join('\n');
    navigator.clipboard.writeText(listText);
  };

  const getCreatorInfo = (email: string | undefined) => {
    if (!email) return { name: 'Desconocido', emoji: '👤' };
    const emailLower = email.toLowerCase();
    if (emailLower.startsWith('j')) {
      return { name: 'Jorge', emoji: '👨Jorge' };
    } else if (emailLower.startsWith('n')) {
      return { name: 'Nhorie', emoji: '👩Nhorie' };
    }
    return { name: email, emoji: '👤' };
  };

  const itemsByCategory = categories.map(category => {
    const categoryItems = items.filter(item => item.category === category);
    if (categoryItems.length === 0) return null;

    return (
      <Card key={category} className="overflow-hidden">
        <h2 className="text-lg font-semibold mb-4 text-primary">{category}</h2>
        <div className="space-y-3">
          {categoryItems.map(item => {
            const creator = getCreatorInfo(item.createdBy);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                  item.purchased 
                    ? 'bg-gray-50 opacity-75' 
                    : 'bg-white shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                      item.purchased 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-gray-300 hover:border-primary'
                    }`}
                    onClick={() => handleToggleItem(item)}
                  >
                    {item.purchased && <span className="text-xs">✓</span>}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium transition-all ${
                        item.purchased ? 'line-through text-gray-400' : 'text-text'
                      }`}>
                        {item.name}
                        <span className="ml-1 text-sm text-text-light">
                          ({item.quantity})
                        </span>
                      </span>
                      <span 
                        title={`Agregado por ${creator.name}`} 
                        className="text-lg opacity-75 hover:opacity-100"
                      >
                        {creator.emoji}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-sm text-text-light mt-1">{item.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="p-2 text-text-light hover:text-primary transition-colors rounded-full hover:bg-gray-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 text-text-light hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    );
  });

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">Lista de Compras</h1>
          <div className="flex gap-3">
            <Button 
              onClick={handleCopyList} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copiar Lista
            </Button>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Item
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <span className="text-lg animate-pulse">Cargando lista de compras...</span>
            </div>
          ) : (
            itemsByCategory
          )}
        </div>
      </div>

      <AddItemModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(undefined);
        }}
        onAdd={editingItem ? (item) => handleUpdateItem(editingItem, item) : handleAddItem}
        editItem={editingItem}
      />
    </PageContainer>
  );
};

export default ShoppingListPage;