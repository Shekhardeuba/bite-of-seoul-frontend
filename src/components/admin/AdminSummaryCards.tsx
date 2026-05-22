import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, ShoppingCart, Trophy, Clock, LucideIcon } from "lucide-react";

type Stat = { label: string; value: string | number; icon: LucideIcon; accent?: string };

export default function AdminSummaryCards({ stats }: { stats: {
  users: number; orders: number; revenue: number; cartItems: number; topItem: string; pending: number;
} }) {
  const cards: Stat[] = [
    { label: "Total Users", value: stats.users, icon: Users, accent: "bg-blue-500/15 text-blue-600" },
    { label: "Total Orders", value: stats.orders, icon: ShoppingBag, accent: "bg-primary/15 text-primary" },
    { label: "Total Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, accent: "bg-emerald-500/15 text-emerald-600" },
    { label: "Active Cart Items", value: stats.cartItems, icon: ShoppingCart, accent: "bg-amber-500/15 text-amber-600" },
    { label: "Most Ordered", value: stats.topItem || "—", icon: Trophy, accent: "bg-accent/15 text-accent" },
    { label: "Pending Orders", value: stats.pending, icon: Clock, accent: "bg-orange-500/15 text-orange-600" },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map(c => (
        <Card key={c.label} className="rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${c.accent}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className="text-lg font-bold truncate" title={String(c.value)}>{c.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
