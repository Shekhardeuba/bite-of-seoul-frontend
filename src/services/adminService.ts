import { supabase } from "@/integrations/supabase/client";

export type DateRange = "today" | "7d" | "30d" | "all";

export function rangeStart(range: DateRange): Date | null {
  if (range === "all") return null;
  const d = new Date();
  if (range === "today") { d.setHours(0, 0, 0, 0); return d; }
  if (range === "7d") { d.setDate(d.getDate() - 7); return d; }
  d.setDate(d.getDate() - 30); return d;
}

export async function fetchOrders(range: DateRange, status: string) {
  let q = supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  const start = rangeStart(range);
  if (start) q = q.gte("created_at", start.toISOString());
  if (status !== "all") q = q.eq("status", status as any);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function fetchProfiles() {
  const { data, error } = await supabase.from("profiles").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function fetchCartItems() {
  const { data, error } = await supabase
    .from("cart_items")
    .select("*, menu_items(name, price)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchMenuItems() {
  const { data, error } = await supabase.from("menu_items").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
  if (error) throw error;
}
