import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  onSnapshot,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { ShoppingItem, ShoppingList } from '../types/shoppingList';
import { v4 as uuidv4 } from 'uuid';

const COLLECTION_NAME = 'shoppingLists';
const SHARED_LIST_ID = 'shared-list'; // ID fijo para la lista compartida

// Inicializar la lista compartida si no existe
const initializeSharedList = async () => {
  const listRef = doc(db, COLLECTION_NAME, SHARED_LIST_ID);
  const listSnap = await getDoc(listRef);
  
  if (!listSnap.exists()) {
    console.log('Inicializando lista compartida...');
    await setDoc(listRef, {
      id: SHARED_LIST_ID,
      items: [],
      updatedAt: serverTimestamp()
    });
  }
};

// Suscribirse a la lista compartida
export const subscribeToShoppingList = (onUpdate: (items: ShoppingItem[]) => void) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuario no autenticado');

  // Asegurarse de que la lista compartida existe
  initializeSharedList();

  const listRef = doc(db, COLLECTION_NAME, SHARED_LIST_ID);
  console.log('Suscribiendo a la lista compartida...');
  
  return onSnapshot(
    listRef,
    {
      next: (snapshot) => {
        const data = snapshot.data() as ShoppingList;
        console.log('Datos actualizados recibidos:', data);
        onUpdate(data?.items || []);
      },
      error: (error) => {
        console.error('Error en la suscripción:', error);
      }
    }
  );
};

// Agregar un item
export const addItem = async (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuario no autenticado');

  const listRef = doc(db, COLLECTION_NAME, SHARED_LIST_ID);
  const listSnap = await getDoc(listRef);
  
  if (!listSnap.exists()) {
    await initializeSharedList();
  }

  const listData = (await getDoc(listRef)).data() as ShoppingList;
  const now = new Date().toISOString();
  const newItem: ShoppingItem = {
    ...item,
    id: uuidv4(),
    createdBy: user.email || undefined,
    createdAt: now,
    updatedAt: now
  };

  console.log('Agregando nuevo item:', newItem);

  await updateDoc(listRef, {
    items: [...(listData?.items || []), newItem],
    updatedAt: serverTimestamp()
  });
};

// Actualizar un item
export const updateItem = async (itemId: string, updates: Partial<ShoppingItem>) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuario no autenticado');

  const listRef = doc(db, COLLECTION_NAME, SHARED_LIST_ID);
  const listSnap = await getDoc(listRef);
  
  if (!listSnap.exists()) {
    console.error('Lista no encontrada');
    return;
  }
  
  const listData = listSnap.data() as ShoppingList;
  const now = new Date().toISOString();
  
  const updatedItems = listData.items.map(item => 
    item.id === itemId 
      ? { ...item, ...updates, updatedAt: now }
      : item
  );

  console.log('Actualizando item:', itemId);

  await updateDoc(listRef, {
    items: updatedItems,
    updatedAt: serverTimestamp()
  });
};

// Eliminar un item
export const deleteItem = async (itemId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuario no autenticado');

  const listRef = doc(db, COLLECTION_NAME, SHARED_LIST_ID);
  const listSnap = await getDoc(listRef);
  
  if (!listSnap.exists()) {
    console.error('Lista no encontrada');
    return;
  }
  
  const listData = listSnap.data() as ShoppingList;
  const updatedItems = listData.items.filter(item => item.id !== itemId);

  console.log('Eliminando item:', itemId);

  await updateDoc(listRef, {
    items: updatedItems,
    updatedAt: serverTimestamp()
  });
};