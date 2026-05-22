import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Sign in to view your cart</h1>
          <Link to="/auth"><Button>Sign in</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 elegant-text">Your Cart</h1>
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Link to="/menu"><Button>Browse menu</Button></Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-3">
              {items.map(item => (
                <Card key={item.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.menu_item.name}</h3>
                      <p className="text-sm text-accent">${Number(item.menu_item.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="h-fit">
              <CardContent className="p-6 space-y-3">
                <h2 className="text-xl font-bold mb-2">Summary</h2>
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg border-t border-border pt-3"><span>Total</span><span className="text-accent">${total.toFixed(2)}</span></div>
                <Button className="w-full" onClick={() => navigate("/checkout")}>Checkout</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
