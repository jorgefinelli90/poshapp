export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  notes?: string;
  purchased: boolean;
  createdBy?: string; // email del usuario que creó el item
  createdAt: Date;
  updatedAt: Date;
}

export interface ShoppingList {
  id: string;
  userId: string;
  items: ShoppingItem[];
  createdAt: Date;
  updatedAt: Date;
}