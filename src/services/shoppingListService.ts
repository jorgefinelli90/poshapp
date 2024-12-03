import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ShoppingItem, ShoppingList } from '../types/shoppingList';

const COLLECTION_NAME = 'shoppingLists';

export const createShoppingList = async (userId: string): Promise<void> => {
  await addDoc(collection(db, COLLECTION_NAME), {
    userId,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const addItem = async (listId: string, item: Omit<ShoppingItem, 'id'>): Promise<void> => {
  const listRef = doc(db, COLLECTION_NAME, listId);
  await updateDoc(listRef, {
    items: [...(await getItems(listId)), { ...item, id: crypto.randomUUID() }],
    updatedAt: new Date()
  });
};

export const getItems = async (listId: string): Promise<ShoppingItem[]> => {
  const listRef = doc(db, COLLECTION_NAME, listId);
  const listSnap = await getDocs(collection(db, COLLECTION_NAME));
  const list = listSnap.docs[0]?.data() as ShoppingList;
  return list?.items || [];
};