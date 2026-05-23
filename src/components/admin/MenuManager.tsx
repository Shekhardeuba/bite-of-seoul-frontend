import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Plus, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  available: boolean;
  featured: boolean;
  spicy: boolean;
};

const CATEGORIES = ["Main", "Appetizer", "Side", "Dessert", "Drink"];

const empty: Omit<MenuItem, "id"> = {
  name: "", description: "", price: 0, category: "Main",
  image_url: "", available: true, featured: false, spicy: false,
};

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("menu_items").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data ?? []) as MenuItem[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...empty }); setOpen(true); };
  const openEdit = (it: MenuItem) => {
    setEditing(it);
    setForm({
      name: it.name, description: it.description ?? "", price: Number(it.price),
      category: it.category, image_url: it.image_url ?? "",
      available: it.available, featured: it.featured, spicy: it.spicy,
    });
    setOpen(true);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("menu-images").upload(path, file, { cacheControl: "3600" });
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
    setForm(f => ({ ...f, image_url: data.publicUrl }));
    setUploading(false);
    toast.success("Image uploaded");
  };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (form.price < 0) return toast.error("Price must be ≥ 0");
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description || null,
      price: Number(form.price),
      category: form.category,
      image_url: form.image_url || null,
      available: form.available,
      featured: form.featured,
      spicy: form.spicy,
    };
    const { error } = editing
      ? await supabase.from("menu_items").update(payload).eq("id", editing.id)
      : await supabase.from("menu_items").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Item updated" : "Item created");
    setOpen(false);
    load();
  };

  const remove = async (it: MenuItem) => {
    if (!confirm(`Delete "${it.name}"?`)) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", it.id);
    if (error) return toast.error(error.message);
    toast.success("Item deleted");
    load();
  };

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Menu Items ({items.length})</CardTitle>
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add item</Button>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <div className="p-6 flex items-center text-muted-foreground"><Loader2 className="h-4 w-4 mr-2 animate-spin" />Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50"><tr className="text-left">
              <th className="p-3 font-medium">Image</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr></thead>
            <tbody>{items.map(it => (
              <tr key={it.id} className="border-t">
                <td className="p-3">
                  {it.image_url ? (
                    <img src={it.image_url} alt={it.name} className="h-12 w-12 object-cover rounded" />
                  ) : <div className="h-12 w-12 bg-muted rounded" />}
                </td>
                <td className="p-3 font-medium">{it.name}</td>
                <td className="p-3 text-muted-foreground">{it.category}</td>
                <td className="p-3">${Number(it.price).toFixed(2)}</td>
                <td className="p-3">{it.available ? "Available" : "Hidden"}</td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(it)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(it)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit item" : "Add menu item"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Image</Label>
              {form.image_url && <img src={form.image_url} alt="" className="h-32 w-full object-cover rounded mb-2" />}
              <div className="flex gap-2">
                <Input value={form.image_url} placeholder="Image URL or upload" onChange={e => setForm({ ...form, image_url: e.target.value })} />
                <Button type="button" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
              </div>
            </div>
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price ($)</Label>
                <Input type="number" step="0.01" min="0" value={form.price}
                  onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between"><Label>Available</Label>
              <Switch checked={form.available} onCheckedChange={v => setForm({ ...form, available: v })} /></div>
            <div className="flex items-center justify-between"><Label>Featured</Label>
              <Switch checked={form.featured} onCheckedChange={v => setForm({ ...form, featured: v })} /></div>
            <div className="flex items-center justify-between"><Label>Spicy</Label>
              <Switch checked={form.spicy} onCheckedChange={v => setForm({ ...form, spicy: v })} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
