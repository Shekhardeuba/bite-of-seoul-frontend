import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user && isAdmin) return <Navigate to="/admin-dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      return toast.error(error.message);
    }
    const { data: roleRow } = await supabase
      .from("user_roles").select("role").eq("user_id", data.user!.id).eq("role", "admin").maybeSingle();
    setLoading(false);
    if (!roleRow) {
      await supabase.auth.signOut();
      return toast.error("This account does not have admin access.");
    }
    toast.success("Welcome, admin");
    navigate("/admin-dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant border-accent/30">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
            <Shield className="h-6 w-6 text-accent" />
          </div>
          <CardTitle className="text-3xl elegant-text">Admin access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Admin email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in as admin"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-center text-muted-foreground space-y-2">
            <p><Link to="/login" className="hover:text-primary">← User login</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
