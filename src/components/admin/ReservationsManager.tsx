import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Search, Pencil } from "lucide-react";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
type Status = typeof STATUSES[number];

const statusVariant: Record<Status, string> = {
  pending: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  confirmed: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  completed: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function ReservationsManager() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editing, setEditing] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("reservation_date", { ascending: false })
      .order("reservation_time", { ascending: false });
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return rows.filter(r => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!s) return true;
      return (
        r.guest_name?.toLowerCase().includes(s) ||
        r.notes?.toLowerCase().includes(s) ||
        r.occasion?.toLowerCase().includes(s) ||
        r.reservation_date?.includes(s)
      );
    });
  }, [rows, search, statusFilter]);

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    setRows(rs => rs.map(r => r.id === id ? { ...r, status } : r));
  };

  const saveEdit = async () => {
    if (!editing) return;
    const { id, guest_name, party_size, reservation_date, reservation_time, occasion, notes, status } = editing;
    const { error } = await supabase.from("reservations").update({
      guest_name, party_size: Number(party_size), reservation_date, reservation_time, occasion, notes, status,
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Reservation updated");
    setEditing(null);
    load();
  };

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
        <CardTitle className="text-base">Reservations ({filtered.length})</CardTitle>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, date, notes…" className="pl-8 w-64" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No reservations found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="p-3 font-medium">Guest</th>
                <th className="p-3 font-medium">Date & Time</th>
                <th className="p-3 font-medium">Party</th>
                <th className="p-3 font-medium">Occasion</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-t hover:bg-muted/30">
                  <td className="p-3">
                    <div className="font-medium">{r.guest_name}</div>
                    {r.notes && <div className="text-xs text-muted-foreground truncate max-w-[200px]">{r.notes}</div>}
                  </td>
                  <td className="p-3">
                    <div>{r.reservation_date}</div>
                    <div className="text-xs text-muted-foreground">{r.reservation_time}</div>
                  </td>
                  <td className="p-3">{r.party_size}</td>
                  <td className="p-3 text-muted-foreground">{r.occasion || "—"}</td>
                  <td className="p-3">
                    <Select value={r.status} onValueChange={(v: Status) => updateStatus(r.id, v)}>
                      <SelectTrigger className={`w-36 h-8 border ${statusVariant[r.status as Status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => setEditing({ ...r })}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>

      <Dialog open={!!editing} onOpenChange={o => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit reservation</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div>
                <Label>Guest name</Label>
                <Input value={editing.guest_name} onChange={e => setEditing({ ...editing, guest_name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={editing.reservation_date}
                    onChange={e => setEditing({ ...editing, reservation_date: e.target.value })} />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input type="time" value={editing.reservation_time}
                    onChange={e => setEditing({ ...editing, reservation_time: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Party size</Label>
                  <Input type="number" min={1} value={editing.party_size}
                    onChange={e => setEditing({ ...editing, party_size: e.target.value })} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editing.status} onValueChange={v => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Occasion</Label>
                <Input value={editing.occasion ?? ""} onChange={e => setEditing({ ...editing, occasion: e.target.value })} />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={editing.notes ?? ""} onChange={e => setEditing({ ...editing, notes: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
