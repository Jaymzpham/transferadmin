import { useParams, Link } from "react-router-dom";
import { MapPin, Shield, ArrowLeft, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { clubs } from "@/data/mockData";

const ClubProfile = () => {
  const { id } = useParams();
  const club = clubs.find((c) => c.id === id);

  if (!club) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Club not found.</p>
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
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center text-4xl flex-shrink-0">
              {club.logoUrl}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{club.name}</h1>
                {club.verified && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full status-available font-medium">
                    <Shield className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{club.location}</span>
                <span className="mx-1">•</span>
                <span>Division {club.division}</span>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-3">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{club.about}</p>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Training Days</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {club.trainingDays.map((day) => (
                  <span key={day} className="px-2.5 py-1 rounded-lg text-xs bg-card text-muted-foreground border border-border/50">
                    {day}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Contact Person</span>
              </div>
              <span className="text-sm text-muted-foreground">{club.contactPerson}</span>
            </div>
          </div>

          {/* Positions needed */}
          {club.recruiting && club.positionsNeeded.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-foreground mb-3">Positions Needed</h3>
              <div className="flex flex-wrap gap-2">
                {club.positionsNeeded.map((pos) => (
                  <span
                    key={pos}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {pos}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-3">
            <Button className="gradient-green text-primary-foreground font-semibold hover:opacity-90 flex-1">
              Contact Club
            </Button>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              Save Club
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>

  );
};

export default ClubProfile;
