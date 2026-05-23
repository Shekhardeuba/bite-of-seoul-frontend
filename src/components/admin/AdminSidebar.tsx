import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, ShoppingCart, CalendarDays, LogOut, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const items = [
  { to: "/admin-dashboard", label: "Dashboard", icon: LayoutDashboard, section: "dashboard" },
  { to: "/admin-dashboard?tab=orders", label: "Orders", icon: ShoppingBag, section: "orders" },
  { to: "/admin-dashboard?tab=reservations", label: "Reservations", icon: CalendarDays, section: "reservations" },
  { to: "/admin-dashboard?tab=menu", label: "Menu Items", icon: UtensilsCrossed, section: "menu" },
  { to: "/admin-dashboard?tab=users", label: "Users", icon: Users, section: "users" },
  { to: "/admin-dashboard?tab=cart", label: "Cart Analytics", icon: ShoppingCart, section: "cart" },
];

export default function AdminSidebar({
  active, onSelect, open, onClose,
}: { active: string; onSelect: (s: string) => void; open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 bg-black/40 z-30 lg:hidden" />}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-card border-r flex flex-col transition-transform lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 px-6 flex items-center justify-between border-b">
          <span className="font-bold text-lg elegant-text">🍴 Admin</span>
          <button onClick={onClose} className="lg:hidden"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map(({ label, icon: Icon, section }) => (
            <button
              key={section}
              onClick={() => { onSelect(section); onClose(); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left",
                active === section ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t space-y-1">
          <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm hover:bg-muted text-muted-foreground">
            ← Back to website
          </NavLink>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm hover:bg-destructive/10 text-destructive">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
