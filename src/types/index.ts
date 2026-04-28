export type UserRole = "manager" | "kitchen" | "bar";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export type Station = "bar" | "kitchen";
export type DeliveryMode = "table" | "pickup";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
  station?: Station;
}

export interface Table {
  id: string;
  number: number;
  label: string;
}

export type OrderStatus = "received" | "preparing" | "ready" | "delivered";

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  notes?: string;
  station: Station;
}

export interface Order {
  id: string;
  tableNumber?: number;
  tableLabel: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  notes?: string;
  deliveryMode: DeliveryMode;
}
