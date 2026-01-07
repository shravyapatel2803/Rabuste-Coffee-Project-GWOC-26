import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";

const ProductCard = forwardRef(({ product, isActive, onHover }, ref) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const slugOrId = product.slug || product._id;

  return (
    <div
      ref={ref}
      onMouseEnter={onHover}
      // FIXED: Lowered min-height (min-h-[220px]) and padding (p-2) for mobile
      className={`group relative flex flex-col justify-between rounded-sm transition-all duration-300 border overflow-hidden h-full min-h-[220px] md:min-h-[320px]
        ${isActive 
          ? "bg-rabuste-gold/10 border-rabuste-gold shadow-lg scale-[1.02] z-10" 
          : "bg-rabuste-text/5 border-rabuste-text/10 hover:border-rabuste-gold/30 hover:bg-white dark:hover:bg-white/5" 
        }
      `}
    >
      
      {/* IMAGE */}
      <Link
        to={`/shop/${slugOrId}`}
        // FIXED: Reduced height (h-28) on mobile
        className="relative h-28 md:h-48 overflow-hidden block flex-shrink-0 bg-white"
      >
        <img
          src={product.image?.url}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 
            ${isActive ? "scale-110" : "group-hover:scale-105"}`
          }
        />
        
        {isActive && (
          <div className="absolute inset-0 ring-2 ring-inset ring-rabuste-gold/50 pointer-events-none" />
        )}
      </Link>

      {/* CONTENT */}
      {/* FIXED: Very small padding (p-2) */}
      <div className="p-2 md:p-5 flex flex-col flex-grow">
        <Link to={`/shop/${slugOrId}`}>
          {/* FIXED: Tiny Title Font (text-[11px]) with tight leading */}
          <h2 className={`text-[11px] md:text-lg font-serif font-bold mb-1 leading-tight line-clamp-2
            ${isActive ? "text-rabuste-orange" : "text-rabuste-text hover:text-rabuste-orange"}`
          }>
            {product.name}
          </h2>
        </Link>

        {/* DESCRIPTION: Hidden on small mobile to save space, visible on tablet/desktop */}
        <p className="hidden md:block text-rabuste-muted text-xs mb-3 line-clamp-2 leading-relaxed">
          {product.shortDescription || "Premium quality merchandise."}
        </p>

        {/* PRICE & ADD BUTTON */}
        <div className="flex justify-between items-center border-t border-rabuste-text/10 pt-2 mt-auto gap-1">
          <span className={`text-xs md:text-lg font-bold transition-colors ${isActive ? "text-rabuste-text" : "text-rabuste-gold"}`}>
            ₹{product.price}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            // FIXED: Ultra compact button
            className={`flex items-center gap-1 px-2 py-1 md:px-4 md:py-2 font-bold text-[10px] md:text-xs uppercase tracking-wider transition-colors rounded-sm
              ${isActive
                ? "bg-rabuste-orange text-white hover:bg-rabuste-gold"
                : "bg-rabuste-text/10 text-rabuste-text hover:bg-rabuste-gold hover:text-white"
              }
            `}
          >
            <ShoppingBag size={10} className="md:w-3.5 md:h-3.5" /> 
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;