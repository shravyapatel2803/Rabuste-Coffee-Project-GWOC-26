import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";
import Navbar from "../componets/Navbar";
import Footer from "../componets/Footer";

const ArtDetail = () => {
  const { id } = useParams();
  const [art, setArt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArt = async () => {
      try {
        const res = await API.get(`/art/${id}`);
        setArt(res.data);
      } catch (error) {
        console.error("Error fetching art details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArt();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-rabuste-bg flex justify-center items-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!art) {
    return (
      <div className="min-h-screen bg-rabuste-bg flex justify-center items-center flex-col">
        <p className="text-xl mb-4">Art not found.</p>
        <Link to="/gallery" className="text-rabuste-orange underline">Back to Gallery</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rabuste-bg text-rabuste-text selection:bg-rabuste-orange selection:text-white">
      <Navbar />
      
      <div className="pt-32 px-6 max-w-6xl mx-auto pb-16">
        <Link 
          to="/gallery" 
          className="text-rabuste-orange hover:text-rabuste-gold mb-8 inline-block font-semibold"
        >
          &larr; Back to Gallery
        </Link>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="rounded-lg overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={art.image} 
              alt={art.title} 
              className="w-full h-auto object-cover" 
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{art.title}</h1>
            
            {art.artist && (
              <p className="text-xl text-gray-500 mb-6 italic">By {art.artist}</p>
            )}
            
            <div className="prose prose-lg text-gray-700 mb-8">
              <p>{art.description}</p>
            </div>

            <div className="mt-4 border-t pt-6">
                <div className="flex items-center justify-between">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${art.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {art.available ? "Available" : "Sold Out"}
                    </span>
                </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ArtDetail;