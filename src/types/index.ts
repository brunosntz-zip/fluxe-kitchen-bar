export type UserRole = "manager" | "kitchen";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

export interface Table {
  id: string;
  number: number;
  label: string;
}

export type OrderStatus = "received" | "preparing" | "ready";

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  tableLabel: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  notes?: string;
}
