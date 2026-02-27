import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const TrialCard = ({ trial }) => {
  const dateObj = new Date(trial.date);
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="glass-card-hover p-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
          {trial.clubLogo}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">{trial.clubName}</h3>
          <span className="text-xs text-muted-foreground">Division {trial.division}</span>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="flex items-center gap-1 text-primary text-xs font-medium">
            <Users className="h-3 w-3" />
            {trial.spotsLeft} spots
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formattedDate}</span>
          <Clock className="h-3.5 w-3.5 ml-2" />
          <span>{trial.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{trial.location}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {trial.positions.map((pos) => (
            <span
              key={pos}
              className="px-2 py-0.5 rounded-md text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20"
            >
              {pos}
            </span>
          ))}
        </div>
        <Button size="sm" className="gradient-green text-primary-foreground font-semibold text-xs hover:opacity-90">
          Apply
        </Button>
      </div>
    </div>
  );
};

export default TrialCard;
