import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Target, ShoppingBag, MessageCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PageContainer from '../components/layout/PageContainer';
import { subscribeToShoppingList } from '../services/shoppingListService';
import { memoryService } from '../services/memoryService';
import { useAuthContext } from '../context/AuthContext';
import { ShoppingItem } from '../types/shoppingList';
import { Memory } from '../types/Memory';
import EventsList from '../components/calendar/EventsList';
import { eventService } from '../services/eventService';
import { EventInput } from '@fullcalendar/core';
import './Home.css';

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
  const [memories, setMemories] = useState<Memory[]>([]);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [lastChange, setLastChange] = useState<{ item: ShoppingItem; action: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMemories, setIsLoadingMemories] = useState(true);

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    const unsubscribe = subscribeToShoppingList((newItems) => {
      setItems(newItems);
      setIsLoading(false);

      if (newItems.length > 0) {
        const mostRecent = newItems.reduce((prev, current) => {
          return (current.updatedAt > prev.updatedAt) ? current : prev;
        });
        setLastChange({ item: mostRecent, action: 'actualizó' });
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const loadMemories = async () => {
      try {
        setIsLoadingMemories(true);
        const recentMemories = await memoryService.getMemories();
        setMemories(recentMemories.slice(0, 5)); // Mostramos las 5 memorias más recientes
      } catch (error) {
        console.error('Error loading memories:', error);
      } finally {
        setIsLoadingMemories(false);
      }
    };

    if (user) {
      loadMemories();
    }
  }, [user]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await eventService.getEvents();
        setEvents(fetchedEvents.map(event => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          allDay: event.allDay,
          backgroundColor: getEventColor(event.type)
        })));
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };

    fetchEvents();
  }, []);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'cita': return '#FF5733';
      case 'aniversario': return '#FFC300';
      case 'plan': return '#DAF7A6';
      case 'compra': return '#C70039';
      case 'viaje': return '#900C3F';
      default: return '#378006';
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "linear-gradient(rgb(255 255 255 / 88%), rgb(255 255 255 / 10%)), url('https://firebasestorage.googleapis.com/v0/b/accfit-4d42e.appspot.com/o/background.jpg?alt=media&token=384fe9c9-99d8-41a6-a26a-8626876a5698')"
      }}
    >
      <PageContainer>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Posh App</h1>
          <Heart className="text-primary" size={24} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <Target className="text-primary mb-2" size={24} />
            <h3 className="font-semibold mb-2">Objetivos</h3>
            <p className="text-sm text-text-light">2 pending</p>
          </Card>
          <Link to="/shopping" className="block">
            <Card className="cursor-pointer transition-all hover:shadow-md h-full">
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

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Ultimos mensajes:</h2>
            <Link to="/memories" className="text-primary text-sm">
              Ver todos
            </Link>
          </div>
          <div className="h-[40vh] overflow-y-auto space-y-4 pb-4">
            {isLoadingMemories ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
              </div>
            ) : memories.length > 0 ? (
              memories.map((memory) => (
                <Card key={memory.id} className="cursor-pointer hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{memory.authorName}</p>
                      <p className="text-sm text-text-light">
                        {formatTimeAgo(memory.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm mb-3 line-clamp-3">{memory.text}</p>
                  <div className="flex items-center gap-4 text-sm text-text-light">
                    <span className="flex items-center gap-1">
                      <Heart 
                        size={14} 
                        className={memory.likes.includes(user?.uid || '') ? 'fill-primary text-primary' : ''}
                      />
                      {memory.likes.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      {memory.comments.length}
                    </span>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="text-center py-8">
                <p className="text-text-light mb-4">No hay memorias aún</p>
                <Link to="/memories">
                  <Button>
                    Create Memory
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>

        <EventsList events={events} className="mt-4" />
      </PageContainer>
    </div>
  );
};

export default Home;