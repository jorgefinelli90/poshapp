import { Category } from '../types/shopping';
import { Apple, Baby, Beef, Book, Coffee, Cookie, Flower, Gift, Laptop, Shirt, Shower, Tools } from 'lucide-react';

export const categories: Category[] = [
  { id: 'groceries', name: 'Groceries', icon: 'Apple' },
  { id: 'household', name: 'Household', icon: 'Shower' },
  { id: 'electronics', name: 'Electronics', icon: 'Laptop' },
  { id: 'clothing', name: 'Clothing', icon: 'Shirt' },
  { id: 'baby', name: 'Baby', icon: 'Baby' },
  { id: 'tools', name: 'Tools', icon: 'Tools' },
  { id: 'gifts', name: 'Gifts', icon: 'Gift' },
  { id: 'books', name: 'Books', icon: 'Book' },
  { id: 'food', name: 'Food', icon: 'Cookie' },
  { id: 'drinks', name: 'Drinks', icon: 'Coffee' },
  { id: 'meat', name: 'Meat', icon: 'Beef' },
  { id: 'other', name: 'Other', icon: 'Flower' },
];