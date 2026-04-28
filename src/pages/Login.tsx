import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChefHat, ShieldCheck, Wine, Users } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleLogin = (role: UserRole) => {
    const fallback =
      role === "manager" ? "Gerente" :
      role === "bar" ? "Bar" :
      role === "receptionist" ? "Recepção" : "Cozinha";
    const displayName = name.trim() || fallback;
    login(displayName, role);
    if (role === "manager") navigate("/admin");
    else if (role === "receptionist") navigate("/admin/reception");
    else navigate("/kds");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <ChefHat className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Fluxe</CardTitle>
          <CardDescription>Sistema de Gestão para Bares e Restaurantes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Seu nome (opcional)</Label>
            <Input id="name" placeholder="Ex: Carlos" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => handleLogin("manager")} className="h-20 flex-col gap-2" variant="default">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-semibold">Gerente</span>
            </Button>
            <Button onClick={() => handleLogin("receptionist")} className="h-20 flex-col gap-2" variant="default">
              <Users className="h-5 w-5" />
              <span className="text-xs font-semibold">Recepção</span>
            </Button>
            <Button onClick={() => handleLogin("kitchen")} className="h-20 flex-col gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80" variant="secondary">
              <ChefHat className="h-5 w-5" />
              <span className="text-xs font-semibold">Cozinha</span>
            </Button>
            <Button onClick={() => handleLogin("bar")} className="h-20 flex-col gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80" variant="secondary">
              <Wine className="h-5 w-5" />
              <span className="text-xs font-semibold">Bar</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Cada perfil é direcionado para sua área de trabalho.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
