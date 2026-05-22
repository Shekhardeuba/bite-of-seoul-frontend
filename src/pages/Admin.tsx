import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LogOut, DollarSign, ShoppingBag, CalendarDays, Users } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";


const ORDER_STATUSES = ["received", "preparing", "ready", "delivered", "cancelled"] as const;
const RES_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

const Admin = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [popular, setPopular] = useState<{ name: string; qty: number }[]>([]);

  const load = async () => {
    const [o, r, u] = await Promise.all([
      supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
      supabase.from("reservations").select("*").order("reservation_date", { ascending: false }),
      supabase.from("profiles").select("*"),
    ]);
    setOrders(o.data ?? []);
    setReservations(r.data ?? []);
    setUsers(u.data ?? []);
    const counts = new Map<string, number>();
    (o.data ?? []).forEach((ord: any) => (ord.order_items ?? []).forEach((it: any) =>
      counts.set(it.name, (counts.get(it.name) ?? 0) + (it.quantity ?? 1))
    ));
    setPopular([...counts.entries()].map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty).slice(0, 5));
  };
  useEffect(() => { load(); }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/");
  };

  const updateOrder = async (id: string, status: typeof ORDER_STATUSES[number]) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order updated");
    load();
  };
  const updateReservation = async (id: string, status: typeof RES_STATUSES[number]) => {
    const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Reservation updated");
    load();
  };

  const revenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0);
  const recentOrders = orders.slice(0, 5);

  // Analytics data
  const revenueByDay = useMemo(() => {
    const map = new Map<string, number>();
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      map.set(d.toISOString().slice(5, 10), 0);
    }
    orders.filter(o => o.status !== "cancelled").forEach(o => {
      const key = new Date(o.created_at).toISOString().slice(5, 10);
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + Number(o.total));
    });
    return [...map.entries()].map(([date, revenue]) => ({ date, revenue: Number(revenue.toFixed(2)) }));
  }, [orders]);

  const statusBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach(o => map.set(o.status, (map.get(o.status) ?? 0) + 1));
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [orders]);

  const orderTypeBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach(o => map.set(o.order_type, (map.get(o.order_type) ?? 0) + 1));
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [orders]);

  const PIE_COLORS = ["hsl(28 90% 58%)", "hsl(38 95% 62%)", "hsl(160 60% 50%)", "hsl(0 72% 51%)", "hsl(220 70% 60%)"];
  const avgOrder = orders.length ? revenue / orders.filter(o => o.status !== "cancelled").length || 0 : 0;

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-4xl font-bold elegant-text">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Analytics & operations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/")}>← Back to website</Button>
            <Button variant="outline" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />Sign out</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-primary/30"><CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg gradient-warm flex items-center justify-center"><DollarSign className="h-6 w-6 text-primary-foreground" /></div>
            <div><p className="text-sm text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold text-accent">${revenue.toFixed(2)}</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/15 flex items-center justify-center"><ShoppingBag className="h-6 w-6 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Orders</p><p className="text-2xl font-bold">{orders.length}</p><p className="text-xs text-muted-foreground">avg ${avgOrder.toFixed(2)}</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-accent/15 flex items-center justify-center"><CalendarDays className="h-6 w-6 text-accent" /></div>
            <div><p className="text-sm text-muted-foreground">Reservations</p><p className="text-2xl font-bold">{reservations.length}</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center"><Users className="h-6 w-6" /></div>
            <div><p className="text-sm text-muted-foreground">Users</p><p className="text-2xl font-bold">{users.length}</p></div>
          </CardContent></Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Revenue · last 14 days</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(28 90% 58%)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Order status</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                    {statusBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader><CardTitle className="text-base">Top selling items</CardTitle></CardHeader>
            <CardContent className="h-72">
              {popular.length === 0 ? (
                <p className="text-sm text-muted-foreground">No order data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popular} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="qty" fill="hsl(38 95% 62%)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Order type split</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderTypeBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="value" fill="hsl(28 90% 58%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>


        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="popular">Popular items</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-3">
            {orders.map(o => (
              <Card key={o.id}><CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">${Number(o.total).toFixed(2)} · {o.order_type}</p>
                  <p className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleString()} · {o.order_items?.length ?? 0} items</p>
                </div>
                <Select value={o.status} onValueChange={(v: string) => updateOrder(o.id, v as typeof ORDER_STATUSES[number])}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>{ORDER_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </CardContent></Card>
            ))}
          </TabsContent>

          <TabsContent value="reservations" className="space-y-3">
            {reservations.map(r => (
              <Card key={r.id}><CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{r.guest_name} · {r.party_size} guests</p>
                  <p className="text-sm text-muted-foreground">{r.reservation_date} · {r.reservation_time}</p>
                </div>
                <Select value={r.status} onValueChange={(v: string) => updateReservation(r.id, v as typeof RES_STATUSES[number])}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>{RES_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </CardContent></Card>
            ))}
          </TabsContent>

          <TabsContent value="users" className="space-y-3">
            {users.map(u => (
              <Card key={u.id}><CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{u.full_name || "Unnamed"}</p>
                  <p className="text-sm text-muted-foreground">{u.phone || "—"}</p>
                </div>
                <Badge>{u.loyalty_points} pts</Badge>
              </CardContent></Card>
            ))}
          </TabsContent>

          <TabsContent value="recent" className="space-y-3">
            {recentOrders.map(o => (
              <Card key={o.id}><CardContent className="p-4">
                <div className="flex justify-between"><span>${Number(o.total).toFixed(2)}</span><Badge>{o.status}</Badge></div>
              </CardContent></Card>
            ))}
          </TabsContent>

          <TabsContent value="popular" className="space-y-3">
            {popular.length === 0 ? (
              <p className="text-sm text-muted-foreground">No order data yet.</p>
            ) : popular.map(p => (
              <Card key={p.name}><CardContent className="p-4 flex justify-between">
                <span className="font-semibold">{p.name}</span>
                <Badge>{p.qty} sold</Badge>
              </CardContent></Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
