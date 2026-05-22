import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const tax = subtotal * 0.08;
  const deliveryFee = orderType === "delivery" ? 4.99 : 0;
  const total = subtotal + tax + deliveryFee;

  const placeOrder = async () => {
    if (!user) return;
    if (items.length === 0) return toast.error("Cart is empty");
    if (orderType === "delivery" && address.trim().length < 5) return toast.error("Please add an address");

    setLoading(true);
    const { data: order, error } = await supabase.from("orders").insert({
      user_id: user.id, order_type: orderType, subtotal, tax, delivery_fee: deliveryFee, total,
      delivery_address: orderType === "delivery" ? address : null, notes,
    }).select().single();

    if (error || !order) { setLoading(false); return toast.error(error?.message || "Order failed"); }

    const lineItems = items.map(i => ({
      order_id: order.id, menu_item_id: i.menu_item_id,
      name: i.menu_item.name, price: i.menu_item.price, quantity: i.quantity,
    }));
    await supabase.from("order_items").insert(lineItems);

    // award loyalty points (1 per dollar)
    const { data: prof } = await supabase.from("profiles").select("loyalty_points").eq("id", user.id).maybeSingle();
    await supabase.from("profiles").update({ loyalty_points: (prof?.loyalty_points ?? 0) + Math.floor(total) }).eq("id", user.id);

    await clearCart();
    setLoading(false);
    toast.success("Order placed!");
    navigate("/orders");
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 elegant-text">Checkout</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card><CardContent className="p-6 space-y-4">
              <h2 className="font-bold">Order type</h2>
              <RadioGroup value={orderType} onValueChange={v => setOrderType(v as any)} className="flex gap-6">
                <div className="flex items-center gap-2"><RadioGroupItem value="pickup" id="p" /><Label htmlFor="p">Pickup</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="delivery" id="d" /><Label htmlFor="d">Delivery (+$4.99)</Label></div>
              </RadioGroup>
              {orderType === "delivery" && (
                <div>
                  <Label htmlFor="addr">Delivery address</Label>
                  <Input id="addr" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
              )}
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </CardContent></Card>
          </div>
          <Card className="h-fit"><CardContent className="p-6 space-y-3">
            <h2 className="text-xl font-bold mb-2">Order summary</h2>
            {items.map(i => (
              <div key={i.id} className="flex justify-between text-sm">
                <span>{i.menu_item.name} × {i.quantity}</span>
                <span>${(Number(i.menu_item.price) * i.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3 space-y-1">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              {deliveryFee > 0 && <div className="flex justify-between text-sm"><span>Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>}
              <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span className="text-accent">${total.toFixed(2)}</span></div>
            </div>
            <Button className="w-full" onClick={placeOrder} disabled={loading || items.length === 0}>
              {loading ? "Placing…" : "Place order"}
            </Button>
          </CardContent></Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
