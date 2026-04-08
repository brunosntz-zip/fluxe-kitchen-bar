import { useStore } from "@/contexts/StoreContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { OrderCard } from "@/components/OrderCard";
import { OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { LogOut, ChefHat } from "lucide-react";

const COLUMNS: { status: OrderStatus; title: string; accent: string }[] = [
  { status: "received", title: "Recebidos", accent: "bg-kds-received" },
  { status: "preparing", title: "Em Preparo", accent: "bg-kds-preparing" },
  { status: "ready", title: "Prontos", accent: "bg-kds-ready" },
];

export default function KDS() {
  const { orders, updateOrderStatus, removeOrder } = useStore();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen kds-bg flex flex-col">
      <header className="flex items-center justify-between px-6 py-3 border-b border-border/20">
        <div className="flex items-center gap-3">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-kds-card-foreground">Fluxe KDS</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user?.name}</span>
          {user?.role === "manager" && (
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => navigate("/admin")}>
              Admin
            </Button>
          )}
          <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-auto">
        {COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.status);
          return (
            <div key={col.status} className="kds-column-bg rounded-xl p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${col.accent}`} />
                <h2 className="text-lg font-bold text-kds-card-foreground">{col.title}</h2>
                <span className="ml-auto text-sm font-mono text-muted-foreground">{colOrders.length}</span>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto">
                {colOrders.map((order) => (
                  <OrderCard key={order.id} order={order} onAdvance={updateOrderStatus} onRemove={removeOrder} />
                ))}
                {colOrders.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8 opacity-50">
                    Nenhum pedido
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
