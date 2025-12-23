import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import API from "../api/api";

const ArtGallery = ({ isPreview = false }) => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchArt = async () => {
      try {
        const res = await API.get("/art");
        setArtworks(res.data);
      } catch (error) {
        console.error("Art fetch error:", error);
      }
    };

    fetchArt();
  }, []);

  const displayedArtworks = isPreview ? artworks.slice(0, 3) : artworks;

  return (
    <div className="px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-10 text-rabuste-text">Art Gallery</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {displayedArtworks.map((art) => (
          <Link to={`/gallery/${art._id}`} key={art._id} className="block group">
            {/* FIX: bg-white -> bg-rabuste-surface, added border for definition */}
            <div className="rounded overflow-hidden shadow transition-transform group-hover:-translate-y-1 duration-300 h-full flex flex-col bg-rabuste-surface border border-rabuste-text/5">
              <img
                src={art.image}
                alt={art.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                {/* FIX: text-rabuste-text */}
                <h2 className="font-semibold text-lg text-rabuste-text group-hover:text-rabuste-orange transition-colors">
                  {art.title}
                </h2>
                {/* FIX: text-gray-600 -> text-rabuste-muted */}
                <p className="text-rabuste-muted text-sm mb-4 line-clamp-2">{art.description}</p>
                <div className="mt-auto">
                   <span className="text-rabuste-orange text-xs font-bold uppercase tracking-wider">
                     View Details &rarr;
                   </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {isPreview && (
        <div className="flex justify-center mt-10">
          <Link 
            to="/gallery" 
            className="px-8 py-3 bg-rabuste-orange text-white font-bold tracking-widest uppercase rounded-sm hover:bg-rabuste-gold transition-colors"
          >
            See More
          </Link>
        </div>
      )}
    </div>
  );
};

export default ArtGallery;