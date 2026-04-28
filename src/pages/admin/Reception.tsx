import { useState, useMemo, useRef, useEffect } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { isValidCPF, formatCPF, cleanCPF } from "@/lib/cpf";
import { Search, UserPlus, LogOut, Radio } from "lucide-react";

function timeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h${m > 0 ? ` ${m}min` : ""}`;
}

export default function Reception() {
  const { customers, addCustomer, checkOutCustomer } = useStore();
  const [tab, setTab] = useState("new");

  // Form state
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [tabNumber, setTabNumber] = useState("");
  const [rfid, setRfid] = useState("");
  const rfidRef = useRef<HTMLInputElement>(null);
  const tabRef = useRef<HTMLInputElement>(null);

  // Search
  const [search, setSearch] = useState("");

  const activeCustomers = useMemo(() => customers.filter((c) => c.active), [customers]);

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return activeCustomers;
    return activeCustomers.filter(
      (c) => c.tabNumber.toLowerCase().includes(q) || c.fullName.toLowerCase().includes(q),
    );
  }, [activeCustomers, search]);

  // RFID scanner-style listener: when RFID input is focused, auto-submit on Enter
  useEffect(() => {
    const el = rfidRef.current;
    if (!el) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && document.activeElement === el) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName, cpf, birthDate, tabNumber, rfid]);

  const resetForm = () => {
    setFullName(""); setCpf(""); setBirthDate(""); setTabNumber(""); setRfid("");
  };

  const handleSave = () => {
    if (!fullName.trim()) {
      toast.error("Informe o nome completo");
      return;
    }
    if (!isValidCPF(cpf)) {
      toast.error("CPF inválido");
      return;
    }
    if (!tabNumber.trim()) {
      toast.error("Número da comanda é obrigatório");
      return;
    }
    const duplicate = activeCustomers.find((c) => c.tabNumber === tabNumber.trim());
    if (duplicate) {
      toast.error(`Comanda ${tabNumber} já está em uso por ${duplicate.fullName}`);
      return;
    }
    const dupCpf = activeCustomers.find((c) => cleanCPF(c.cpf) === cleanCPF(cpf));
    if (dupCpf) {
      toast.error("Cliente com este CPF já está ativo");
      return;
    }

    addCustomer({
      fullName: fullName.trim(),
      cpf: formatCPF(cpf),
      birthDate,
      tabNumber: tabNumber.trim(),
      rfid: rfid.trim() || undefined,
    });
    toast.success(`${fullName} entrou — Comanda ${tabNumber}`);
    resetForm();
    setTab("active");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Recepção</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="new"><UserPlus className="h-4 w-4 mr-2" />Novo Cliente</TabsTrigger>
          <TabsTrigger value="active">Comandas Ativas <Badge variant="secondary" className="ml-2">{activeCustomers.length}</Badge></TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cadastro de Entrada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} autoFocus />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth">Data de Nascimento</Label>
                  <Input id="birth" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tab">Número da Comanda *</Label>
                  <Input
                    id="tab"
                    ref={tabRef}
                    value={tabNumber}
                    onChange={(e) => setTabNumber(e.target.value)}
                    placeholder="Ex: 042"
                    maxLength={20}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="rfid" className="flex items-center gap-2">
                    <Radio className="h-4 w-4" /> RFID / Tag (Opcional)
                  </Label>
                  <Input
                    id="rfid"
                    ref={rfidRef}
                    value={rfid}
                    onChange={(e) => setRfid(e.target.value)}
                    placeholder="Aproxime a tag ou digite o código"
                  />
                  <p className="text-xs text-muted-foreground">
                    Com foco neste campo, aproxime a tag — o cadastro é salvo automaticamente ao detectar Enter.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} size="lg">Registrar Entrada</Button>
                <Button onClick={resetForm} variant="ghost">Limpar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por comanda ou nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredCustomers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Nenhuma comanda ativa encontrada.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCustomers.map((c) => (
                <Card key={c.id}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="default" className="text-base px-3 py-1">#{c.tabNumber}</Badge>
                      <span className="text-xs text-muted-foreground">há {timeAgo(c.checkInAt)}</span>
                    </div>
                    <div className="font-semibold">{c.fullName}</div>
                    <div className="text-xs text-muted-foreground">CPF: {c.cpf}</div>
                    {c.rfid && <div className="text-xs text-muted-foreground">Tag: {c.rfid}</div>}
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => {
                        checkOutCustomer(c.id);
                        toast.success(`Comanda #${c.tabNumber} encerrada`);
                      }}
                    >
                      <LogOut className="h-3 w-3 mr-2" />Encerrar Comanda
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
