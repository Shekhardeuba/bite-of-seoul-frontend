import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export type CartItem = {
  id: string;
  menu_item_id: string;
  quantity: number;
  menu_item: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  };
};

type CartCtx = {
  items: CartItem[];
  loading: boolean;
  count: number;
  subtotal: number;
  addToCart: (menuItemId: string) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<CartCtx>({} as CartCtx);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("id, menu_item_id, quantity, menu_item:menu_items(id,name,price,image_url)")
      .eq("user_id", user.id);
    if (!error && data) setItems(data as any);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const addToCart = async (menuItemId: string) => {
    if (!user) {
      toast.error("Please sign in to add items");
      return;
    }
    const existing = items.find(i => i.menu_item_id === menuItemId);
    if (existing) {
      await updateQuantity(existing.id, existing.quantity + 1);
    } else {
      const { error } = await supabase
        .from("cart_items")
        .insert({ user_id: user.id, menu_item_id: menuItemId, quantity: 1 });
      if (error) { toast.error(error.message); return; }
      await refresh();
    }
    toast.success("Added to cart");
  };

  const removeFromCart = async (id: string) => {
    await supabase.from("cart_items").delete().eq("id", id);
    await refresh();
  };

  const updateQuantity = async (id: string, qty: number) => {
    if (qty < 1) return removeFromCart(id);
    await supabase.from("cart_items").update({ quantity: qty }).eq("id", id);
    await refresh();
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setItems([]);
  };

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.quantity * Number(i.menu_item.price), 0);

  return (
    <Ctx.Provider value={{ items, loading, count, subtotal, addToCart, removeFromCart, updateQuantity, clearCart, refresh }}>
      {children}
    </Ctx.Provider>
  );
};

export const useCart = () => useContext(Ctx);
