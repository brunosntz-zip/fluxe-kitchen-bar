import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = ["Lanches", "Porções", "Bebidas", "Pratos", "Sobremesas"];

export default function MenuManagement() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useStore();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", price: "", category: CATEGORIES[0] });

  const resetForm = () => { setForm({ name: "", price: "", category: CATEGORIES[0] }); setEditId(null); };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    if (editId) {
      updateMenuItem(editId, { name: form.name, price: parseFloat(form.price), category: form.category });
    } else {
      addMenuItem({ name: form.name, price: parseFloat(form.price), category: form.category, available: true });
    }
    resetForm();
    setOpen(false);
  };

  const handleEdit = (id: string) => {
    const item = menuItems.find((i) => i.id === id);
    if (!item) return;
    setForm({ name: item.name, price: item.price.toString(), category: item.category });
    setEditId(id);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cardápio</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Novo Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Editar Item" : "Novo Item"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label>Nome</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: X-Burger" />
              </div>
              <div className="space-y-1">
                <Label>Preço (R$)</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
              </div>
              <div className="space-y-1">
                <Label>Categoria</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                <Button onClick={handleSave}>Salvar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {menuItems.map((item) => (
          <Card key={item.id} className={`transition-opacity ${!item.available ? "opacity-50" : ""}`}>
            <CardContent className="flex items-center justify-between py-4 px-5">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                    <span className="text-sm text-muted-foreground">R$ {item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{item.available ? "Disponível" : "Esgotado"}</span>
                  <Switch checked={item.available} onCheckedChange={(v) => updateMenuItem(item.id, { available: v })} />
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(item.id)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMenuItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
