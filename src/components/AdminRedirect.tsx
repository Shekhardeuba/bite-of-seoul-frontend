import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Routes the admin is allowed to view. Anything else redirects to /admin-dashboard.
const ADMIN_ALLOWED = [
  "/admin",
  "/admin-dashboard",
  "/admin-login",
  "/reset-password",
];

export const AdminRedirect = () => {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !isAdmin) return;
    const allowed = ADMIN_ALLOWED.some(p => location.pathname.startsWith(p));
    if (!allowed) navigate("/admin-dashboard", { replace: true });
  }, [isAdmin, loading, location.pathname, navigate]);

  return null;
};
