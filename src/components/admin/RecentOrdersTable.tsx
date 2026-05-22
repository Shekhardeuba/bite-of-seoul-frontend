import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUSES = ["received", "preparing", "ready", "delivered", "cancelled"];

const statusColor: Record<string, string> = {
  received: "bg-blue-500/15 text-blue-600",
  preparing: "bg-amber-500/15 text-amber-600",
  ready: "bg-emerald-500/15 text-emerald-600",
  delivered: "bg-primary/15 text-primary",
  cancelled: "bg-destructive/15 text-destructive",
};

export default function RecentOrdersTable({
  orders, userEmailById, onStatus,
}: {
  orders: any[];
  userEmailById: Record<string, string>;
  onStatus: (id: string, status: string) => void;
}) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader><CardTitle className="text-base">Recent Orders</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto p-0">
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No orders found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="p-3 font-medium">Order ID</th>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 20).map(o => (
                <tr key={o.id} className="border-t">
                  <td className="p-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                  <td className="p-3 truncate max-w-[180px]">{userEmailById[o.user_id] ?? "—"}</td>
                  <td className="p-3 font-semibold">${Number(o.total).toFixed(2)}</td>
                  <td className="p-3">
                    <Badge className={statusColor[o.status] ?? ""} variant="secondary">{o.status}</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground whitespace-nowrap">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    <Select value={o.status} onValueChange={v => onStatus(o.id, v)}>
                      <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
