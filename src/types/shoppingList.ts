export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  notes?: string;
  purchased: boolean;
  createdBy?: string; // email del usuario que creó el item
  createdAt: any;
  updatedAt: any;
}

export interface ShoppingList {
  id: string;
  items: ShoppingItem[];
  updatedAt: any;
}