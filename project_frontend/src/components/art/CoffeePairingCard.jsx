import { Link } from "react-router-dom";

const CoffeePairingCard = ({ coffee }) => {
  if (!coffee || typeof coffee !== "object") return null;

  const name = coffee.name || "Special Brew";
  const image = coffee.image?.url || coffee.image; 
  const slug = coffee.slug || "#";

  return (
    <Link to={`/shop/${slug}`} className="block group">
      <div className="flex gap-4 items-center">
        {image && (
          <div className="w-20 h-20 flex-shrink-0 rounded-full overflow-hidden border-2 border-white shadow-md">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        )}

        {/* Info */}
        <div>
          <h3 className="font-serif text-xl font-bold text-rabuste-text dark:text-white group-hover:text-rabuste-orange transition-colors">
            {name}
          </h3>
          <p className="text-xs text-rabuste-muted dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
            Strong, full-bodied shot that matches the bold energy of this abstract art.
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CoffeePairingCard;