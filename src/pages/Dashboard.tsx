import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, ShoppingBag, Eye, ShoppingCart, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

type Row = { name: string; value: number };

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [ordered, setOrdered] = useState<Row[]>([]);
  const [viewed, setViewed] = useState<Row[]>([]);
  const [carted, setCarted] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [menuRes, orderItemsRes, cartRes, prefsRes] = await Promise.all([
        supabase.from("menu_items").select("id, name"),
        supabase.from("order_items").select("menu_item_id, name, quantity"),
        supabase.from("cart_items").select("menu_item_id, quantity"),
        supabase.from("user_preferences").select("recently_viewed"),
      ]);

      const menuMap = new Map<string, string>();
      (menuRes.data ?? []).forEach((m: any) => menuMap.set(m.id, m.name));

      const orderedMap = new Map<string, number>();
      (orderItemsRes.data ?? []).forEach((it: any) => {
        const key = it.name || menuMap.get(it.menu_item_id) || "Unknown";
        orderedMap.set(key, (orderedMap.get(key) ?? 0) + (it.quantity ?? 1));
      });

      const cartMap = new Map<string, number>();
      (cartRes.data ?? []).forEach((c: any) => {
        const key = menuMap.get(c.menu_item_id) || "Unknown";
        cartMap.set(key, (cartMap.get(key) ?? 0) + (c.quantity ?? 1));
      });

      const viewedMap = new Map<string, number>();
      (prefsRes.data ?? []).forEach((p: any) =>
        (p.recently_viewed ?? []).forEach((id: string) => {
          const key = menuMap.get(id) || "Unknown";
          viewedMap.set(key, (viewedMap.get(key) ?? 0) + 1);
        })
      );

      const top = (m: Map<string, number>) =>
        [...m.entries()]
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8);

      setOrdered(top(orderedMap));
      setCarted(top(cartMap));
      setViewed(top(viewedMap));
      setLoading(false);
    })();
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/");
  };

  const ChartCard = ({
    title, icon: Icon, data, color, empty,
  }: { title: string; icon: any; data: Row[]; color: string; empty: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty}</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
              <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={110} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="value" fill={color} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-4xl font-bold elegant-text flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" /> Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">User interaction insights across the platform</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/admin")}>← Admin</Button>
            <Button variant="ghost" onClick={() => navigate("/")}>Back to website</Button>
            <Button variant="outline" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />Sign out</Button>
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading analytics…</p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <ChartCard
              title="Most Ordered Items"
              icon={ShoppingBag}
              data={ordered}
              color="hsl(28 90% 58%)"
              empty="No orders yet."
            />
            <ChartCard
              title="Most Added to Cart"
              icon={ShoppingCart}
              data={carted}
              color="hsl(38 95% 62%)"
              empty="No items in carts yet."
            />
            <ChartCard
              title="Most Viewed Items"
              icon={Eye}
              data={viewed}
              color="hsl(160 60% 50%)"
              empty="No view data yet."
            />
            <Card>
              <CardHeader><CardTitle className="text-base">Quick Summary</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Distinct ordered items</span><span className="font-bold">{ordered.length}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Distinct items in carts</span><span className="font-bold">{carted.length}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Distinct viewed items</span><span className="font-bold">{viewed.length}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Top seller</span><span className="font-bold">{ordered[0]?.name ?? "—"}</span></div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
