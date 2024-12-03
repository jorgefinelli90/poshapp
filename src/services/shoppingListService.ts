import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ShoppingItem, ShoppingList } from '../types/shoppingList';

const COLLECTION_NAME = 'shoppingLists';

export const createShoppingList = async (userId: string): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    userId,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return docRef.id;
};

export const addItem = async (listId: string, item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
  const listRef = doc(db, COLLECTION_NAME, listId);
  const newItem: ShoppingItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const currentItems = await getItems(listId);
  await updateDoc(listRef, {
    items: [...currentItems, newItem],
    updatedAt: new Date()
  });
};

export const updateItem = async (listId: string, itemId: string, updates: Partial<ShoppingItem>): Promise<void> => {
  const listRef = doc(db, COLLECTION_NAME, listId);
  const currentItems = await getItems(listId);
  
  const updatedItems = currentItems.map(item => 
    item.id === itemId 
      ? { ...item, ...updates, updatedAt: new Date() }
      : item
  );

  await updateDoc(listRef, {
    items: updatedItems,
    updatedAt: new Date()
  });
};

export const deleteItem = async (listId: string, itemId: string): Promise<void> => {
  const listRef = doc(db, COLLECTION_NAME, listId);
  const currentItems = await getItems(listId);
  
  await updateDoc(listRef, {
    items: currentItems.filter(item => item.id !== itemId),
    updatedAt: new Date()
  });
};

export const getItems = async (listId: string): Promise<ShoppingItem[]> => {
  const listRef = doc(db, COLLECTION_NAME, listId);
  const q = query(collection(db, COLLECTION_NAME), where('userId', '==', listId));
  const querySnapshot = await getDocs(q);
  const list = querySnapshot.docs[0]?.data() as ShoppingList;
  return list?.items || [];
};

export const subscribeToShoppingList = (
  userId: string,
  onUpdate: (items: ShoppingItem[]) => void
) => {
  const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId));
  
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs[0]?.data() as ShoppingList;
    onUpdate(list?.items || []);
  });
};