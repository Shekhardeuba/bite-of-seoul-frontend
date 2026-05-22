import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const ORDER_STATUSES = ["received", "preparing", "ready", "delivered", "cancelled"] as const;
const RES_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

const Admin = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const load = async () => {
    const [o, r, u] = await Promise.all([
      supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
      supabase.from("reservations").select("*").order("reservation_date", { ascending: false }),
      supabase.from("profiles").select("*"),
    ]);
    setOrders(o.data ?? []);
    setReservations(r.data ?? []);
    setUsers(u.data ?? []);
  };
  useEffect(() => { load(); }, []);

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

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 elegant-text">Admin Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Total Revenue</p><p className="text-3xl font-bold text-accent">${revenue.toFixed(2)}</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Orders</p><p className="text-3xl font-bold">{orders.length}</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Reservations</p><p className="text-3xl font-bold">{reservations.length}</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Users</p><p className="text-3xl font-bold">{users.length}</p></CardContent></Card>
        </div>

        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-3">
            {orders.map(o => (
              <Card key={o.id}><CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">${Number(o.total).toFixed(2)} · {o.order_type}</p>
                  <p className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleString()} · {o.order_items?.length ?? 0} items</p>
                </div>
                <Select value={o.status} onValueChange={(v) => updateOrder(o.id, v as any)}>
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
                <Select value={r.status} onValueChange={(v) => updateReservation(r.id, v as any)}>
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
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
