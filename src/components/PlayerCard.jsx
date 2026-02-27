import { Link } from "react-router-dom";
import { MapPin, Video, Heart } from "lucide-react";

const PlayerCard = ({ player, isAgent, isScouted, onToggleScout }) => {
  return (
    <div className="relative group">
      <Link to={`/player/${player.id}`} className="glass-card-hover p-4 block h-full">
        <div className="flex items-start gap-4">
          <img
            src={player.imageUrl}
            alt={player.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-border/50"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{player.name}</h3>
              {player.hasVideo && <Video className="h-3.5 w-3.5 text-secondary flex-shrink-0" />}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold gradient-green text-primary-foreground">
                {player.position}
              </span>
              {player.secondaryPosition && (
                <span className="inline-block px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                  {player.secondaryPosition}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Age {player.age}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {player.location}
              </span>
              <span>•</span>
              <span>Div {player.division}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              player.status === "Actively Looking"
                ? "status-available"
                : player.status === "Open"
                ? "status-open"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {player.status}
          </span>
          {player.currentClub && (
            <span className="text-xs text-muted-foreground">{player.currentClub}</span>
          )}
        </div>
      </Link>

      {/* Scout/Save heart button - only for agents/admins */}
      {isAgent && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleScout();
          }}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all flex items-center justify-center ${
            isScouted 
              ? "bg-red-500/10 text-red-500 opacity-100" 
              : "bg-slate-800/50 text-white/40 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-slate-700"
          }`}
          title={isScouted ? "Remove from scouting list" : "Add to scouting list"}
        >
          <Heart className={`h-4 w-4 ${isScouted ? "fill-red-500" : ""}`} />
        </button>
      )}
    </div>
  );
};

export default PlayerCard;
