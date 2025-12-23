import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { Loader2, ArrowLeft, ShoppingBag } from "lucide-react";
import Navbar from "../componets/Navbar";
import Footer from "../componets/Footer";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await API.get(`/items/${id}`);
        setItem(res.data);
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-rabuste-bg flex justify-center items-center text-rabuste-orange">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!item) return <div className="text-white text-center pt-32">Item not found</div>;

  return (
    <div className="min-h-screen bg-rabuste-bg text-white">
      <Navbar />
      
      <div className="pt-32 px-6 max-w-6xl mx-auto pb-20">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-400 hover:text-rabuste-orange transition-colors mb-12 uppercase tracking-widest text-xs font-bold"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          {/* Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-rabuste-orange/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src={item.image?.url} 
                alt={item.name} 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <span className="text-rabuste-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              {item.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              {item.name}
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light">
              {item.description}
            </p>

            <div className="flex items-center gap-8 border-t border-white/10 pt-8 mt-8">
              <span className="text-3xl font-serif font-bold text-rabuste-gold">
                ₹{item.price}
              </span>
              <button className="flex items-center gap-2 px-8 py-3 bg-white text-rabuste-bg font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-rabuste-orange hover:text-white transition-all">
                 <ShoppingBag size={18} /> Order Now
               </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ItemDetail;