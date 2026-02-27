import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Fetch role to redirect correctly
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", (await supabase.auth.getUser()).data.user.id)
        .single();

      toast.success("Welcome back!");
      if (profile?.role === "agent") {
        navigate("/edit-agent-profile");
      } else {
        navigate("/edit-profile");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-32 text-left">
        <div className="max-w-md w-full glass-card p-10 animate-fade-in shadow-xl border-border/40">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-sm text-muted-foreground font-normal">
              Log in to your Transfer Admin account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-10 h-11 bg-background/50"
                    required 
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                  <a href="#" className="text-xs text-primary hover:underline font-medium transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-11 bg-background/50"
                    required 
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 mt-4 gradient-green text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 group" 
              disabled={loading}
            >
              {loading ? "Signing in..." : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>

            <div className="text-center text-sm pt-2">
              <span className="text-muted-foreground font-normal">Don't have an account yet? </span>
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
