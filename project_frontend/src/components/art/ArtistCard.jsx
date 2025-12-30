import { MapPin } from "lucide-react";

const ArtistCard = ({ artist, location }) => { 
  if (!artist?.name) return null;

  return (
    <div className="space-y-3">
      {/* Artist Name & Role */}
      <div>
        <h3 className="font-serif text-2xl font-bold text-rabuste-text dark:text-white">
          {artist.name}
        </h3>
        <p className="text-sm font-medium text-rabuste-gold uppercase tracking-wider mt-1">
          Artist
        </p>
      </div>

      {/* Bio Text */}
      <p className="text-rabuste-muted dark:text-stone-400 text-sm leading-relaxed italic">
        {artist.bio || "A featured local artist whose work captures the essence of emotion and atmosphere, perfectly complementing the Rabuste ambience."}
      </p>

      {/* Stats Row  */}
      <div className="flex items-center gap-6 pt-2 text-xs font-bold uppercase text-rabuste-muted/70 tracking-widest">
        {location && (
          <div className="flex items-center gap-1">
             Displayed in: <span className="text-rabuste-text dark:text-stone-300">{location}</span>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default ArtistCard;