import React, { createContext, useContext, useState, useCallback } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, User> = {
  manager: { id: "1", name: "Carlos", role: "manager" },
  kitchen: { id: "2", name: "Chef Ana", role: "kitchen" },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("fluxe_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((name: string, role: UserRole) => {
    const u: User = { id: crypto.randomUUID(), name, role };
    setUser(u);
    localStorage.setItem("fluxe_user", JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("fluxe_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
