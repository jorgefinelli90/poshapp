import { useState, useEffect } from 'react';
import { Product } from '../types/shopping';
import * as shoppingListService from '../services/shoppingListService';
import { useAuthContext } from '../context/AuthContext';

export const useShoppingList = (listId: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!user) return;
        const fetchedProducts = await shoppingListService.getProducts(listId);
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Failed to fetch products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [listId, user]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await shoppingListService.addProduct(listId, product);
      const updatedProducts = await shoppingListService.getProducts(listId);
      setProducts(updatedProducts);
    } catch (err) {
      setError('Failed to add product');
      console.error(err);
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      await shoppingListService.updateProduct(listId, productId, updates);
      const updatedProducts = await shoppingListService.getProducts(listId);
      setProducts(updatedProducts);
    } catch (err) {
      setError('Failed to update product');
      console.error(err);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await shoppingListService.deleteProduct(listId, productId);
      const updatedProducts = await shoppingListService.getProducts(listId);
      setProducts(updatedProducts);
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct
  };
};