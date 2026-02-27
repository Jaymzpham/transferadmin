import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Briefcase, Mail, Lock, MapPin, ChevronLeft, ArrowRight, CheckCircle2 } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Role Selection, 2: Account Details
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("player");
  
  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    location: "",
    position: "", // Player only
    agencyName: "" // Agent only
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create profile
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            full_name: formData.fullName,
            role: role,
            location: formData.location,
            position: role === "player" ? formData.position : null,
            agency_name: role === "agent" ? formData.agencyName : null,
            updated_at: new Date(),
          });

        if (profileError) throw profileError;

        toast.success("Registration successful!");
        if (role === "agent") {
          navigate("/edit-agent-profile");
        } else {
          navigate("/edit-profile");
        }
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-32 mb-20 text-left">
        <div className="max-w-xl w-full">
          {step === 1 ? (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <h2 className="text-4xl font-extrabold text-foreground tracking-tight">Choose your role</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Are you a player looking for opportunities or an agent representing talent?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <div 
                  onClick={() => setRole("player")}
                  className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
                    role === "player" 
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                      : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
                  }`}
                >
                  {role === "player" && (
                    <div className="absolute top-4 right-4 text-primary">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  )}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors ${
                    role === "player" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                  }`}>
                    <User className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">I am a Player</h3>
                  <p className="text-sm text-muted-foreground font-normal">
                    Create your profile, upload highlights, and get discovered by scouts and agents worldwide.
                  </p>
                </div>

                <div 
                  onClick={() => setRole("agent")}
                  className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
                    role === "agent" 
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                      : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
                  }`}
                >
                  {role === "agent" && (
                    <div className="absolute top-4 right-4 text-primary">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  )}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors ${
                    role === "agent" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                  }`}>
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">I am an Agent</h3>
                  <p className="text-sm text-muted-foreground font-normal">
                    Manage your players, find new talent, and build your network in the football world.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  onClick={() => setStep(2)}
                  className="w-full h-14 text-lg font-bold gradient-green text-primary-foreground group"
                >
                  Continue <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="text-center mt-6 text-sm">
                  <span className="text-muted-foreground font-normal">Already have an account? </span>
                  <Link to="/login" className="text-primary font-semibold hover:underline">
                    Log In
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-10 animate-fade-in shadow-xl border-border/40">
              <button 
                onClick={() => setStep(1)}
                className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors font-medium"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to role selection
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Create your account</h2>
                <p className="mt-2 text-muted-foreground font-normal">
                  Enter your details to get started as a {role === "player" ? "player" : "agent"}.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleRegister}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold">Full Name</Label>
                    <Input 
                      id="fullName" 
                      placeholder="e.g. John Smith" 
                      className="h-11 bg-background/50"
                      required 
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        className="pl-10 h-11 bg-background/50"
                        required 
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-semibold">Location / City</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="location" 
                        placeholder="e.g. London, UK" 
                        className="pl-10 h-11 bg-background/50"
                        required 
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {role === "player" ? (
                    <div className="space-y-2 md:col-span-2 animate-fade-in text-left">
                      <Label htmlFor="position" className="text-sm font-semibold">Position</Label>
                      <Input 
                        id="position" 
                        placeholder="e.g. Striker, Midfielder" 
                        className="h-11 bg-background/50"
                        required 
                        value={formData.position}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2 md:col-span-2 animate-fade-in text-left">
                      <Label htmlFor="agencyName" className="text-sm font-semibold">Agency / Company</Label>
                      <Input 
                        id="agencyName" 
                        placeholder="e.g. Global Football Agency" 
                        className="h-11 bg-background/50"
                        required 
                        value={formData.agencyName}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 mt-4 gradient-green text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20" 
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Register Account"}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4 px-4 font-normal">
                  By registering, you agree to our <a href="#" className="underline hover:text-primary transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-primary transition-colors">Privacy Policy</a>.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
