import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user && !authLoading) return <Navigate to={isAdmin ? "/admin-dashboard" : "/profile"} replace />;

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
    toast.success("Welcome back!");
    navigate(roleRow ? "/admin-dashboard" : "/profile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader>
          <CardTitle className="text-3xl elegant-text text-center">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-center text-muted-foreground space-y-2">
            <p>No account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link></p>
            <p><Link to="/admin-login" className="hover:text-primary">Admin login →</Link></p>
            <p><Link to="/" className="hover:text-primary">← Back home</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
