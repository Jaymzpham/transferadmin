import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { players as allPlayersData } from "@/data/mockData";
import PlayerCard from "@/components/PlayerCard";
import { 
  User, 
  MapPin, 
  Briefcase, 
  Camera, 
  Loader2, 
  Save, 
  Trophy,
  ShieldCheck,
  Globe,
  Mail,
  Video,
  Plus,
  MoreHorizontal,
  ChevronRight,
  ExternalLink,
  Users,
  Building2,
  ScrollText,
  Clock,
  CheckCircle2,
  X,
  Search as SearchIcon,
  Menu
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EditAgentProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scoutedIds, setScoutedIds] = useState([]);
  const [profile, setProfile] = useState({
    full_name: "J. Bond",
    agency_name: "Apex Sports Management",
    location: "Milan, Italy",
    avatar_url: null,
    bio: "FIFA Licensed Agent with over 12 years of experience in the European market. Specializing in youth development and strategic career planning for elite athletes.",
    license_id: "FIFA-2024-8892",
    years_experience: "12+",
    languages: "Italian, English, Spanish",
    focus_regions: "Europe, South America",
    roster: [
      { id: "p1", name: "Lucas Silva", position: "CM", club: "AC Milan", image: null },
      { id: "p2", name: "Marco Verratti Jr.", position: "CDM", club: "PSG", image: null },
      { id: "p3", name: "Anders Lind", position: "CB", club: "Ajax", image: null },
      { id: "p4", name: "Mateo Kovacic", position: "CM", club: "Man City", image: null },
      { id: "p5", name: "Karim Benzema Jr.", position: "ST", club: "Al Ittihad", image: null },
      { id: "p6", name: "Luka Modric", position: "CM", club: "Real Madrid", image: null }
    ],
    track_record: [
      { season: "24/25", player: "Lucas Silva", from: "Santos", to: "AC Milan", fee: "€25.00m" },
      { season: "23/24", player: "Anders Lind", from: "Copenhagen", to: "Ajax", fee: "€8.00m" }
    ],
    status: "Accepting New Clients"
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          navigate("/login");
          return;
        }

        setUser(session.user);
        
        // Fetch existing scouting list (shortlist)
        const saved = localStorage.getItem(`scouting_${session.user.id}`);
        if (saved) {
          setScoutedIds(JSON.parse(saved));
        } else {
          // Add some default mock data for demonstration if list is empty
          const defaultScouted = ["1", "4", "7", "10"];
          setScoutedIds(defaultScouted);
          localStorage.setItem(`scouting_${session.user.id}`, JSON.stringify(defaultScouted));
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          if (data.role === "player") {
             navigate("/edit-profile");
             return;
          }
          setProfile(prev => ({ 
            ...prev, 
            ...data,
            full_name: data.full_name ?? prev.full_name ?? "",
            avatar_url: data.avatar_url ?? prev.avatar_url ?? null,
            agency_name: data.agency_name ?? prev.agency_name ?? "",
            location: data.location ?? prev.location ?? "",
            bio: data.bio ?? prev.bio ?? ""
          }));
        }
      } catch (error) {
        toast.error("Error fetching agent profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };

  const handleAvatarUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file || !user?.id) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image is too large (max 5MB).");
        return;
      }

      setUpdating(true);
      const fileExt = (file.name.split(".").pop() || "jpg").toLowerCase();
      const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        toast.error(uploadError.message || "Upload failed.");
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl, updated_at: new Date() })
        .eq("id", user.id);

      if (updateError) throw updateError;

      toast.success("Profile photo updated!");
    } catch (error) {
      toast.error(error?.message || "Error uploading image");
      console.error(error);
    } finally {
      if (e.target) e.target.value = "";
      setUpdating(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          location: profile.location,
          bio: profile.bio,
          updated_at: new Date()
        })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleScout = (playerId) => {
    setScoutedIds(prev => {
      const newList = prev.filter(id => id !== playerId);
      if (user) {
        localStorage.setItem(`scouting_${user.id}`, JSON.stringify(newList));
      }
      toast.success("Player removed from scouting list");
      return newList;
    });
  };

  const scoutedPlayers = allPlayersData.filter(p => scoutedIds.includes(p.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#020617]">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-primary/30">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Header - Dark Mode */}
        <header className="bg-[#0f172a] border-b border-slate-800 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <div className="lg:hidden">
                <button onClick={() => setMobileMenuOpen(true)}>
                  <Menu className="h-6 w-6 text-slate-400" />
                </button>
              </div>
              <h1 className="text-xl font-black text-white tracking-tight uppercase">Dashboard</h1>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                 <Input className="w-64 h-6 pl-9 bg-slate-900 border-slate-800 rounded-lg text-[11px] text-white placeholder:text-slate-500 focus:border-primary/50 transition-all font-bold" placeholder="Search profiles..." />
                 <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shadow-inner ring-2 ring-primary/10">
                 {profile.avatar_url ? (
                   <img src={profile.avatar_url} className="w-full h-full object-cover" />
                 ) : (
                   <div className="h-full w-full flex items-center justify-center text-slate-500"><User className="h-4 w-4" /></div>
                 )}
              </div>
           </div>
        </header>

        <main className="flex-1 pb-20">
          {/* Hero Profile Section */}
          <div className="relative border-b border-slate-800 px-8 py-12 overflow-hidden min-h-[240px] flex items-end">
             {/* Background Image with Overlay */}
             <div 
               className="absolute inset-0 bg-cover bg-center z-0 scale-105"
               style={{ 
                 backgroundImage: `url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200')`,
                 filter: 'brightness(0.3) saturate(1.2)'
               }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent z-[1]" />
             <div className="absolute inset-0 bg-primary/5 backdrop-blur-[2px] z-[2]" />
             
             <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center md:items-end gap-8 relative z-10">
                <div className="relative group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-[6px] border-[#020617] bg-slate-800 shadow-2xl relative">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-slate-600" />
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                      <Camera className="h-8 w-8 text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </label>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full border-4 border-[#0f172a] shadow-lg">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{profile.full_name}</h2>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest mx-auto md:mx-0">
                      FIFA LICENSED AGENT
                    </div>
                  </div>
                  <p className="text-slate-400 font-bold tracking-wide uppercase text-sm flex items-center justify-center md:justify-start gap-2">
                    <Building2 className="h-4 w-4 text-primary" /> {profile.agency_name} • <MapPin className="h-4 w-4" /> {profile.location}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button className="h-10 gradient-green text-primary-foreground font-black px-6 rounded-xl shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs uppercase tracking-tight" onClick={handleUpdate}>
                       Save Changes
                    </Button>
                </div>
             </div>
          </div>

          <div className="max-w-5xl mx-auto px-8 mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* PRIMARY CONTENT (LEFT) */}
              <div className="lg:col-span-2 space-y-10">
                
                {/* About Section */}
                <section className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-xl p-8 transition-all hover:border-slate-700">
                   <h3 className="text-lg font-black text-white uppercase tracking-tighter border-b-2 border-primary pb-1 mb-6 inline-block">Professional Bio</h3>
                   <Textarea 
                      id="bio"
                      value={profile.bio}
                      onChange={handleInputChange}
                      className="bg-[#020617] border-slate-800 min-h-[120px] rounded-2xl text-slate-300 font-medium leading-relaxed resize-none focus:border-primary/50 transition-all"
                   />
                </section>

                {/* Roster Section */}
                <section className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-xl p-8 transition-all hover:border-slate-700">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter border-b-2 border-primary pb-1">Client Roster</h3>
                      </div>
                      <Button variant="ghost" className="text-[10px] font-black text-slate-500 uppercase hover:text-primary transition-colors h-auto p-0 flex items-center gap-1 mt-1">
                        <Plus className="h-3 w-3" /> Add Player
                      </Button>
                   </div>
                   
                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-separate border-spacing-y-1">
                         <thead>
                            <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                               <th className="px-3 pb-2">Player</th>
                               <th className="px-3 pb-2">Position</th>
                               <th className="px-3 pb-2">Club</th>
                               <th className="px-3 pb-2 text-right">Action</th>
                            </tr>
                         </thead>
                         <tbody>
                            {profile.roster.map((player, idx) => (
                               <tr key={idx} className="group bg-[#020617]/50 transition-all hover:bg-slate-900/80">
                                  <td className="px-3 py-3 border-y border-l border-slate-800/50 rounded-l-lg group-hover:border-primary/20">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
                                        {player.image ? (
                                          <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                                        ) : (
                                          <User className="w-4 h-4 text-slate-500 m-auto mt-2" />
                                        )}
                                      </div>
                                      <span className="text-[11px] font-black text-white">{player.name}</span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-3 border-y border-slate-800/50 group-hover:border-primary/20">
                                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-md">
                                      {player.position}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3 border-y border-slate-800/50 text-[11px] font-bold text-slate-400 group-hover:border-primary/20">
                                    {player.club}
                                  </td>
                                  <td className="px-3 py-3 border-y border-r border-slate-800/50 rounded-r-lg text-right group-hover:border-primary/20">
                                    <button className="p-2 text-slate-600 hover:text-primary transition-colors">
                                      <ChevronRight className="h-4 w-4" />
                                    </button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </section>

                {/* Scouting List Section */}
                <section className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-xl p-8 transition-all hover:border-slate-700">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter border-b-2 border-primary pb-1">Scouting List</h3>
                      </div>
                      <Link to="/search" className="text-xs font-black text-slate-500 uppercase hover:text-primary transition-colors flex items-center gap-1">
                        Find More Players <ExternalLink className="h-3 w-3" />
                      </Link>
                   </div>
                   
                   {scoutedPlayers.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-1">
                           <thead>
                              <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                 <th className="px-3 pb-2">Player</th>
                                 <th className="px-3 pb-2">Position</th>
                                 <th className="px-3 pb-2">Location</th>
                                 <th className="px-3 pb-2">Status</th>
                                 <th className="px-3 pb-2 text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody>
                              {scoutedPlayers.map((player) => (
                                 <tr key={player.id} className="group bg-[#020617]/50 transition-all hover:bg-slate-900/80">
                                    <td className="px-3 py-3 border-y border-l border-slate-800/50 rounded-l-lg group-hover:border-primary/20">
                                      <Link to={`/player/${player.id}`} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
                                          {player.imageUrl ? (
                                            <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover" />
                                          ) : (
                                            <User className="w-4 h-4 text-slate-500 m-auto mt-2" />
                                          )}
                                        </div>
                                        <span className="text-[11px] font-black text-white">{player.name}</span>
                                      </Link>
                                    </td>
                                    <td className="px-3 py-3 border-y border-slate-800/50 group-hover:border-primary/20">
                                      <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-md">
                                        {player.position}
                                      </span>
                                    </td>
                                    <td className="px-3 py-3 border-y border-slate-800/50 text-[11px] font-bold text-slate-400 group-hover:border-primary/20">
                                      {player.location}
                                    </td>
                                    <td className="px-3 py-3 border-y border-slate-800/50 group-hover:border-primary/20">
                                      <span className={`text-[9px] font-black uppercase tracking-widest ${
                                        player.status === "Actively Looking" ? "text-green-400" : "text-blue-400"
                                      }`}>
                                        {player.status}
                                      </span>
                                    </td>
                                    <td className="px-3 py-3 border-y border-r border-slate-800/50 rounded-r-lg text-right group-hover:border-primary/20">
                                      <button 
                                        onClick={() => handleToggleScout(player.id)}
                                        className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                      </div>
                   ) : (
                      <div className="text-center py-12 bg-[#020617] rounded-3xl border border-dashed border-slate-800">
                         <SearchIcon className="h-10 w-10 text-slate-700 mx-auto mb-4" />
                         <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-4">No players scouted yet</p>
                         <Link to="/search">
                            <Button variant="outline" className="h-9 border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs uppercase font-black">
                               Go to Search
                            </Button>
                         </Link>
                      </div>
                   )}
                </section>

                {/* Track Record Section */}
                <section className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-xl p-8 transition-all hover:border-slate-700 text-slate-200">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-black text-white uppercase tracking-tighter border-b-2 border-primary pb-1">Recent Transfers</h3>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-separate border-spacing-y-1">
                         <thead>
                            <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                               <th className="px-3 pb-2">Season</th>
                               <th className="px-3 pb-2">Player</th>
                               <th className="px-3 pb-2">From</th>
                               <th className="px-3 pb-2">To</th>
                               <th className="px-3 pb-2 text-right">Fee</th>
                            </tr>
                         </thead>
                         <tbody>
                            {profile.track_record.map((deal, idx) => (
                               <tr key={idx} className="group bg-[#020617]/50 transition-all hover:bg-slate-900/80">
                                  <td className="px-3 py-3 border-y border-l border-slate-800/50 rounded-l-lg text-[11px] font-bold text-slate-400 group-hover:border-primary/20">{deal.season}</td>
                                  <td className="px-3 py-3 border-y border-slate-800/50 text-[11px] font-black text-white group-hover:border-primary/20">{deal.player}</td>
                                  <td className="px-3 py-3 border-y border-slate-800/50 text-[11px] font-bold text-slate-300 group-hover:border-primary/20">{deal.from}</td>
                                  <td className="px-3 py-3 border-y border-slate-800/50 text-[11px] font-bold text-primary group-hover:border-primary/20">{deal.to}</td>
                                  <td className="px-3 py-3 border-y border-r border-slate-800/50 rounded-r-lg text-[11px] font-black text-right text-primary group-hover:border-primary/20">{deal.fee}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </section>
              </div>

              {/* SIDEBAR (RIGHT) */}
              <div className="space-y-8 lg:sticky lg:top-20">
                {/* Agent Specs Card */}
                <section className="bg-gradient-to-br from-[#0f172a] to-[#020617] rounded-[2.5rem] border border-slate-800 p-6 shadow-2xl relative overflow-hidden group">
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full group-hover:bg-primary/20 transition-all" />
                   
                   <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Agent Specifications</h3>
                   
                   <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600">
                          <ScrollText className="h-3 w-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest">FIFA License</span>
                        </div>
                        <p className="text-xs font-black text-white">{profile.license_id}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="h-3 w-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Experience</span>
                        </div>
                        <p className="text-xs font-black text-white">{profile.years_experience}</p>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Globe className="h-3 w-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Focus Regions</span>
                        </div>
                        <p className="text-xs font-black text-white">{profile.focus_regions}</p>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Users className="h-3 w-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Languages</span>
                        </div>
                        <p className="text-xs font-black text-white">{profile.languages}</p>
                      </div>
                   </div>

                   <div className="mt-8 flex flex-col gap-2">
                      <Button className="h-9 bg-white text-[#020617] hover:bg-slate-200 font-black text-[11px] rounded-xl shadow-2xl active:scale-95 transition-all uppercase tracking-tighter">
                         Message Agent
                      </Button>
                      <Button variant="outline" className="h-9 border-slate-800 bg-transparent text-white font-bold text-[11px] rounded-xl hover:bg-slate-800 border-2">
                         Request Roster
                      </Button>
                   </div>
                </section>

                {/* Status Section */}
                <section className="bg-[#0f172a] rounded-3xl border-2 border-primary/10 p-6 shadow-2xl">
                   <div className="flex items-center gap-3 mb-5">
                      <div className="p-1.5 bg-primary/10 rounded-lg">
                         <ShieldCheck className="h-3 w-3 text-primary" />
                      </div>
                      <h3 className="text-[11px] font-black text-white uppercase tracking-widest mt-0.5">Availability</h3>
                   </div>
                   
                   <div className="space-y-3">
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</p>
                         <Input
                            id="full_name"
                            value={profile.full_name || ""}
                            onChange={handleInputChange}
                            className="bg-slate-900 border-slate-800 h-8 rounded-lg font-bold text-white focus:border-primary/50 transition-all text-[10px]"
                         />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Location</p>
                         <Input
                            id="location"
                            value={profile.location || ""}
                            onChange={handleInputChange}
                            className="bg-slate-900 border-slate-800 h-8 rounded-lg font-bold text-white focus:border-primary/50 transition-all text-[10px]"
                         />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Agency Name</p>
                         <Input 
                            id="agency_name"
                            value={profile.agency_name || ""}
                            onChange={handleInputChange}
                            className="bg-slate-900 border-slate-800 h-8 rounded-lg font-bold text-white focus:border-primary/50 transition-all text-[10px]"
                         />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Work Status</p>
                         <Select 
                            value={profile.status} 
                            onValueChange={(val) => setProfile(prev => ({...prev, status: val}))}
                         >
                            <SelectTrigger className="bg-slate-900 border-slate-800 h-8 rounded-lg font-bold text-white focus:border-primary/50 text-[10px]">
                               <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                               <SelectItem value="Accepting New Clients">Accepting New Clients</SelectItem>
                               <SelectItem value="Portfolio Full">Portfolio Full</SelectItem>
                               <SelectItem value="Consulting Only">Consulting Only</SelectItem>
                            </SelectContent>
                         </Select>
                      </div>
                      <Button 
                         onClick={handleUpdate}
                         className="w-full h-9 gradient-green text-primary-foreground font-black rounded-xl shadow-lg mt-1 uppercase tracking-tighter text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                         {updating ? <Loader2 className="h-3 w-3 animate-spin" /> : "Update Status"}
                      </Button>
                   </div>
                </section>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default EditAgentProfile;
