import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Menu as MenuIcon } from "lucide-react";
import { toast } from "sonner";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminSummaryCards from "@/components/admin/AdminSummaryCards";
import AdminCharts from "@/components/admin/AdminCharts";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";
import MenuManager from "@/components/admin/MenuManager";
import ReservationsManager from "@/components/admin/ReservationsManager";
import {
  fetchOrders, fetchProfiles, fetchCartItems, fetchMenuItems,
  updateOrderStatus, DateRange,
} from "@/services/adminService";

const STATUS_FILTERS = ["all", "received", "preparing", "ready", "delivered", "cancelled"];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [section, setSection] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(false);
  const [range, setRange] = useState<DateRange>("30d");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orders, setOrders] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [carts, setCarts] = useState<any[]>([]);
  const [menu, setMenu] = useState<any[]>([]);
  const [adminEmails, setAdminEmails] = useState<Record<string, string>>({});

  const load = async () => {
    try {
      setLoading(true); setError(null);
      const [o, p, c, m] = await Promise.all([
        fetchOrders(range, statusFilter), fetchProfiles(), fetchCartItems(), fetchMenuItems(),
      ]);
      setOrders(o); setProfiles(p); setCarts(c); setMenu(m);
    } catch (e: any) {
      setError(e.message ?? "Failed to load data");
      toast.error(e.message ?? "Failed to load data");
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [range, statusFilter]);

  // Get current admin email from auth
  const adminEmail = user?.email ?? "admin";

  // Build user_id -> email map (best effort from current session; profiles table has no email)
  useEffect(() => {
    // Use profile full_name as fallback identity since auth.users emails aren't accessible
    const map: Record<string, string> = {};
    profiles.forEach(p => { map[p.id] = p.full_name || p.id.slice(0, 8); });
    setAdminEmails(map);
  }, [profiles]);

  const stats = useMemo(() => {
    const nonCancelled = orders.filter(o => o.status !== "cancelled");
    const revenue = nonCancelled.reduce((s, o) => s + Number(o.total), 0);
    const counts = new Map<string, number>();
    orders.forEach(o => (o.order_items ?? []).forEach((it: any) =>
      counts.set(it.name, (counts.get(it.name) ?? 0) + (it.quantity ?? 1))));
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    const cartQty = carts.reduce((s, c) => s + (c.quantity ?? 0), 0);
    return {
      users: profiles.length, orders: orders.length, revenue,
      cartItems: cartQty, topItem: top?.[0] ?? "", pending: orders.filter(o => o.status === "received").length,
    };
  }, [orders, profiles, carts]);

  const topItems = useMemo(() => {
    const counts = new Map<string, { qty: number; revenue: number }>();
    orders.forEach(o => (o.order_items ?? []).forEach((it: any) => {
      const r = counts.get(it.name) ?? { qty: 0, revenue: 0 };
      r.qty += it.quantity ?? 1; r.revenue += Number(it.price) * (it.quantity ?? 1);
      counts.set(it.name, r);
    }));
    return [...counts.entries()].map(([name, v]) => ({ name, qty: v.qty, revenue: v.revenue }))
      .sort((a, b) => b.qty - a.qty).slice(0, 6);
  }, [orders]);

  const revenueByDate = useMemo(() => {
    const days = range === "today" ? 1 : range === "7d" ? 7 : 14;
    const map = new Map<string, number>();
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      map.set(d.toISOString().slice(5, 10), 0);
    }
    orders.filter(o => o.status !== "cancelled").forEach(o => {
      const k = new Date(o.created_at).toISOString().slice(5, 10);
      if (map.has(k)) map.set(k, (map.get(k) ?? 0) + Number(o.total));
    });
    return [...map.entries()].map(([date, revenue]) => ({ date, revenue: Number(revenue.toFixed(2)) }));
  }, [orders, range]);

  const statusBreakdown = useMemo(() => {
    const m = new Map<string, number>();
    orders.forEach(o => m.set(o.status, (m.get(o.status) ?? 0) + 1));
    return [...m.entries()].map(([name, value]) => ({ name, value }));
  }, [orders]);

  const cartChart = useMemo(() => {
    const m = new Map<string, number>();
    carts.forEach((c: any) => {
      const n = c.menu_items?.name ?? "item";
      m.set(n, (m.get(n) ?? 0) + (c.quantity ?? 0));
    });
    return [...m.entries()].map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty).slice(0, 6);
  }, [carts]);

  const topCustomers = useMemo(() => {
    const m = new Map<string, number>();
    orders.forEach(o => m.set(o.user_id, (m.get(o.user_id) ?? 0) + 1));
    return [...m.entries()].map(([uid, count]) => ({ uid, count }))
      .sort((a, b) => b.count - a.count).slice(0, 5);
  }, [orders]);

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("Order updated");
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="min-h-screen flex bg-muted/20">
      <AdminSidebar active={section} onSelect={setSection} open={sideOpen} onClose={() => setSideOpen(false)} />
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-card border-b sticky top-0 z-20 px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSideOpen(true)}>
              <MenuIcon className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg lg:text-xl font-bold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{adminEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={range} onValueChange={v => setRange(v as DateRange)}>
              <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-9 hidden sm:flex"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </header>

        <main className="p-4 lg:p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading analytics…
            </div>
          ) : error ? (
            <Card><CardContent className="p-6 text-destructive">{error}</CardContent></Card>
          ) : (
            <>
              <AdminSummaryCards stats={stats} />

              {(section === "dashboard" || section === "cart") && (
                <AdminCharts
                  topItems={topItems.map(t => ({ name: t.name, qty: t.qty }))}
                  revenueByDate={revenueByDate}
                  statusBreakdown={statusBreakdown}
                  cartItems={cartChart}
                />
              )}

              {(section === "dashboard" || section === "orders") && (
                <RecentOrdersTable orders={orders} userEmailById={adminEmails} onStatus={handleStatus} />
              )}

              {section === "dashboard" && (
                <div className="grid lg:grid-cols-2 gap-4">
                  <Card className="rounded-xl shadow-sm">
                    <CardHeader><CardTitle className="text-base">Most Ordered Items</CardTitle></CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                      {topItems.length === 0 ? <p className="p-6 text-sm text-muted-foreground">No data.</p> : (
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50"><tr className="text-left">
                            <th className="p-3 font-medium">Item</th><th className="p-3 font-medium">Qty</th><th className="p-3 font-medium">Revenue</th>
                          </tr></thead>
                          <tbody>{topItems.map(t => (
                            <tr key={t.name} className="border-t">
                              <td className="p-3">{t.name}</td><td className="p-3">{t.qty}</td><td className="p-3 font-semibold">${t.revenue.toFixed(2)}</td>
                            </tr>))}</tbody>
                        </table>
                      )}
                    </CardContent>
                  </Card>
                  <Card className="rounded-xl shadow-sm">
                    <CardHeader><CardTitle className="text-base">Top Customers</CardTitle></CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                      {topCustomers.length === 0 ? <p className="p-6 text-sm text-muted-foreground">No data.</p> : (
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50"><tr className="text-left">
                            <th className="p-3 font-medium">Customer</th><th className="p-3 font-medium">Orders</th>
                          </tr></thead>
                          <tbody>{topCustomers.map(c => (
                            <tr key={c.uid} className="border-t">
                              <td className="p-3 truncate">{adminEmails[c.uid] ?? c.uid.slice(0, 8)}</td>
                              <td className="p-3 font-semibold">{c.count}</td>
                            </tr>))}</tbody>
                        </table>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {section === "cart" && (
                <Card className="rounded-xl shadow-sm">
                  <CardHeader><CardTitle className="text-base">Cart Items</CardTitle></CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    {carts.length === 0 ? <p className="p-6 text-sm text-muted-foreground">No active carts.</p> : (
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50"><tr className="text-left">
                          <th className="p-3 font-medium">User</th><th className="p-3 font-medium">Item</th>
                          <th className="p-3 font-medium">Qty</th><th className="p-3 font-medium">Price</th>
                        </tr></thead>
                        <tbody>{carts.map((c: any) => (
                          <tr key={c.id} className="border-t">
                            <td className="p-3 truncate max-w-[200px]">{adminEmails[c.user_id] ?? c.user_id.slice(0, 8)}</td>
                            <td className="p-3">{c.menu_items?.name ?? "—"}</td>
                            <td className="p-3">{c.quantity}</td>
                            <td className="p-3">${Number(c.menu_items?.price ?? 0).toFixed(2)}</td>
                          </tr>))}</tbody>
                      </table>
                    )}
                  </CardContent>
                </Card>
              )}

              {section === "menu" && <MenuManager />}

              {section === "users" && (
                <Card className="rounded-xl shadow-sm">
                  <CardHeader><CardTitle className="text-base">Users ({profiles.length})</CardTitle></CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50"><tr className="text-left">
                        <th className="p-3 font-medium">Name</th><th className="p-3 font-medium">Phone</th>
                        <th className="p-3 font-medium">Loyalty</th><th className="p-3 font-medium">Joined</th>
                      </tr></thead>
                      <tbody>{profiles.map(p => (
                        <tr key={p.id} className="border-t">
                          <td className="p-3 font-medium">{p.full_name || "—"}</td>
                          <td className="p-3 text-muted-foreground">{p.phone || "—"}</td>
                          <td className="p-3">{p.loyalty_points} pts</td>
                          <td className="p-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                        </tr>))}</tbody>
                    </table>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
