import { useParams, Link } from "react-router-dom";
import { MapPin, Video, ArrowLeft, Ruler, Footprints, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { players } from "@/data/mockData";

const PlayerProfile = () => {
  const { id } = useParams();
  const player = players.find((p) => p.id === id);

  if (!player) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Player not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <Link to="/search" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to search
        </Link>

        <div className="glass-card p-6 md:p-8 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
            <img
              src={player.imageUrl}
              alt={player.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-border/50"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{player.name}</h1>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    player.status === "Actively Looking"
                      ? "status-available"
                      : player.status === "Open"
                      ? "status-open"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {player.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-lg text-sm font-semibold gradient-green text-primary-foreground">
                  {player.position}
                </span>
                {player.secondaryPosition && (
                  <span className="px-3 py-1 rounded-lg text-sm font-medium bg-muted text-muted-foreground">
                    {player.secondaryPosition}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{player.location}</span>
                <span className="mx-1">•</span>
                <span>Division {player.division}</span>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Calendar className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <div className="text-lg font-bold text-foreground">{player.age}</div>
              <div className="text-xs text-muted-foreground">Age</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Ruler className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <div className="text-lg font-bold text-foreground">{player.height}</div>
              <div className="text-xs text-muted-foreground">Height</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Footprints className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <div className="text-lg font-bold text-foreground">{player.strongFoot}</div>
              <div className="text-xs text-muted-foreground">Strong Foot</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Shield className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <div className="text-lg font-bold text-foreground">Div {player.division}</div>
              <div className="text-xs text-muted-foreground">Level</div>
            </div>
          </div>

          {/* Club history */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-3">Club History</h3>
            <div className="space-y-2">
              {player.currentClub && (
                <div className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3">
                  <span className="text-sm text-foreground">{player.currentClub}</span>
                  <span className="text-xs text-primary font-medium">Current</span>
                </div>
              )}
              {player.previousClub && (
                <div className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3">
                  <span className="text-sm text-foreground">{player.previousClub}</span>
                  <span className="text-xs text-muted-foreground">Previous</span>
                </div>
              )}
              {!player.currentClub && !player.previousClub && (
                <p className="text-sm text-muted-foreground">No club history listed</p>
              )}
            </div>
          </div>

          {/* Video */}
          {player.hasVideo && (
            <div className="mb-8">
              <h3 className="font-semibold text-foreground mb-3">Highlights</h3>
              <a
                href={player.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-secondary hover:underline"
              >
                <Video className="h-4 w-4" />
                Watch video highlights
              </a>
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-3">
            <Button className="gradient-green text-primary-foreground font-semibold hover:opacity-90 flex-1">
              Contact Player
            </Button>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              Save Profile
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>

  );
};

export default PlayerProfile;
