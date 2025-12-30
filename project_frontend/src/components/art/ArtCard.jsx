import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const ArtCard = ({ art }) => {
  const slugOrId = art.slug || art._id;

  // Status Badge Logic
  const getStatusBadge = () => {
    switch (art.availabilityStatus) {
      case "sold":
        return (
          <span className="absolute top-3 left-3 bg-stone-900 dark:bg-stone-700 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider shadow-md">
            Sold
          </span>
        );
      case "not-for-sale":
        return (
          <span className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur text-stone-600 dark:text-stone-300 text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider shadow-sm">
            Not for Sale
          </span>
        );
      default:
        return null; 
    }
  };

  return (
    <div className="group bg-white dark:bg-stone-900 rounded-xl overflow-hidden border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200 dark:bg-stone-800">
        {getStatusBadge()}
        
        <img
          src={art.image?.url || "https://placehold.co/600x400?text=Art"}
          alt={art.image?.alt || art.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <Link 
          to={`/art/${slugOrId}`}
          className="absolute inset-0 bg-black/20 group-hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
        >
          <div className="bg-white dark:bg-stone-800 p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <ArrowUpRight className="text-rabuste-orange w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Details Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/art/${slugOrId}`} className="hover:underline">
            <h3 className="text-xl font-serif font-bold text-rabuste-text dark:text-white group-hover:text-rabuste-orange transition-colors line-clamp-1">
              {art.title}
            </h3>
          </Link>
          
          {/* Price logic */}
          {art.availabilityStatus === "available" && art.price ? (
            <span className="text-lg font-bold text-rabuste-text dark:text-stone-200 whitespace-nowrap">
              ₹ {art.price.toLocaleString()}
            </span>
          ) : (
            <span className="text-sm font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wide">
              {art.availabilityStatus === "sold" ? "Sold" : "Display"}
            </span>
          )}
        </div>

        <p className="text-sm text-rabuste-muted dark:text-stone-400 font-medium mb-4">
          By <span className="text-rabuste-text dark:text-stone-200">{art.artistName}</span>
        </p>

        {art.bestPairedCoffee && (
          <div className="mt-auto pt-4 border-t border-stone-100 dark:border-stone-800">
            <p className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">Best paired with</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-serif text-rabuste-gold font-medium">
                ☕ {art.bestPairedCoffee.name || "Our Special Brew"}
              </span>
            </div>
          </div>
        )}

        {/* Location / Meta */}
        <div className="mt-4 flex justify-between items-center text-xs text-stone-400 dark:text-stone-500 font-medium">
          <span>{art.displayLocation || "Gallery Wall"}</span>
          <Link to={`/art/${slugOrId}`} className="hover:text-rabuste-orange transition-colors">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArtCard;