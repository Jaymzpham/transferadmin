import { Link } from "react-router-dom";
import { ArrowRight, Users, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlayerCard from "@/components/PlayerCard";
import ClubCard from "@/components/ClubCard";
import TrialCard from "@/components/TrialCard";
import { players, clubs, trialSessions } from "@/data/mockData";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const activePlayers = players.filter((p) => p.status === "Actively Looking");
  const recruitingClubs = clubs.filter((c) => c.recruiting);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <div className="absolute inset-0 bg-background/40" />

          <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 leading-tight">
              Find Your Next{" "}
              <span className="text-gradient-green">Club.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10">
              The modern football network for players and clubs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/search">
                <Button size="lg" className="gradient-green text-primary-foreground font-semibold text-base px-8 h-12 hover:opacity-90 transition-opacity">
                  I Am A Player
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/search">
                <Button size="lg" variant="outline" className="border-border text-foreground font-semibold text-base px-8 h-12 hover:bg-muted transition-colors">
                  I Represent A Club
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="h-4 w-4 text-primary mr-1.5" />
                  <span className="text-2xl font-bold text-foreground">1.2k</span>
                </div>
                <span className="text-xs text-muted-foreground">Active Players</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Trophy className="h-4 w-4 text-secondary mr-1.5" />
                  <span className="text-2xl font-bold text-foreground">340</span>
                </div>
                <span className="text-xs text-muted-foreground">Clubs</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Zap className="h-4 w-4 text-primary mr-1.5" />
                  <span className="text-2xl font-bold text-foreground">89</span>
                </div>
                <span className="text-xs text-muted-foreground">Trials This Week</span>
              </div>
            </div>
          </div>
        </section>

        {/* Discovery Sections */}
        <div className="container mx-auto px-4 space-y-24 py-24 pb-32">
          
          {/* Active Players - Discover Feed Style */}
          <section className="animate-slide-up">
            <div className="bg-[#0f172a]/40 border border-slate-800/60 p-8 rounded-[3rem] shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-10 pl-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Active Talent</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Players looking for trial opportunities</p>
                    </div>
                  </div>
                  <Link to="/search" className="group text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-1 transition-all">
                    Global Database <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activePlayers.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
            </div>
          </section>

          {/* Recruiting Clubs - Partners Section Style */}
          <section className="animate-slide-up">
            <div className="bg-gradient-to-br from-[#0f172a]/60 to-[#020617]/40 border border-slate-800/60 p-8 rounded-[3rem] shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-10 pl-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-secondary/10 rounded-2xl">
                        <Trophy className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Club Network</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Clubs actively scouting new talent</p>
                    </div>
                  </div>
                  <Link to="/search" className="group text-[10px] font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-1 transition-all">
                    Partner Clubs <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recruitingClubs.map((club) => (
                    <ClubCard key={club.id} club={club} />
                  ))}
                </div>
            </div>
          </section>

          {/* Upcoming Trials - Event Style */}
          <section className="animate-slide-up">
            <div className="bg-[#0f172a]/30 border border-dashed border-slate-800/80 p-8 rounded-[3rem] shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-10 pl-4">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                      <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Live Trials</h2>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Upcoming events and open tryouts</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trialSessions.map((trial) => (
                    <TrialCard key={trial.id} trial={trial} />
                  ))}
                </div>
                
                <div className="mt-12 text-center">
                   <Link to="/search?type=trials">
                      <Button variant="ghost" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">
                         Explore All Trial Events
                      </Button>
                   </Link>
                </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
