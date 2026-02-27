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
  Menu,
  ChevronRight,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Search
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import profilePic from "@/assets/james-spurs1.png";

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "James Pham",
    location: "",
    position: "",
    agency_name: "",
    avatar_url: profilePic,
    role: "",
    age: "",
    bio: "I'm a professional football player focused on high performance and tactical discipline. Always striving to improve and contribute to the team's success.",
    experience: "Current: AFC United (Div 1)\nPrevious: Brommapojkarna (U19), Vasalunds IF",
    highlights: [
      { category: "Achievement", title: "Top Scorer Division 1", description: "Scored 18 goals in the 2023 season with AFC United." },
      { category: "Milestone", title: "National Team Debut", description: "First appearance for the U21 National Team in March 2023." },
      { category: "Title", title: "U19 Allsvenskan Winner", description: "Won the national youth league title with Brommapojkarna." }
    ],
    transfer_history: [
      { season: "25/26", date: "06/08/2025", left: "Tottenham", joined: "LAFC", mv: "€20.00m", fee: "€22.00m" },
      { season: "15/16", date: "28/08/2015", left: "Leverkusen", joined: "Tottenham", mv: "€16.00m", fee: "€30.00m" },
      { season: "13/14", date: "01/07/2013", left: "Hamburg", joined: "Leverkusen", mv: "€14.00m", fee: "€12.50m" },
      { season: "10/11", date: "01/07/2010", left: "Hamburger SV II", joined: "Hamburg", mv: "-", fee: "-" },
      { season: "09/10", date: "01/04/2010", left: "HSV U19", joined: "Hamburger SV II", mv: "-", fee: "-" },
      { season: "09/10", date: "01/07/2009", left: "Hamburg U17", joined: "HSV U19", mv: "-", fee: "-" },
      { season: "08/09", date: "01/08/2008", left: "Without Club", joined: "Hamburg U17", mv: "-", fee: "-" },
    ],
    vitals: {
      dob: "08/07/1992",
      age: "33",
      height: "1,84 m",
      position: "Left Winger",
      international: "South Korea",
      caps_goals: "141 / 54",
      place_of_birth: "Chuncheon, Gangwon",
      citizenship: "Korea, South"
    },
    current_club: "Tottenham Hotspur",
    status: "Not for Sale"
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      setUser(session.user);
      console.log("DEBUG: Logged in user ID:", session.user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("DEBUG: Supabase fetch error:", error);
        throw error;
      }

      if (data) {
        console.log("DEBUG: Profile data from DB:", data);
        if (data.role === "agent") {
           console.log("DEBUG: Role is AGENT, redirecting...");
           navigate("/edit-agent-profile");
           return;
        }
        setProfile(prev => ({ 
          ...prev, 
          ...data,
          full_name: data.full_name || prev.full_name,
          avatar_url: data.avatar_url || prev.avatar_url
        }));
      } else {
        console.warn("DEBUG: No profile data found for this ID.");
      }
    } catch (error) {
      toast.error("Error fetching profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      
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

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    setUpdating(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          location: profile.location,
          position: profile.role === 'player' ? profile.position : null,
          agency_name: profile.role === 'agent' ? profile.agency_name : null,
          age: profile.role === 'player' ? parseInt(profile.age) || null : null,
          updated_at: new Date(),
        })
        .eq("id", user?.id);

      if (error) throw error;
      toast.success("Profile synced successfully");
    } catch (error) {
      toast.error(error.message || "Error saving changes");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex font-sans selection:bg-primary/30 overflow-x-hidden text-slate-200">
      {/* Sidebar is dark by default */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-[#020617]">
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
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
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

        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[60] bg-[#020617]/98 backdrop-blur-xl animate-fade-in p-8 flex flex-col items-center justify-center text-center gap-6">
            <button 
              className="absolute top-6 right-6 text-slate-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Plus className="h-8 w-8 rotate-45" />
            </button>
            <Link to="/" className="text-2xl font-black text-white" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/search" className="text-2xl font-black text-white" onClick={() => setMobileMenuOpen(false)}>Search</Link>
            <Link to="/edit-profile" className="text-2xl font-black text-primary" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
          </div>
        )}
        
        <main className="flex-1 pb-20">
          {/* Hero Profile Section - Dark & Sleek */}
          <div className="relative border-b border-slate-800 px-8 py-12 overflow-hidden min-h-[240px] flex items-end">
             {/* Background Image with Overlay */}
             <div 
               className="absolute inset-0 bg-cover bg-center z-0 scale-105"
               style={{ 
                 backgroundImage: `url('https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=1200')`,
                 filter: 'brightness(0.35) saturate(1.2)'
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
                  <div className="absolute bottom-2 right-2 bg-primary p-2 rounded-full border-4 border-[#0f172a] shadow-lg">
                    <ShieldCheck className="h-4 w-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{profile.full_name || "New Recruit"}</h2>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 ${['Actively Looking', 'Open to Offers'].includes(profile.status) ? 'bg-primary text-[#0f172a]' : profile.status === 'Clubless' ? 'bg-red-500 text-white' : profile.status === 'Negotiating' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-200'} rounded-full text-[10px] font-black uppercase tracking-widest mx-auto md:mx-0 transition-all shadow-lg`}>
                      {profile.status}
                    </div>
                  </div>
                  <p className="text-slate-400 font-bold tracking-wide uppercase text-sm">Professional {profile.role} • {profile.location || "Global"}</p>
                </div>

                 <div className="flex items-center gap-3">
                    <Button className="h-10 gradient-green text-primary-foreground font-black px-6 rounded-xl shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs uppercase tracking-tight" onClick={handleUpdate}>
                       Save Changes
                    </Button>
                 </div>
             </div>
          </div>

          <div className="max-w-5xl mx-auto px-8 mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              
              {/* PRIMARY CONTENT (LEFT) */}
              <div className="lg:col-span-2 space-y-10">
                {/* Highlights Section - Compact Merit Style */}
                <section className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-xl p-8 transition-all hover:border-slate-700">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-black text-white uppercase tracking-tighter border-b-2 border-primary pb-1">Career Highlights</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profile.highlights?.map((item, idx) => (
                         <div key={idx} className="bg-[#020617] border border-slate-800 p-4 rounded-2xl relative group hover:border-primary/30 transition-all">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">
                               {item.category}
                            </span>
                            <h4 className="text-sm font-black text-white leading-tight mb-2">{item.title}</h4>
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                               {item.description}
                            </p>
                         </div>
                      ))}
                   </div>
                </section>

                {/* Transfer History Section */}
                <section className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-xl p-8 transition-all hover:border-slate-700">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-black text-white uppercase tracking-tighter border-b-2 border-primary pb-1">Transfer History</h3>
                      <button className="text-xs font-black text-slate-500 uppercase hover:text-primary transition-colors">Edit History</button>
                   </div>
                   
                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-separate border-spacing-y-1">
                         <thead>
                            <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                               <th className="px-3 pb-2">Season</th>
                               <th className="px-3 pb-2">Date</th>
                               <th className="px-3 pb-2">Left</th>
                               <th className="px-3 pb-2">Joined</th>
                               <th className="px-3 pb-2 text-right">MV</th>
                               <th className="px-3 pb-2 text-right">Fee</th>
                            </tr>
                         </thead>
                         <tbody>
                            {profile.transfer_history?.map((transfer, idx) => (
                               <tr key={idx} className="group bg-[#020617]/50 transition-all hover:bg-slate-900/80">
                                  <td className="px-3 py-2 border-y border-l border-slate-800/50 rounded-l-lg first:border-l group-hover:border-primary/20 transition-colors">
                                     <span className="text-[11px] font-bold text-slate-300">{transfer.season}</span>
                                  </td>
                                  <td className="px-3 py-2 border-y border-slate-800/50 group-hover:border-primary/20 transition-colors">
                                     <span className="text-[10px] font-medium text-slate-500">{transfer.date}</span>
                                  </td>
                                  <td className="px-3 py-2 border-y border-slate-800/50 group-hover:border-primary/20 transition-colors">
                                     <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-bold text-slate-300 underline underline-offset-2 decoration-slate-700 decoration-1">{transfer.left}</span>
                                     </div>
                                  </td>
                                  <td className="px-3 py-2 border-y border-slate-800/50 group-hover:border-primary/20 transition-colors">
                                     <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-bold text-white underline underline-offset-2 decoration-primary/30 decoration-1">{transfer.joined}</span>
                                     </div>
                                  </td>
                                  <td className="px-3 py-2 border-y border-slate-800/50 group-hover:border-primary/20 transition-colors text-right">
                                     <span className="text-[11px] font-medium text-slate-400">{transfer.mv}</span>
                                  </td>
                                  <td className="px-3 py-2 border-y border-r border-slate-800/50 rounded-r-lg group-hover:border-primary/20 transition-colors text-right">
                                     <span className="text-[11px] font-black text-primary">{transfer.fee}</span>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                      <div className="mt-4 flex justify-end">
                         <div className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                            Total transfer fees: <span className="text-white text-xs">€64.50m</span>
                         </div>
                      </div>
                   </div>
                </section>

                {/* About Section */}
                <section className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-xl p-8 transition-all hover:border-slate-700">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-black text-white uppercase tracking-tighter border-b-2 border-primary pb-1">Athlete Bio</h3>
                   </div>
                   <div className="space-y-4">
                      <p className="text-slate-400 text-sm leading-relaxed font-bold">
                         {profile.bio}
                      </p>
                      <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-1.5 mt-8 group">
                         Technical Report <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                   </div>
                </section>

                {/* Match Highlights GALLERY */}
                <section className="space-y-6">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter">Video Vault</h3>
                      <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
                         Full Archive <ExternalLink className="h-3 w-3" />
                      </button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2].map(i => (
                        <div key={i} className="group cursor-pointer relative">
                           <div className="aspect-[16/10] rounded-[2rem] overflow-hidden mb-4 shadow-2xl border border-slate-800 bg-slate-900 transition-all group-hover:border-primary/50 relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60 z-10" />
                              <img 
                                src={`https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=600&h=400&sig=${i}`} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-60" 
                                alt="Highlight" 
                              />
                              <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all bg-primary/10">
                                 <div className="bg-white text-[#020617] p-4 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                                    <Video className="h-6 w-6 fill-current" />
                                 </div>
                              </div>
                           </div>
                           <h4 className="font-bold text-white group-hover:text-primary transition-colors tracking-tight text-lg pl-2">Season Highlights {i}</h4>
                           <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1 pl-2">Division 1 • Scouting Ready</p>
                        </div>
                      ))}
                   </div>
                </section>
              </div>

              {/* SIDEBAR (RIGHT) */}
              <div className="space-y-8 lg:sticky lg:top-20">
                {/* Pro Specifications Card */}
                <section className="bg-gradient-to-br from-[#0f172a] to-[#020617] rounded-[2.5rem] border border-slate-800 p-8 shadow-2xl relative overflow-hidden group">
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-[50px] rounded-full group-hover:bg-primary/10 transition-all" />
                   
                   <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Pro Specifications</h3>
                   
                   <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">DOB / Age</p>
                         <p className="text-xs font-bold text-white">{profile.vitals?.dob} ({profile.vitals?.age})</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Height</p>
                         <p className="text-xs font-bold text-white">{profile.vitals?.height}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Position</p>
                         <p className="text-xs font-extrabold text-primary">{profile.vitals?.position}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Int. Caps</p>
                         <p className="text-xs font-bold text-white">{profile.vitals?.caps_goals}</p>
                      </div>
                      <div className="col-span-2 space-y-1 border-t border-slate-800/50 pt-4">
                         <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">National Team</p>
                         <div className="flex items-center gap-2">
                            <div className="w-4 h-3 bg-slate-800 rounded-sm overflow-hidden border border-slate-700">
                               <div className="w-full h-full bg-blue-900 flex items-center justify-center text-[6px] text-white">🇰🇷</div>
                            </div>
                            <p className="text-xs font-bold text-white">{profile.vitals?.international}</p>
                         </div>
                      </div>
                   </div>
                </section>

                {/* Status/Traits Card */}
                <section className="bg-gradient-to-br from-[#0f172a] to-[#020617] rounded-[2.5rem] border border-slate-800 p-8 shadow-2xl relative overflow-hidden group">
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full group-hover:bg-primary/20 transition-all" />
                   
                   <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Technical Attributes</h3>
                   <div className="flex flex-wrap gap-2.5 mb-10">
                      {["Top Speed", "Shooting", "Pace", "Handling", "Physical"].map(skill => (
                        <span key={skill} className="px-4 py-2 rounded-2xl border border-slate-800 bg-slate-900/50 text-[10px] font-black text-slate-300 uppercase tracking-widest shadow-lg">
                           {skill}
                        </span>
                      ))}
                   </div>

                   <div className="space-y-8 border-t border-slate-800/50 pt-8">
                      <div className="group">
                         <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Region</div>
                         <div className="flex items-center gap-2 text-white font-black group-hover:text-primary transition-colors">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm tracking-tight">{profile.location || "Global"}</span>
                         </div>
                      </div>
                      <div className="group">
                         <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Portfolio</div>
                         <div className="text-sm font-black text-white flex items-center gap-2.5 cursor-pointer group-hover:text-primary transition-colors">
                            <Globe className="h-4 w-4" />
                            <span>{profile.full_name?.replace(/\s/g, '').toLowerCase()}.pro</span>
                         </div>
                      </div>
                      <div className="group">
                         <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Encrypted ID</div>
                         <div className="text-sm font-black text-white flex items-center gap-2.5 cursor-pointer group-hover:text-primary transition-colors">
                            <Mail className="h-4 w-4" />
                            <span className="truncate max-w-[140px]">{user?.email}</span>
                         </div>
                      </div>
                   </div>

                   <div className="mt-12 flex flex-col gap-3">
                      <Button className="h-11 bg-white text-[#020617] hover:bg-slate-200 font-black text-sm rounded-2xl shadow-2xl active:scale-95 transition-all uppercase tracking-tighter">
                         Message Agent
                      </Button>
                      <Button variant="outline" className="h-11 border-slate-800 bg-transparent text-white font-bold text-sm rounded-2xl hover:bg-slate-800 border-2">
                         Share Link
                      </Button>
                   </div>
                </section>

                {/* Quick Edit (Mini-Form) */}
                <section className="bg-[#0f172a] rounded-3xl border-2 border-primary/10 p-8 shadow-2xl">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-primary/10 rounded-lg">
                         <Save className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-widest mt-0.5">Quick Sync</h3>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Club</p>
                         <Input 
                            id="current_club"
                            value={profile.current_club}
                            onChange={handleInputChange}
                            className="bg-slate-900 border-slate-800 h-9 rounded-xl font-bold text-white focus:border-primary/50 transition-all text-[11px]"
                         />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Transfer Status</p>
                         <Select 
                            value={profile.status} 
                            onValueChange={(value) => setProfile(prev => ({ ...prev, status: value }))}
                         >
                            <SelectTrigger className="bg-slate-900 border-slate-800 h-9 rounded-xl font-bold text-white focus:border-primary/50 text-[11px]">
                               <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                               <SelectItem value="Actively Looking">Actively Looking</SelectItem>
                               <SelectItem value="Open to Offers">Open to Offers</SelectItem>
                               <SelectItem value="Not for Sale">Not for Sale</SelectItem>
                               <SelectItem value="Negotiating">Negotiating</SelectItem>
                               <SelectItem value="Clubless">Clubless</SelectItem>
                            </SelectContent>
                         </Select>
                      </div>
                      <Button 
                         onClick={handleUpdate}
                         className="w-full h-10 gradient-green text-primary-foreground font-black rounded-xl shadow-lg mt-2 uppercase tracking-tighter text-xs hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                         {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Availability"}
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

export default EditProfile;
