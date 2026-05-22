import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusColor: Record<string, string> = {
  received: "bg-blue-500/20 text-blue-300",
  preparing: "bg-yellow-500/20 text-yellow-300",
  ready: "bg-green-500/20 text-green-300",
  delivered: "bg-emerald-500/20 text-emerald-300",
  cancelled: "bg-red-500/20 text-red-300",
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("*, order_items(*)").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setOrders(data ?? []));
  }, [user]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 elegant-text">Order History</h1>
        {orders.length === 0 ? (
          <p className="text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(o => (
              <Card key={o.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
                      <p className="font-semibold capitalize">{o.order_type}</p>
                    </div>
                    <Badge className={statusColor[o.status]}>{o.status}</Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    {o.order_items.map((i: any) => (
                      <div key={i.id} className="flex justify-between">
                        <span>{i.name} × {i.quantity}</span>
                        <span>${(Number(i.price) * i.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold mt-3 pt-3 border-t border-border">
                    <span>Total</span><span className="text-accent">${Number(o.total).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
