import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Grid3X3 } from "lucide-react";

export default function TableManagement() {
  const { tables, addTable, deleteTable } = useStore();
  const [label, setLabel] = useState("");

  const handleAdd = () => {
    if (!label.trim()) return;
    const num = tables.length + 1;
    addTable(num, label.trim());
    setLabel("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mesas & Comandas</h1>
      <div className="flex gap-2 max-w-md">
        <Input placeholder="Ex: Mesa 6, Balcão A..." value={label} onChange={(e) => setLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
        <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-1" />Adicionar</Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {tables.map((t) => (
          <Card key={t.id}>
            <CardContent className="flex items-center justify-between py-4 px-5">
              <div className="flex items-center gap-3">
                <Grid3X3 className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{t.label}</span>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteTable(t.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
