import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { Loader2 } from "lucide-react"; // Added Loader
import API from "../api/api";

const ArtGallery = ({ isPreview = false }) => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchArt = async () => {
      try {
        const res = await API.get("/art");
        setArtworks(res.data);
      } catch (error) {
        console.error("Art fetch error:", error);
      } finally {
        setLoading(false); // Stop loading even if error
      }
    };

    fetchArt();
  }, []);

  // 1. Loading State (Matches Shop.jsx)
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-rabuste-orange">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  const displayedArtworks = isPreview ? artworks.slice(0, 3) : artworks;

  return (
    // 2. Layout Fix: Added max-w-7xl mx-auto and relative positioning
    <div className="px-6 py-12 md:py-20 bg-rabuste-bg relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-rabuste-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
            Curated Collections
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-rabuste-text">
            {isPreview ? "Current Exhibitions" : "Art Gallery"}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedArtworks.map((art) => (
            <Link to={`/gallery/${art._id}`} key={art._id} className="block group h-full">
              {/* 3. Style Fix: Changed bg-rabuste-surface to bg-rabuste-text/5 to match Shop */}
              <div className="bg-rabuste-text/5 border border-rabuste-text/10 rounded-sm overflow-hidden hover:border-rabuste-orange/50 transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1">
                
                <div className="relative h-64 overflow-hidden">
                   <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Optional: Add an overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="font-serif font-bold text-xl text-rabuste-text mb-2 group-hover:text-rabuste-orange transition-colors">
                    {art.title}
                  </h2>
                  
                  <p className="text-rabuste-muted text-xs mb-4 line-clamp-2 leading-relaxed">
                    {art.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-rabuste-text/10 flex justify-between items-center">
                     <span className="text-rabuste-gold text-xs font-bold uppercase tracking-widest">
                       View Piece
                     </span>
                     <span className="text-rabuste-text group-hover:translate-x-1 transition-transform">
                       &rarr;
                     </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {isPreview && (
          <div className="flex justify-center mt-12 md:mt-16">
            <Link 
              to="/gallery" 
              className="px-8 py-3 border border-rabuste-text/20 text-rabuste-text font-bold tracking-widest uppercase text-xs rounded-sm hover:bg-rabuste-text hover:text-rabuste-bg transition-all duration-300"
            >
              View Full Gallery
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtGallery;