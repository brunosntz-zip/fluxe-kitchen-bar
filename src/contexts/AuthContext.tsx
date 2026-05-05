import React, { createContext, useContext, useState, useCallback } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (username: string, password?: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Extendendo User para testes com senha local
type MockUser = User & { password?: string };

export const MOCK_USERS: MockUser[] = [
  { id: "1", username: "admin", password: "123", name: "Carlos Admin", role: "manager" },
  { id: "2", username: "recepcao", password: "123", name: "Maria Recepção", role: "receptionist" },
  { id: "3", username: "cozinha", password: "123", name: "Chef Ana", role: "kitchen" },
  { id: "4", username: "bar", password: "123", name: "João Bar", role: "bar" }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("fluxe_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (username: string, password?: string) => {
    const foundUser = MOCK_USERS.find(u => u.username === username && u.password === password);
    if (!foundUser) {
      throw new Error("Usuário ou senha inválidos.");
    }
    
    // Remover a senha do objeto de usuário logado
    const { password: _, ...userWithoutPassword } = foundUser;
    
    setUser(userWithoutPassword);
    localStorage.setItem("fluxe_user", JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
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
