import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ChefHat, LogIn } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await login(username, password);
      
      if (user.role === "manager") navigate("/admin");
      else if (user.role === "receptionist") navigate("/admin/reception");
      else navigate("/kds");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login.");
    } finally {
      setIsLoading(false);
    }
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
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input 
                id="username" 
                placeholder="Ex: admin" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password"
                placeholder="***" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              <LogIn className="mr-2 h-4 w-4" /> Entrar
            </Button>
            
            <div className="text-xs text-muted-foreground w-full p-3 bg-muted/50 rounded-lg">
              <p className="font-semibold mb-1">Credenciais de Teste:</p>
              <ul className="space-y-1">
                <li>Usuário: <b>admin</b> | Senha: <b>123</b> (Gerente)</li>
                <li>Usuário: <b>recepcao</b> | Senha: <b>123</b> (Recepção)</li>
                <li>Usuário: <b>cozinha</b> | Senha: <b>123</b> (Cozinha)</li>
                <li>Usuário: <b>bar</b> | Senha: <b>123</b> (Bar)</li>
              </ul>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
