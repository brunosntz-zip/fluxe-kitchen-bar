import { useEffect, useState } from "react";
import { Order, OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, AlertTriangle, CheckCircle } from "lucide-react";

function useTimer(start: Date) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const update = () => setElapsed(Math.floor((Date.now() - new Date(start).getTime()) / 1000));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [start]);
  const min = Math.floor(elapsed / 60);
  const sec = elapsed % 60;
  return { elapsed, display: `${min}:${sec.toString().padStart(2, "0")}` };
}

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  received: "preparing",
  preparing: "ready",
  ready: null,
};

const STATUS_CONFIG = {
  received: { label: "Recebido", btnLabel: "Preparar", border: "border-l-kds-received", timerColor: "text-kds-received", icon: Clock },
  preparing: { label: "Em Preparo", btnLabel: "Pronto", border: "border-l-kds-preparing", timerColor: "text-kds-preparing", icon: AlertTriangle },
  ready: { label: "Pronto", btnLabel: "", border: "border-l-kds-ready", timerColor: "text-kds-ready", icon: CheckCircle },
};

interface OrderCardProps {
  order: Order;
  onAdvance: (id: string, status: OrderStatus) => void;
  onRemove: (id: string) => void;
}

export function OrderCard({ order, onAdvance, onRemove }: OrderCardProps) {
  const { elapsed, display } = useTimer(order.createdAt);
  const config = STATUS_CONFIG[order.status];
  const next = NEXT_STATUS[order.status];
  const isLate = elapsed > 600; // > 10min

  return (
    <div className={`kds-card-bg rounded-xl border-l-4 ${isLate && order.status !== "ready" ? "border-l-kds-late animate-pulse-slow" : config.border} p-4 space-y-3 transition-all`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xl font-extrabold leading-none">{order.tableLabel}</p>
          <p className="text-xs text-muted-foreground mt-1">#{order.id.slice(0, 6)}</p>
        </div>
        <div className={`flex items-center gap-1.5 text-sm font-mono font-bold ${isLate && order.status !== "ready" ? "text-kds-late" : config.timerColor}`}>
          <Clock className="h-3.5 w-3.5" />
          {display}
        </div>
      </div>

      <ul className="space-y-1.5">
        {order.items.map((item, i) => (
          <li key={i} className="text-sm">
            <span className="font-semibold">{item.quantity}x</span>{" "}
            <span>{item.name}</span>
            {item.notes && (
              <span className="block text-xs text-kds-preparing font-medium ml-5">⚠ {item.notes}</span>
            )}
          </li>
        ))}
      </ul>

      {order.notes && (
        <div className="text-xs bg-kds-preparing/10 text-kds-preparing rounded-md px-3 py-1.5 font-medium">
          📌 {order.notes}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        {next && (
          <Button
            onClick={() => onAdvance(order.id, next)}
            className="flex-1 h-12 text-base font-bold"
            variant={order.status === "received" ? "default" : "secondary"}
          >
            {config.btnLabel}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
        {order.status === "ready" && (
          <Button onClick={() => onRemove(order.id)} className="flex-1 h-12 text-base font-bold bg-kds-ready hover:bg-kds-ready/80 text-primary-foreground">
            Entregue ✓
          </Button>
        )}
      </div>
    </div>
  );
}
