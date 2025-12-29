// src/pages/ShopItemDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";
import { useCart } from "../context/CartContext";
import { Loader2, ArrowLeft, ShoppingBag, Check } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const ShopItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await apiClient.getProduct(id);
        setItem(data);
      } catch (error) {
        console.error("Error fetching shop item:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleAddToCart = () => {
    if (item) {
      addToCart(item);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000); // Reset button state after 2s
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rabuste-bg flex justify-center items-center text-rabuste-orange">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!item) return <div className="min-h-screen bg-rabuste-bg text-rabuste-text flex justify-center pt-32">Item not found</div>;

  return (
    <div className="min-h-screen bg-rabuste-bg text-rabuste-text">
      <Navbar />
      
      <div className="pt-32 px-6 max-w-6xl mx-auto pb-20">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-rabuste-muted hover:text-rabuste-orange transition-colors mb-12 uppercase tracking-widest text-xs font-bold"
        >
          <ArrowLeft size={16} /> Back to Shop
        </button>

        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          {/* Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-rabuste-orange/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden border border-rabuste-text/10 shadow-2xl">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <span className="text-rabuste-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              Signature Roast
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              {item.name}
            </h1>
            <p className="text-rabuste-muted text-lg leading-relaxed mb-8 font-light">
              {item.description}
            </p>

            <div className="flex items-center gap-8 border-t border-rabuste-text/10 pt-8 mt-8">
              <span className="text-3xl font-serif font-bold text-rabuste-gold">
                ₹{item.price.sellingPrice}
              </span>
              
              <button 
                onClick={handleAddToCart}
                className={`flex items-center gap-2 px-8 py-3 font-bold uppercase tracking-widest text-xs rounded-sm transition-all ${
                    added 
                    ? "bg-green-600 text-white hover:bg-green-700" 
                    : "bg-rabuste-text text-rabuste-bg hover:bg-rabuste-orange hover:text-white"
                }`}
              >
                 {added ? <Check size={18} /> : <ShoppingBag size={18} />} 
                 {added ? "Added" : "Add to Cart"}
               </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopItemDetail;