import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Reservations = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ guest_name: "", party_size: 2, reservation_date: "", reservation_time: "", occasion: "" });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const loadHistory = () => {
    if (!user) return;
    supabase.from("reservations").select("*").eq("user_id", user.id).order("reservation_date", { ascending: false })
      .then(({ data }) => setHistory(data ?? []));
  };
  useEffect(loadHistory, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please sign in");
    setLoading(true);
    const { error } = await supabase.from("reservations").insert({ ...form, user_id: user.id });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Reservation requested!");
    setForm({ guest_name: "", party_size: 2, reservation_date: "", reservation_time: "", occasion: "" });
    loadHistory();
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="py-16 korean-pattern text-center">
        <h1 className="text-5xl font-bold elegant-text">Reservations</h1>
        <p className="text-muted-foreground mt-3">Book your table for an authentic Korean experience</p>
      </section>
      <div className="container mx-auto px-4 py-12 max-w-4xl grid md:grid-cols-2 gap-8">
        <Card><CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Make a reservation</h2>
          {!user ? (
            <p className="text-muted-foreground">Please <Link to="/auth" className="text-primary underline">sign in</Link> to book a table.</p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div><Label>Guest name</Label><Input required value={form.guest_name} onChange={e => setForm({ ...form, guest_name: e.target.value })} /></div>
              <div><Label>Party size</Label><Input type="number" min={1} max={20} required value={form.party_size} onChange={e => setForm({ ...form, party_size: Number(e.target.value) })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date</Label><Input type="date" required value={form.reservation_date} onChange={e => setForm({ ...form, reservation_date: e.target.value })} /></div>
                <div><Label>Time</Label><Input type="time" required value={form.reservation_time} onChange={e => setForm({ ...form, reservation_time: e.target.value })} /></div>
              </div>
              <div><Label>Special occasion</Label><Input value={form.occasion} onChange={e => setForm({ ...form, occasion: e.target.value })} placeholder="Birthday, anniversary…" /></div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Booking…" : "Request reservation"}</Button>
            </form>
          )}
        </CardContent></Card>

        <Card><CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Your reservations</h2>
          {history.length === 0 ? <p className="text-muted-foreground">No reservations yet.</p> : (
            <div className="space-y-3">
              {history.map(r => (
                <div key={r.id} className="border border-border rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{r.reservation_date} · {r.reservation_time}</p>
                    <p className="text-sm text-muted-foreground">{r.guest_name} · {r.party_size} guests</p>
                  </div>
                  <Badge variant="outline">{r.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent></Card>
      </div>
      <Footer />
    </div>
  );
};

export default Reservations;
