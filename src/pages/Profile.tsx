import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DIETARY = ["vegetarian", "vegan", "gluten-free", "halal", "spicy-lover"];

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data));
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => setOrders(data ?? []));
    supabase.from("reservations").select("*").eq("user_id", user.id).order("reservation_date", { ascending: false }).limit(5)
      .then(({ data }) => setReservations(data ?? []));
  }, [user]);

  useEffect(() => {
    if (!profile) return;
    const tags = profile.dietary_preferences ?? [];
    let q = supabase.from("menu_items").select("*").eq("available", true).limit(3);
    if (tags.length) q = q.overlaps("dietary_tags", tags);
    q.then(({ data }) => setRecs(data ?? []));
  }, [profile]);

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/");
  };

  const save = async () => {
    if (!user || !profile) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name, phone: profile.phone, dietary_preferences: profile.dietary_preferences,
    }).eq("id", user.id);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  };

  const togglePref = (tag: string) => {
    const cur = profile.dietary_preferences ?? [];
    setProfile({ ...profile, dietary_preferences: cur.includes(tag) ? cur.filter((t: string) => t !== tag) : [...cur, tag] });
  };

  if (!profile) return <div className="min-h-screen"><Navigation /><p className="p-12 text-center">Loading…</p></div>;

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold elegant-text">Profile</h1>
          <Button variant="outline" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />Sign out</Button>
        </div>

        <Card className="border-primary/40 shadow-elegant">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Loyalty points</p>
              <p className="text-4xl font-bold elegant-text">{profile.loyalty_points}</p>
            </div>
            <Sparkles className="h-12 w-12 text-accent" />
          </CardContent>
        </Card>

        <Card><CardContent className="p-6 space-y-4">
          <div><Label>Email</Label><Input value={user?.email ?? ""} disabled /></div>
          <div><Label>Full name</Label><Input value={profile.full_name ?? ""} onChange={e => setProfile({ ...profile, full_name: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={profile.phone ?? ""} onChange={e => setProfile({ ...profile, phone: e.target.value })} /></div>
          <div>
            <Label>Dietary preferences</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {DIETARY.map(d => (
                <Badge key={d} variant={profile.dietary_preferences?.includes(d) ? "default" : "outline"}
                  className="cursor-pointer" onClick={() => togglePref(d)}>{d}</Badge>
              ))}
            </div>
          </div>
          <Button onClick={save} disabled={loading}>{loading ? "Saving…" : "Save changes"}</Button>
        </CardContent></Card>

        {recs.length > 0 && (
          <Card><CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Recommended for you</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {recs.map(r => (
                <div key={r.id} className="p-4 rounded-lg border border-border">
                  <h3 className="font-semibold">{r.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                  <p className="text-accent font-bold mt-2">${Number(r.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent></Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
