import { useState } from "react";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlayerCard from "@/components/PlayerCard";
import ClubCard from "@/components/ClubCard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useEffect } from "react";
import { players, clubs, positions, divisions } from "@/data/mockData";

const Search = () => {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("players");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [activeOnly, setActiveOnly] = useState(false);
  const [hasVideoOnly, setHasVideoOnly] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [scoutedPlayers, setScoutedPlayers] = useState([]); // List of player IDs

  useEffect(() => {
    const checkRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (data) setUserRole(data.role);
        
        // Fetch existing scouting list (shortlist)
        // Note: In a real app, we'd fetch from a 'scouting_list' table
        // For now, let's use localStorage to simulate if we don't have the table yet
        const saved = localStorage.getItem(`scouting_${session.user.id}`);
        if (saved) setScoutedPlayers(JSON.parse(saved));
      }
    };
    checkRole();
  }, []);

  const toggleScouted = (playerId) => {
    setScoutedPlayers(prev => {
      const isScouted = prev.includes(playerId);
      const newList = isScouted 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId];
      
      // Save for current user
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          localStorage.setItem(`scouting_${session.user.id}`, JSON.stringify(newList));
        }
      });

      toast.success(isScouted ? "Removed from scouting list" : "Added to scouting list");
      return newList;
    });
  };

  const filteredPlayers = players.filter((p) => {
    if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.location.toLowerCase().includes(query.toLowerCase())) return false;
    if (selectedPosition && p.position !== selectedPosition && p.secondaryPosition !== selectedPosition) return false;
    if (selectedDivision && p.division !== selectedDivision) return false;
    if (activeOnly && p.status !== "Actively Looking") return false;
    if (hasVideoOnly && !p.hasVideo) return false;
    return true;
  });

  const filteredClubs = clubs.filter((c) => {
    if (query && !c.name.toLowerCase().includes(query.toLowerCase()) && !c.location.toLowerCase().includes(query.toLowerCase())) return false;
    if (selectedDivision && c.division !== selectedDivision) return false;
    return true;
  });

  const clearFilters = () => {
    setSelectedPosition(null);
    setSelectedDivision(null);
    setActiveOnly(false);
    setHasVideoOnly(false);
  };

  const hasActiveFilters = selectedPosition || selectedDivision || activeOnly || hasVideoOnly;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 pt-24 pb-16">
        {/* Search header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Search</h1>
          <p className="text-muted-foreground">Find players and clubs across all divisions</p>
        </div>

        {/* Search bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or location..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`border-border h-11 px-4 ${showFilters ? "bg-primary/10 border-primary/30 text-primary" : "text-muted-foreground"}`}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-card rounded-xl w-fit">
          <button
            onClick={() => setTab("players")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "players" ? "gradient-green text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Players
          </button>
          <button
            onClick={() => setTab("clubs")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "clubs" ? "gradient-green text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Clubs
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="glass-card p-5 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground text-sm">Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <X className="h-3 w-3" /> Clear all
                </button>
              )}
            </div>

            {tab === "players" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-2 block">Position</label>
                  <div className="flex flex-wrap gap-2">
                    {positions.map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setSelectedPosition(selectedPosition === pos ? null : pos)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedPosition === pos
                            ? "gradient-green text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeOnly}
                      onChange={(e) => setActiveOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-border accent-primary"
                    />
                    <span className="text-xs text-muted-foreground">Actively Looking only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasVideoOnly}
                      onChange={(e) => setHasVideoOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-border accent-primary"
                    />
                    <span className="text-xs text-muted-foreground">Has video</span>
                  </label>
                </div>
              </div>
            )}

            <div className="mt-4">
              <label className="text-xs text-muted-foreground font-medium mb-2 block">Division</label>
              <div className="flex gap-2">
                {divisions.map((div) => (
                  <button
                    key={div}
                    onClick={() => setSelectedDivision(selectedDivision === div ? null : div)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedDivision === div
                        ? "gradient-green text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Div {div}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tab === "players"
            ? filteredPlayers.map((p) => (
                <PlayerCard 
                  key={p.id} 
                  player={p} 
                  isAgent={userRole === "agent"}
                  isScouted={scoutedPlayers.includes(p.id)}
                  onToggleScout={() => toggleScouted(p.id)}
                />
              ))
            : filteredClubs.map((c) => <ClubCard key={c.id} club={c} />)}
        </div>

        {((tab === "players" && filteredPlayers.length === 0) || (tab === "clubs" && filteredClubs.length === 0)) && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No results found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Search;
