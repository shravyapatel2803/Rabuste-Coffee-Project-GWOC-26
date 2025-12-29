import { Link } from "react-router-dom";

const MenuCategoryGroup = ({ group }) => {
  if (!group || !Array.isArray(group.items) || group.items.length === 0) {
    return null;
  }

  return (
    <div>
      {/* CATEGORY TITLE */}
      <h3 className="text-2xl font-serif text-rabuste-text mb-8 capitalize border-l-2 border-rabuste-orange pl-4">
        {group.category}
      </h3>

      {/* ITEMS GRID */}
      <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
        {group.items.map((item) => {
          if (!item) return null;

          const linkTarget = item.slug
            ? `/menu/${item.slug}`
            : `/menu/${item._id}`;

          return (
            <Link
              key={item._id}
              to={linkTarget}
              className="group relative block"
            >
              {/* NAME + PRICE */}
              <div className="flex items-baseline justify-between mb-1">
                <div className="flex-grow flex items-baseline overflow-hidden">
                  <h4 className="text-lg font-serif font-medium text-rabuste-text whitespace-nowrap pr-2 group-hover:text-rabuste-orange transition-colors">
                    {item.name}
                  </h4>
                  <span className="flex-grow border-b border-rabuste-text/20 border-dotted opacity-30 mx-1 relative -top-1" />
                </div>

                {typeof item.price === "number" && (
                  <span className="text-lg font-bold text-rabuste-gold pl-2">
                    ₹{item.price}
                  </span>
                )}
              </div>

              {/* IMAGE + DESCRIPTION */}
              <div className="flex gap-4 mt-2">
                {item.image?.url && (
                  <img
                    src={item.image.url}
                    alt={item.name || "Menu item"}
                    className="w-13 h-12 object-cover rounded-full"
                  />
                )}

                <p className="text-sm text-rabuste-muted font-light italic leading-relaxed pt-1 line-clamp-2">
                  {item.shortDescription || item.description || ""}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MenuCategoryGroup;
