// src/pages/ShopItemDetail.jsx
import { useEffect, useState, useRef } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Loader2, ArrowLeft, ShoppingBag, Check } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { getUserItemBySlug, recordItemView } from "../api/item.api"; 

const ShopItemDetail = () => {
  const { slug } = useParams(); 
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  const hasRecordedView = useRef(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const res = await getUserItemBySlug(slug);
        setItem(res.data);

        // Unique key for this item
        const storageKey = `viewed_item_${slug}`;
        
        if (!localStorage.getItem(storageKey) && !hasRecordedView.current) {
          hasRecordedView.current = true; 
      
          recordItemView(slug)
            .then(() => {
              localStorage.setItem(storageKey, "true");
            })
            .catch((err) => console.error("Silent item view failed", err));
        }

      } catch (err) {
        console.error("SHOP ITEM FETCH ERROR", err);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [slug]);

  const handleAddToCart = () => {
    if (!item) return;
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rabuste-bg flex justify-center items-center text-rabuste-orange">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-rabuste-bg text-rabuste-text flex justify-center pt-32">
        Item not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rabuste-bg text-rabuste-text">
      <Navbar />

      <div className="pt-32 px-6 max-w-6xl mx-auto pb-20">
        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-rabuste-muted hover:text-rabuste-orange transition-colors mb-12 uppercase tracking-widest text-xs font-bold"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          {/* IMAGE */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-rabuste-text/10 shadow-2xl">
              <img
                src={item.image?.url}
                alt={item.name}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* DETAILS */}
          <div>
            <span className="text-rabuste-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              {item.category}
            </span>

            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              {item.name}
            </h1>

            {/* FULL DESCRIPTION */}
            <p className="text-rabuste-muted text-lg leading-relaxed mb-8 font-light">
              {item.description}
            </p>
            
            {item.tags?.includes("bestseller") && (
               <span className="inline-block bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
                 Bestseller
               </span>
            )}

            <div className="flex items-center gap-8 border-t border-rabuste-text/10 pt-8 mt-8">
              <span className="text-3xl font-serif font-bold text-rabuste-gold">
                ₹{item.price}
              </span>

              <button
                onClick={handleAddToCart}
                className={`flex items-center gap-2 px-8 py-3 font-bold uppercase tracking-widest text-xs rounded-sm transition-all ${
                  added
                    ? "bg-green-600 text-white"
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