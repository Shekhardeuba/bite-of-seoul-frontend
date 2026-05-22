import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, User as UserIcon, LogOut, Shield } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { count } = useCart();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/menu", label: "Menu" },
    { path: "/reservations", label: "Reservations" },
    { path: "/about", label: "About" },
    { path: "/gallery", label: "Gallery" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold elegant-text">Bite of Seoul</Link>

          <div className="hidden md:flex space-x-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path}>
                <Button variant={location.pathname === item.path ? "default" : "ghost"} size="sm">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {count}
                  </span>
                )}
              </Button>
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon"><UserIcon className="h-5 w-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>Order history</DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Shield className="h-4 w-4 mr-2" />Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login"><Button size="sm">Sign in</Button></Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
