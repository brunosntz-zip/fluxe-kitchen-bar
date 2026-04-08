import React, { createContext, useContext, useState, useCallback } from "react";
import { MenuItem, Table, Order, OrderStatus, OrderItem } from "@/types";

interface StoreContextType {
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  tables: Table[];
  addTable: (number: number, label: string) => void;
  deleteTable: (id: string) => void;
  orders: Order[];
  addOrder: (tableNumber: number, tableLabel: string, items: OrderItem[], notes?: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  removeOrder: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const INITIAL_MENU: MenuItem[] = [
  { id: "1", name: "X-Burger Artesanal", price: 32.9, category: "Lanches", available: true },
  { id: "2", name: "Batata Frita Grande", price: 18.5, category: "Porções", available: true },
  { id: "3", name: "Caipirinha de Limão", price: 22.0, category: "Bebidas", available: true },
  { id: "4", name: "Picanha na Chapa", price: 59.9, category: "Pratos", available: true },
  { id: "5", name: "Coca-Cola 350ml", price: 8.0, category: "Bebidas", available: false },
  { id: "6", name: "Brownie com Sorvete", price: 24.0, category: "Sobremesas", available: true },
];

const INITIAL_TABLES: Table[] = [
  { id: "1", number: 1, label: "Mesa 1" },
  { id: "2", number: 2, label: "Mesa 2" },
  { id: "3", number: 3, label: "Mesa 3" },
  { id: "4", number: 4, label: "Mesa 4" },
  { id: "5", number: 5, label: "Mesa 5" },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "o1", tableNumber: 1, tableLabel: "Mesa 1", status: "received",
    createdAt: new Date(Date.now() - 3 * 60000),
    items: [
      { menuItemId: "1", name: "X-Burger Artesanal", quantity: 2, notes: "Sem cebola" },
      { menuItemId: "2", name: "Batata Frita Grande", quantity: 1 },
    ],
    notes: "Cliente com pressa",
  },
  {
    id: "o2", tableNumber: 3, tableLabel: "Mesa 3", status: "received",
    createdAt: new Date(Date.now() - 8 * 60000),
    items: [
      { menuItemId: "4", name: "Picanha na Chapa", quantity: 1 },
      { menuItemId: "3", name: "Caipirinha de Limão", quantity: 2 },
    ],
  },
  {
    id: "o3", tableNumber: 2, tableLabel: "Mesa 2", status: "preparing",
    createdAt: new Date(Date.now() - 15 * 60000),
    items: [
      { menuItemId: "6", name: "Brownie com Sorvete", quantity: 3 },
    ],
    notes: "Aniversário - colocar vela",
  },
  {
    id: "o4", tableNumber: 5, tableLabel: "Mesa 5", status: "ready",
    createdAt: new Date(Date.now() - 20 * 60000),
    items: [
      { menuItemId: "1", name: "X-Burger Artesanal", quantity: 1 },
      { menuItemId: "2", name: "Batata Frita Grande", quantity: 1 },
      { menuItemId: "3", name: "Caipirinha de Limão", quantity: 1 },
    ],
  },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const addMenuItem = useCallback((item: Omit<MenuItem, "id">) => {
    setMenuItems((prev) => [...prev, { ...item, id: crypto.randomUUID() }]);
  }, []);

  const updateMenuItem = useCallback((id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  }, []);

  const deleteMenuItem = useCallback((id: string) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const addTable = useCallback((number: number, label: string) => {
    setTables((prev) => [...prev, { id: crypto.randomUUID(), number, label }]);
  }, []);

  const deleteTable = useCallback((id: string) => {
    setTables((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addOrder = useCallback((tableNumber: number, tableLabel: string, items: OrderItem[], notes?: string) => {
    setOrders((prev) => [
      ...prev,
      { id: crypto.randomUUID(), tableNumber, tableLabel, items, status: "received", createdAt: new Date(), notes },
    ]);
  }, []);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  const removeOrder = useCallback((id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }, []);

  return (
    <StoreContext.Provider value={{ menuItems, addMenuItem, updateMenuItem, deleteMenuItem, tables, addTable, deleteTable, orders, addOrder, updateOrderStatus, removeOrder }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
