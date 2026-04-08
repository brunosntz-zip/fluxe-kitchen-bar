import { useStore } from "@/contexts/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Clock, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const { orders, menuItems } = useStore();

  const activeOrders = orders.filter((o) => o.status !== "ready").length;
  const todayRevenue = orders.reduce((sum, o) => {
    return sum + o.items.reduce((s, item) => {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId);
      return s + (menuItem?.price ?? 0) * item.quantity;
    }, 0);
  }, 0);

  const stats = [
    { label: "Vendas do Dia", value: `R$ ${todayRevenue.toFixed(2)}`, icon: DollarSign, accent: "text-kds-received" },
    { label: "Pedidos Ativos", value: activeOrders, icon: ShoppingBag, accent: "text-primary" },
    { label: "Recebidos", value: orders.filter((o) => o.status === "received").length, icon: Clock, accent: "text-kds-preparing" },
    { label: "Prontos", value: orders.filter((o) => o.status === "ready").length, icon: CheckCircle, accent: "text-kds-ready" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Visão Geral</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.accent}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
