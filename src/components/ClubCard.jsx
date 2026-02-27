import { Link } from "react-router-dom";
import { MapPin, Shield, Users } from "lucide-react";

const ClubCard = ({ club }) => {
  return (
    <Link to={`/club/${club.id}`} className="glass-card-hover p-5 block">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
          {club.logoUrl}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{club.name}</h3>
            {club.verified && (
              <Shield className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {club.location}
            </span>
            <span>•</span>
            <span>Division {club.division}</span>
          </div>
        </div>
      </div>

      {club.recruiting && club.positionsNeeded.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Users className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-primary">Recruiting</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {club.positionsNeeded.map((pos) => (
              <span
                key={pos}
                className="px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {pos}
              </span>
            ))}
          </div>
        </div>
      )}

      {!club.recruiting && (
        <div className="mt-3">
          <span className="text-xs text-muted-foreground">Not currently recruiting</span>
        </div>
      )}
    </Link>
  );
};

export default ClubCard;
