import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

const COLORS = ["hsl(28 90% 58%)", "hsl(38 95% 62%)", "hsl(160 60% 50%)", "hsl(0 72% 51%)", "hsl(220 70% 60%)", "hsl(280 60% 60%)"];
const tip = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 };

function Empty({ msg }: { msg: string }) {
  return <div className="h-full flex items-center justify-center text-sm text-muted-foreground">{msg}</div>;
}

export default function AdminCharts({ topItems, revenueByDate, statusBreakdown, cartItems }: {
  topItems: { name: string; qty: number }[];
  revenueByDate: { date: string; revenue: number }[];
  statusBreakdown: { name: string; value: number }[];
  cartItems: { name: string; qty: number }[];
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card className="rounded-xl shadow-sm">
        <CardHeader><CardTitle className="text-base">Most Ordered Items</CardTitle></CardHeader>
        <CardContent className="h-72">
          {topItems.length === 0 ? <Empty msg="No orders yet." /> : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItems} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={110} />
                <Tooltip contentStyle={tip} />
                <Bar dataKey="qty" fill="hsl(28 90% 58%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader><CardTitle className="text-base">Revenue by Date</CardTitle></CardHeader>
        <CardContent className="h-72">
          {revenueByDate.every(r => r.revenue === 0) ? <Empty msg="No revenue in period." /> : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={tip} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(160 60% 45%)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader><CardTitle className="text-base">Order Status Breakdown</CardTitle></CardHeader>
        <CardContent className="h-72">
          {statusBreakdown.length === 0 ? <Empty msg="No orders yet." /> : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {statusBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader><CardTitle className="text-base">Items In User Carts</CardTitle></CardHeader>
        <CardContent className="h-72">
          {cartItems.length === 0 ? <Empty msg="No active cart items." /> : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cartItems}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} angle={-20} textAnchor="end" height={60} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={tip} />
                <Bar dataKey="qty" fill="hsl(38 95% 62%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
