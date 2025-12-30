import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPublicArtBySlug, recordArtView } from "../api/art.api"; 
import { Share2, Heart, ArrowLeft } from "lucide-react";

import ArtistCard from "../components/art/ArtistCard";
import CoffeePairingCard from "../components/art/CoffeePairingCard";
import ArtStory from "../components/art/ArtStory";
import ArtTags from "../components/art/ArtTags";

const ArtDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [art, setArt] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const hasRecordedView = useRef(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    fetchPublicArtBySlug(slug)
      .then((res) => {
        setArt(res.data || res);
        
        //  QUIET VIEW COUNTING 
        const storageKey = `viewed_art_${slug}`;
        if (!localStorage.getItem(storageKey) && !hasRecordedView.current) {
          hasRecordedView.current = true;
          recordArtView(slug)
            .then(() => localStorage.setItem(storageKey, "true"))
            .catch((err) => console.error("Silent view count failed", err));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-rabuste-bg">
        <div className="w-12 h-12 border-4 border-rabuste-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!art) return <div className="text-center pt-32">Artwork not found</div>;

  const isForSale = art.availabilityStatus === "available";

  return (
    <div className="min-h-screen bg-[#fcf9f6] dark:bg-[#1c1916] text-rabuste-text dark:text-[#f5efe6] pb-20 pt-24 md:pt-32">
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <button 
          onClick={() => navigate("/gallery")} 
          className="flex items-center gap-2 text-rabuste-muted dark:text-stone-400 hover:text-rabuste-orange transition-colors uppercase tracking-widest text-xs font-bold"
        >
          <ArrowLeft size={16} /> Back to Gallery
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-12">
          <div className="relative rounded-sm overflow-hidden shadow-2xl bg-stone-200 dark:bg-stone-800 group">
            <img 
              src={art.image?.url} 
              alt={art.title} 
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="pt-8 border-t border-rabuste-text/10">
            <ArtStory story={art.storyBehindArt || art.description} />
            <div className="mt-6"><ArtTags tags={art.artMood} /></div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-10">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">{art.title}</h1>
            {isForSale ? (
              <p className="text-3xl font-medium text-rabuste-gold mb-6">₹ {art.price?.toLocaleString()}</p>
            ) : (
              <p className="text-xl font-medium text-stone-500 mb-6 uppercase tracking-wider">
                {art.availabilityStatus === "sold" ? "Sold Out" : "Not for Sale"}
              </p>
            )}
            
            <ul className="space-y-3 text-sm text-rabuste-muted dark:text-stone-400 font-medium">
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rabuste-text/30"></span>{art.medium} · {art.artStyle}</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rabuste-text/30"></span>{art.dimensions?.width}x{art.dimensions?.height} cm · {art.framed ? "Framed" : "Unframed"}</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rabuste-text/30"></span>Displayed in: <span className="text-rabuste-text dark:text-white font-bold">{art.displayLocation}</span></li>
            </ul>
          </div>

          <div className="flex items-center gap-4">
            {isForSale && (
              <button className="flex-1 bg-[#8b5e3c] hover:bg-[#73492d] text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest shadow-lg transition-all">
                Inquire About Purchase
              </button>
            )}
            <button className="p-4 border border-rabuste-text/10 rounded-sm hover:bg-stone-100 dark:hover:bg-stone-800"><Heart size={20} /></button>
            <button className="p-4 border border-rabuste-text/10 rounded-sm hover:bg-stone-100 dark:hover:bg-stone-800"><Share2 size={20} /></button>
          </div>

          <div className="h-px bg-rabuste-text/10 w-full" />

          <ArtistCard 
            artist={{ name: art.artistName, bio: art.artistBio }} 
            location={art.displayLocation}
          />

          {art.bestPairedCoffee && (
            <div className="bg-[#f3ece6] dark:bg-[#26231f] p-6 rounded-sm border border-[#e7ddd3] dark:border-stone-800">
              <div className="text-xs font-bold uppercase tracking-widest text-rabuste-muted mb-4">Best Experienced With</div>
              <CoffeePairingCard coffee={art.bestPairedCoffee} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtDetail;