import { useMemo, useState, useCallback, useEffect } from "react";
import { useStore } from "@/contexts/StoreContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { OrderCard } from "@/components/OrderCard";
import { Order, OrderStatus, Station } from "@/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, ChefHat, Wine, ScanLine, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useScanner } from "@/hooks/useScanner";
import { toast } from "sonner";

const COLUMNS: { status: OrderStatus; title: string; accent: string }[] = [
  { status: "received", title: "Recebidos", accent: "bg-kds-received" },
  { status: "preparing", title: "Em Preparo", accent: "bg-kds-preparing" },
  { status: "ready", title: "Prontos", accent: "bg-kds-ready" },
];

export default function KDS() {
  const { orders, updateOrderStatus, removeOrder } = useStore();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Lock view for kitchen/bar roles
  const lockedStation: Station | null =
    user?.role === "kitchen" ? "kitchen" : user?.role === "bar" ? "bar" : null;
  const [view, setView] = useState<Station>(lockedStation ?? "kitchen");

  useEffect(() => {
    if (lockedStation) setView(lockedStation);
  }, [lockedStation]);

  const handleLogout = () => { logout(); navigate("/"); };

  // Filter orders + items by current station view
  const filteredOrders = useMemo(() => {
    return orders
      .map((o) => ({
        order: o,
        items: o.items.filter((it) => it.station === view),
      }))
      .filter((x) => x.items.length > 0);
  }, [orders, view]);

  // QR scanner — Bar view only
  const handleScan = useCallback(
    (code: string) => {
      const trimmed = code.trim();
      // Match by full id or short id (first 6 chars)
      const found = orders.find(
        (o) => o.id === trimmed || o.id.slice(0, 6).toLowerCase() === trimmed.toLowerCase()
      );
      if (!found) {
        toast.error("Pedido não encontrado", { description: `Código: ${trimmed}` });
        return;
      }
      if (found.status !== "ready") {
        toast.warning("Pedido ainda não está pronto", {
          description: `${found.tableLabel} • status: ${found.status}`,
        });
        return;
      }
      updateOrderStatus(found.id, "delivered");
      toast.success("Pedido entregue!", { description: found.tableLabel });
    },
    [orders, updateOrderStatus]
  );

  useScanner(handleScan, view === "bar");

  return (
    <div className="min-h-screen kds-bg flex flex-col">
      <header className="flex items-center justify-between px-6 py-3 border-b border-border/20 gap-4">
        <div className="flex items-center gap-3">
          {view === "bar" ? <Wine className="h-6 w-6 text-primary" /> : <ChefHat className="h-6 w-6 text-primary" />}
          <span className="text-lg font-bold text-kds-card-foreground">
            Fluxe KDS <span className="text-muted-foreground font-normal">/ {view === "bar" ? "Bar" : "Cozinha"}</span>
          </span>
          {view === "bar" && (
            <span className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground bg-kds-card-bg/50 px-2 py-1 rounded-md ml-2">
              <ScanLine className="h-3.5 w-3.5" />
              Scanner ativo
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!lockedStation && (
            <Tabs value={view} onValueChange={(v) => setView(v as Station)}>
              <TabsList>
                <TabsTrigger value="kitchen" className="gap-1.5">
                  <ChefHat className="h-3.5 w-3.5" /> Cozinha
                </TabsTrigger>
                <TabsTrigger value="bar" className="gap-1.5">
                  <Wine className="h-3.5 w-3.5" /> Bar
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
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
          const colOrders = filteredOrders.filter((x) => x.order.status === col.status);
          return (
            <div key={col.status} className="kds-column-bg rounded-xl p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${col.accent}`} />
                <h2 className="text-lg font-bold text-kds-card-foreground">{col.title}</h2>
                <span className="ml-auto text-sm font-mono text-muted-foreground">{colOrders.length}</span>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto">
                {colOrders.map(({ order, items }) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    items={items}
                    onAdvance={updateOrderStatus}
                    onRemove={removeOrder}
                  />
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
