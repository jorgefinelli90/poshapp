export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  products: Product[];
  createdAt: Date;
  updatedAt: Date;
}