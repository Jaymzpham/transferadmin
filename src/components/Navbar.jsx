import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, User, LogOut, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import logo from "@/assets/ta-logga-removebg.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setRole(null);
      }
    });

    const fetchUserRole = async (userId) => {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      if (data) setRole(data.role);
    };

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/search", label: "Search" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border/50 rounded-none shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Transfer Admin" className="h-16 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-slate-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/search">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900">
              <Search className="h-4 w-4" />
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-slate-100 p-0 overflow-hidden border border-border/50">
                  <User className="h-5 w-5 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">Logged in</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={role === "agent" ? "/edit-agent-profile" : "/edit-profile"} className="cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 font-semibold px-5">
                  Log In
                </Button>
              </Link>
              <Button size="sm" className="gradient-green text-primary-foreground font-semibold hover:opacity-90" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-slate-900" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border/30 rounded-none animate-fade-in shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium py-2 ${
                  location.pathname === link.to ? "text-primary" : "text-slate-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-border/30">
                <Link 
                  to={role === "agent" ? "/edit-agent-profile" : "/edit-profile"} 
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium py-2 flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" /> My Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium py-2 flex items-center gap-2 text-red-600"
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3 pt-2 border-t border-border/30">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full text-primary hover:bg-primary/10 font-semibold text-center py-2 h-9 flex items-center justify-center">
                    Log In
                  </Button>
                </Link>
                <Button size="sm" className="flex-1 gradient-green text-primary-foreground font-semibold" asChild>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
