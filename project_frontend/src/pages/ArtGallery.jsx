import React, { useState, useEffect } from "react";
import ArtCard from "../components/art/ArtCard"; 
import { Sparkles, Tag, X } from "lucide-react"; 
import { fetchPublicArts } from "../api/art.api.js"; 

const ArtGallery = () => {
  const [arts, setArts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isLatest, setIsLatest] = useState(false);
  const [isForSale, setIsForSale] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchPublicArts(); 
        const data = res.data?.data || res.data || [];
        setArts(data);
      } catch (error) {
        console.error("Failed to load arts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayedArts = arts
    .filter((art) => {
      if (isForSale) {
        return art.availabilityStatus === "available";
      }
      return true; 
    })
    .sort((a, b) => {
      if (isLatest) {
        return new Date(b.updatedAt) - new Date(a.updatedAt); 
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-rabuste-bg pb-20 pt-24 md:pt-32 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-rabuste-text dark:text-white">
              Art Gallery
            </h1>
            <p className="text-rabuste-muted dark:text-stone-400 text-lg leading-relaxed">
              Discover and buy local art displayed in our café. Explore a diverse collection 
              that pairs perfectly with our signature Robusta brews.
            </p>
          </div>

 
          <div className="flex flex-wrap items-center gap-3">

            <button
              onClick={() => setIsLatest(!isLatest)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${
                isLatest
                  ? "bg-rabuste-text text-white border-rabuste-text shadow-lg transform -translate-y-0.5"
                  : "bg-white dark:bg-stone-900 text-rabuste-muted dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-rabuste-text dark:hover:border-stone-500 hover:text-rabuste-text dark:hover:text-white"
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isLatest ? "text-yellow-400 fill-current" : ""}`} />
              Latest
              {isLatest && <X className="w-4 h-4 ml-1 opacity-50 hover:opacity-100" />}
            </button>

            <button
              onClick={() => setIsForSale(!isForSale)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${
                isForSale
                  ? "bg-rabuste-orange text-white border-rabuste-orange shadow-lg transform -translate-y-0.5"
                  : "bg-white dark:bg-stone-900 text-rabuste-muted dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-rabuste-orange hover:text-rabuste-orange"
              }`}
            >
              <Tag className={`w-4 h-4 ${isForSale ? "fill-current" : ""}`} />
              For Sale
              {isForSale && <X className="w-4 h-4 ml-1 opacity-50 hover:opacity-100" />}
            </button>
            
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
             {[1,2,3].map(i => (
               <div key={i} className="h-96 bg-stone-200 dark:bg-stone-800 rounded-xl"></div>
             ))}
          </div>
        ) : displayedArts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedArts.map((art) => (
              <ArtCard key={art._id} art={art} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800 shadow-sm">
            <p className="text-xl font-serif text-rabuste-muted dark:text-stone-400">
              No artworks found matching your filters.
            </p>
            <button 
              onClick={() => { setIsLatest(false); setIsForSale(false); }}
              className="mt-4 text-rabuste-orange font-bold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ArtGallery;