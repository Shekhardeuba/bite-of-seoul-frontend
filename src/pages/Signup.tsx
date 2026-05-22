import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(128),
});

const Signup = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={isAdmin ? "/admin" : "/profile"} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ fullName, email, password });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/profile`,
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! Check your email to confirm, then sign in.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader>
          <CardTitle className="text-3xl elegant-text text-center">Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating…" : "Sign up"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-center text-muted-foreground space-y-2">
            <p>Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></p>
            <p><Link to="/" className="hover:text-primary">← Back home</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
