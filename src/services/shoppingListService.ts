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
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { ShoppingItem, ShoppingList } from '../types/shoppingList';

const COLLECTION_NAME = 'shoppingLists';

const getUserListRef = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuario no autenticado');

  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', user.uid)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    // Si no existe una lista, crear una nueva
    const newListRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId: user.uid,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return newListRef;
  }

  // Retornar la referencia a la lista existente
  return doc(db, COLLECTION_NAME, querySnapshot.docs[0].id);
};

export const addItem = async (item: Omit<ShoppingItem, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<void> => {
  const listRef = await getUserListRef();
  const listSnap = await getDoc(listRef);
  const listData = listSnap.data() as ShoppingList;
  const user = auth.currentUser;
  if (!user?.email) throw new Error('Usuario no autenticado');

  const newItem: ShoppingItem = {
    ...item,
    id: crypto.randomUUID(),
    createdBy: user.email,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await updateDoc(listRef, {
    items: [...(listData.items || []), newItem],
    updatedAt: new Date()
  });
};

export const updateItem = async (itemId: string, updates: Partial<ShoppingItem>): Promise<void> => {
  const listRef = await getUserListRef();
  const listSnap = await getDoc(listRef);
  const listData = listSnap.data() as ShoppingList;

  const updatedItems = (listData.items || []).map(item => 
    item.id === itemId 
      ? { ...item, ...updates, updatedAt: new Date() }
      : item
  );

  await updateDoc(listRef, {
    items: updatedItems,
    updatedAt: new Date()
  });
};

export const deleteItem = async (itemId: string): Promise<void> => {
  const listRef = await getUserListRef();
  const listSnap = await getDoc(listRef);
  const listData = listSnap.data() as ShoppingList;

  await updateDoc(listRef, {
    items: (listData.items || []).filter(item => item.id !== itemId),
    updatedAt: new Date()
  });
};

export const getItems = async (): Promise<ShoppingItem[]> => {
  const listRef = await getUserListRef();
  const listSnap = await getDoc(listRef);
  const listData = listSnap.data() as ShoppingList;
  return listData?.items || [];
};

export const subscribeToShoppingList = (onUpdate: (items: ShoppingItem[]) => void) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuario no autenticado');

  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', user.uid)
  );
  
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const listData = snapshot.docs[0].data() as ShoppingList;
      onUpdate(listData?.items || []);
    } else {
      onUpdate([]);
    }
  });
};