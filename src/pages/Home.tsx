import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Target, ShoppingBag } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PageContainer from '../components/layout/PageContainer';
import { subscribeToShoppingList } from '../services/shoppingListService';
import { useAuthContext } from '../context/AuthContext';
import { ShoppingItem } from '../types/shoppingList';

const formatTimeAgo = (timestamp: any) => {
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  if (!date || isNaN(date.getTime())) return 'fecha desconocida';

  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'hace un momento';
  if (diffInMinutes < 60) return `hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
};

const getCreatorInfo = (email: string | undefined) => {
  if (!email) return { name: 'Desconocido', emoji: '👤' };
  const emailLower = email.toLowerCase();
  if (emailLower.startsWith('j')) {
    return { name: 'Jorge', emoji: '👨' };
  } else if (emailLower.startsWith('n')) {
    return { name: 'Nhorie', emoji: '👩' };
  }
  return { name: email, emoji: '👤' };
};

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [lastChange, setLastChange] = useState<{ item: ShoppingItem; action: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    const unsubscribe = subscribeToShoppingList((newItems) => {
      setItems(newItems);
      setIsLoading(false);

      // Actualizar último cambio
      if (newItems.length > 0) {
        const mostRecent = newItems.reduce((prev, current) => {
          return (current.updatedAt > prev.updatedAt) ? current : prev;
        });
        setLastChange({ item: mostRecent, action: 'actualizó' });
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Posh App</h1>
        <Heart className="text-primary" size={24} />
      </div>
      
      <Card className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Today's Memory</h2>
        <p className="text-text-light">Share a special moment from your day...</p>
        <Button className="mt-4 w-full">
          Create Memory
        </Button>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <Target className="text-primary mb-2" size={24} />
          <h3 className="font-semibold mb-2">Goals</h3>
          <p className="text-sm text-text-light">2 pending</p>
        </Card>
        <Link to="/shopping" className="block">
          <Card className="cursor-pointer transition-all hover:shadow-md">
            <ShoppingBag className="text-primary mb-2" size={24} />
            <h3 className="font-semibold mb-2">Shopping List</h3>
            <p className="text-sm text-text-light">
              {isLoading ? (
                <span className="inline-block animate-pulse">Cargando...</span>
              ) : (
                `${items.length} ${items.length === 1 ? 'item' : 'items'}`
              )}
            </p>
            {!isLoading && lastChange && (
              <p className="text-xs text-text-light mt-1">
                {formatTimeAgo(lastChange.item.updatedAt)}, {getCreatorInfo(lastChange.item.createdBy).name} {lastChange.action} un producto
              </p>
            )}
          </Card>
        </Link>
      </div>
    </PageContainer>
  );
};

export default Home;