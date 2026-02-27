import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  MessageSquare, 
  Trophy, 
  Users,
  LayoutDashboard
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import logo from "@/assets/ta-logga-removebg.png";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [role, setRole] = useState(null);
  
  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (data) setRole(data.role);
      }
    };
    fetchUserRole();
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const profilePath = role === "agent" ? "/edit-agent-profile" : "/edit-profile";

  const menuItems = [
    { icon: Home, label: "Home", to: "/" },
    { icon: Search, label: "Search", to: "/search" },
    { icon: LayoutDashboard, label: "Dashboard", to: profilePath },
    { icon: Users, label: "Players", to: "/search?type=players" },
    { icon: MessageSquare, label: "Messages", to: "#" },
    { icon: Trophy, label: "Scouting", to: "#" },
  ];

  const bottomItems = [
    { icon: Settings, label: "Settings", to: profilePath },
  ];

  return (
    <div className="hidden lg:flex flex-col w-64 bg-stone-50 border-r border-stone-200 h-screen sticky top-0 shrink-0">
      <div className="p-6">
        <Link to="/" className="flex items-center mb-8">
          <img src={logo} alt="Transfer Admin" className="h-16 w-auto" />
        </Link>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                location.pathname === item.to 
                  ? "bg-slate-900/5 text-slate-900" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-900/5"
              }`}
            >
              <item.icon className={`h-5 w-5 ${location.pathname === item.to ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`} />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-1 border-t border-stone-200">
        {bottomItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              location.pathname === item.to 
                ? "bg-slate-900/5 text-slate-900" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-900/5"
            }`}
          >
            <item.icon className="h-5 w-5 text-slate-400" />
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all text-left"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
