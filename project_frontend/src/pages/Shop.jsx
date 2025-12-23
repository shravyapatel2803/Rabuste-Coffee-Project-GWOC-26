import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { apiClient } from "../api/client"; 

const Shop = ({ isPreview = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, totalPrice } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await apiClient.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-rabuste-bg text-rabuste-orange"><Loader2 className="animate-spin" size={40} /></div>;
  }

  return (
    <div className="px-6 py-16 md:py-20 bg-rabuste-bg relative min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-rabuste-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Takeaway Orders</span>
          {/* FIX: text-white -> text-rabuste-text */}
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-rabuste-text">
            {isPreview ? "Signature Roasts" : "Shop for Takeaway"}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-32">
          {products.map((product) => (
            // FIX: bg-white/5 -> bg-rabuste-text/5, border-white/10 -> border-rabuste-text/10
            <div key={product.id} className="bg-rabuste-text/5 border border-rabuste-text/10 rounded-sm overflow-hidden hover:border-rabuste-orange/50 transition-all group">
              <div className="relative h-64 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                {/* FIX: text-white -> text-rabuste-text */}
                <h2 className="text-xl font-serif font-bold mb-2 text-rabuste-text">{product.name}</h2>
                <p className="text-rabuste-muted text-xs mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center border-t border-rabuste-text/10 pt-4">
                  <span className="text-lg font-bold text-rabuste-gold">₹{product.price.sellingPrice}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-2 px-4 py-2 bg-rabuste-orange text-white font-bold text-xs uppercase tracking-wider hover:bg-rabuste-gold transition-colors"
                  >
                    <ShoppingBag size={16} /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ y: 100 }} 
            animate={{ y: 0 }} 
            exit={{ y: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50"
          >
            <Link to="/checkout" className="flex items-center justify-between bg-rabuste-orange p-4 rounded-lg shadow-2xl shadow-orange-500/40 text-white hover:bg-orange-700 transition-colors">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-tighter">{cart.length} ITEM{cart.length > 1 ? 'S' : ''}</span>
                <span className="text-lg font-black font-serif">₹{totalPrice}</span>
              </div>
              <div className="flex items-center gap-1 font-bold uppercase text-sm">
                View Cart <ChevronRight size={18} />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;