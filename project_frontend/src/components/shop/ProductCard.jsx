import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const slugOrId = product.slug || product._id;

  return (
    <div className="bg-rabuste-text/5 border border-rabuste-text/10 rounded-sm overflow-hidden hover:border-rabuste-orange/50 transition-all group flex flex-col">
      
      {/* IMAGE */}
      <Link
        to={`/shop/${slugOrId}`}
        className="relative h-64 overflow-hidden block"
      >
        <img
          src={product.image?.url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* CONTENT */}
      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/shop/${slugOrId}`}>
          <h2 className="text-xl font-serif font-bold mb-2 text-rabuste-text hover:text-rabuste-orange transition-colors">
            {product.name}
          </h2>
        </Link>

        {/* SHORT DESCRIPTION */}
        <p className="text-rabuste-muted text-xs mb-4 line-clamp-2">
          {product.shortDescription || ""}
        </p>

        <div className="flex justify-between items-center border-t border-rabuste-text/10 pt-4 mt-auto">
          <span className="text-lg font-bold text-rabuste-gold">
            ₹{product.price}
          </span>

          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 px-4 py-2 bg-rabuste-orange text-white font-bold text-xs uppercase tracking-wider hover:bg-rabuste-gold transition-colors"
          >
            <ShoppingBag size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;