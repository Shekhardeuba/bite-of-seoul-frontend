import { useEffect, useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type MenuItem = {
  id: string; name: string; description: string | null; price: number;
  category: string; image_url: string | null; dietary_tags: string[] | null;
  featured: boolean; spicy: boolean; available: boolean;
};

const Menu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    supabase.from("menu_items").select("*").eq("available", true).order("featured", { ascending: false })
      .then(({ data }) => { setItems((data as any) ?? []); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("user_preferences").select("favorite_items").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setFavorites(data?.favorite_items ?? []));
  }, [user]);

  const toggleFavorite = async (id: string) => {
    if (!user) return toast.error("Sign in to save favorites");
    const next = favorites.includes(id) ? favorites.filter(x => x !== id) : [...favorites, id];
    setFavorites(next);
    await supabase.from("user_preferences").upsert({ user_id: user.id, favorite_items: next });
  };

  const categories = useMemo(() => {
    const set = new Set(items.map(i => i.category));
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = items.filter(i =>
    (activeCategory === "all" || i.category === activeCategory) &&
    (query === "" || i.name.toLowerCase().includes(query.toLowerCase()))
  );

  const featured = items.filter(i => i.featured).slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="py-16 korean-pattern">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 elegant-text">Our Menu</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Authentic Korean flavors, crafted with tradition</p>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-12 bg-card/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">⭐ Chef's Featured</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map(item => (
                <Card key={item.id} className="food-card-hover overflow-hidden border-primary/30 group">
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-primary">{item.name} {item.spicy && "🌶️"}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-2xl font-bold text-accent">${Number(item.price).toFixed(2)}</span>
                      <Button size="sm" onClick={() => addToCart(item.id)}><Plus className="h-4 w-4 mr-1" />Add</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}


      <section className="py-8 bg-card/50 border-y border-border sticky top-16 z-30 backdrop-blur-md">
        <div className="container mx-auto px-4 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search dishes…" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(c => (
              <Button key={c} variant={activeCategory === c ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(c)}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading menu…</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(item => (
                <Card key={item.id} className="food-card-hover overflow-hidden group">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/15 to-accent/15">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl opacity-60">🍱</div>
                    )}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      aria-label="Toggle favorite"
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(item.id) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    </button>
                    {item.spicy && (
                      <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">🌶️ Spicy</Badge>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2 min-h-[2.5rem]">{item.description}</p>
                    <div className="flex gap-1 mt-3 flex-wrap">
                      {item.dietary_tags?.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-2xl font-bold text-accent">${Number(item.price).toFixed(2)}</span>
                      <Button size="sm" onClick={() => addToCart(item.id)}><Plus className="h-4 w-4 mr-1" />Add</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          )}
          {filtered.length === 0 && !loading && (
            <p className="text-center text-muted-foreground">No items found.</p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Menu;
