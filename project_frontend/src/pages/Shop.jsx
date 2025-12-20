import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingBag } from "lucide-react";
import API from "../api/api";

const Shop = ({ isPreview = false }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchShopProducts = async () => {
      try {
        const res = await API.get("/items/shop");
        setProducts(res.data);
      } catch (error) {
        console.error("Shop fetch error:", error);
      }
    };

    fetchShopProducts();
  }, []);

  const displayedProducts = isPreview ? products.slice(0, 3) : products;

  return (
    <div className="px-6 py-20 bg-rabuste-bg">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <span className="text-rabuste-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
            From Our Roastery
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white">
            {isPreview ? "Signature Roasts" : "All Products"}
          </h1>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8 auto-rows-fr">
          {displayedProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-white/5 border border-white/10 rounded-sm overflow-hidden hover:border-rabuste-orange/50 transition-all duration-300 flex flex-col h-full"
            >
              {/* IMAGE */}
              <div className="relative h-64 overflow-hidden bg-black/20">
                {product.availability?.isSoldOut && (
                  <span className="absolute top-4 right-4 bg-red-900/80 text-white text-xs font-bold px-3 py-1 uppercase">
                    Sold Out
                  </span>
                )}

                <img
                  src={product.image?.url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* CONTENT */}
              <div className="p-6 flex flex-col flex-1">
                {/* TITLE + RATING */}
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-serif font-bold group-hover:text-rabuste-gold transition-colors">
                    {product.name}
                  </h2>

                  {/* STAR */}
                  <div className="flex items-center gap-1 text-rabuste-gold">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-bold">
                      {product.rating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                </div>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.flavorNotes?.map((note, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/10 text-gray-300 rounded-sm"
                    >
                      {note}
                    </span>
                  ))}
                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                  {product.description}
                </p>

                {/* PRICE */}
                <div className="mt-auto flex justify-between items-center border-t border-white/10 pt-4">
                  <span className="text-lg font-bold text-white">
                    ₹{product.price}
                  </span>

                  <button className="flex items-center gap-2 px-4 py-2 bg-rabuste-text text-rabuste-bg font-bold text-xs uppercase tracking-wider hover:bg-rabuste-orange hover:text-white transition-colors">
                    <ShoppingBag size={16} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* VIEW ALL */}
        {isPreview && (
          <div className="flex justify-center mt-16">
            <Link
              to="/shop"
              className="px-8 py-3 border border-rabuste-gold text-rabuste-gold font-bold tracking-widest uppercase hover:bg-rabuste-gold hover:text-black transition-all"
            >
              View All Roasts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
