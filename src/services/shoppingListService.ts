import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, ShoppingList } from '../types/shopping';

const COLLECTION_NAME = 'shoppingLists';

export const createShoppingList = async (userId: string, name: string): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    name,
    userId,
    products: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return docRef.id;
};

export const addProduct = async (listId: string, product: Omit<Product, 'id'>): Promise<void> => {
  const listRef = doc(db, COLLECTION_NAME, listId);
  await updateDoc(listRef, {
    products: [...(await getProducts(listId)), { ...product, id: crypto.randomUUID() }],
    updatedAt: new Date()
  });
};

export const updateProduct = async (listId: string, productId: string, updates: Partial<Product>): Promise<void> => {
  const listRef = doc(db, COLLECTION_NAME, listId);
  const products = await getProducts(listId);
  const updatedProducts = products.map(product => 
    product.id === productId ? { ...product, ...updates } : product
  );
  await updateDoc(listRef, {
    products: updatedProducts,
    updatedAt: new Date()
  });
};

export const deleteProduct = async (listId: string, productId: string): Promise<void> => {
  const listRef = doc(db, COLLECTION_NAME, listId);
  const products = await getProducts(listId);
  await updateDoc(listRef, {
    products: products.filter(product => product.id !== productId),
    updatedAt: new Date()
  });
};

export const getProducts = async (listId: string): Promise<Product[]> => {
  const listRef = doc(db, COLLECTION_NAME, listId);
  const listSnap = await getDocs(query(collection(db, COLLECTION_NAME), where('id', '==', listId)));
  const list = listSnap.docs[0]?.data() as ShoppingList;
  return list?.products || [];
};