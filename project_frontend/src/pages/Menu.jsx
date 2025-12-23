import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";
import { Loader2, ArrowRight } from "lucide-react";

const Menu = ({ isPreview = false }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await API.get("/items/menu");
        setMenuItems(res.data);
      } catch (error) {
        console.error("Menu fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-rabuste-orange">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  const categories = ["all", ...new Set(menuItems.map((item) => item.category))];

  const displayGroups = activeCategory === "all"
    ? [...new Set(menuItems.map(i => i.category))].map(cat => ({
        category: cat,
        items: menuItems.filter(i => i.category === cat).sort((a, b) => a.price - b.price)
      }))
    : [{ category: activeCategory, items: menuItems.filter(i => i.category === activeCategory).sort((a, b) => a.price - b.price) }];

  return (
    // 1. CONTAINER: Use dynamic background and text colors
    <div className={`bg-rabuste-bg text-rabuste-text ${isPreview ? '' : 'min-h-screen px-6 py-20'}`}>
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        {!isPreview && (
          <div className="text-center mb-16">
            <span className="text-rabuste-orange text-xs font-bold tracking-[0.3em] uppercase block mb-4">
              The Collection
            </span>
            {/* 2. HEADING: Changed 'text-white' to 'text-rabuste-text' */}
            <h1 className="text-4xl md:text-6xl font-serif font-medium text-rabuste-text mb-10">
              Menu
            </h1>

            {/* 3. TABS: Changed border color to dynamic variable */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm md:text-base border-b border-rabuste-text/10 pb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`uppercase tracking-widest transition-colors relative pb-2 ${
                    // 4. TAB TEXT: Use 'rabuste-muted' for inactive, 'rabuste-text' for hover
                    activeCategory === cat 
                      ? "text-rabuste-gold" 
                      : "text-rabuste-muted hover:text-rabuste-text"
                  }`}
                >
                  {cat}
                  {activeCategory === cat && (
                    <motion.div 
                      layoutId="underline"
                      className="absolute bottom-0 left-0 w-full h-[1px] bg-rabuste-gold" 
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MENU CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-16"
          >
            {displayGroups.map((group) => {
               const isAllView = activeCategory === "all";
               const limit = isAllView ? 4 : group.items.length;
               const displayedItems = group.items.slice(0, limit);
               const hasMore = group.items.length > limit;

               return (
                <div key={group.category}>
                  {/* 5. CATEGORY TITLE: Dynamic text color */}
                  <h3 className="text-2xl font-serif text-rabuste-text mb-8 capitalize border-l-2 border-rabuste-orange pl-4 flex items-center justify-between">
                    {group.category}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
                    {displayedItems.map((item) => (
                      <Link 
                        to={`/menu/${item._id}`} 
                        key={item._id} 
                        className="group relative block"
                      >
                        <div className="flex items-baseline justify-between mb-1">
                          
                          <div className="flex-grow flex items-baseline overflow-hidden">
                            {/* 6. ITEM NAME: Dynamic text color */}
                            <h4 className="text-lg font-serif font-medium text-rabuste-text whitespace-nowrap pr-2 group-hover:text-rabuste-orange transition-colors">
                              {item.name}
                            </h4>
                            {/* 7. DOTTED LINE: Dynamic border color */}
                            <span className="flex-grow border-b border-rabuste-text/20 border-dotted opacity-30 mx-1 relative -top-1"></span>
                          </div>

                          <span className="text-lg font-bold text-rabuste-gold pl-2">
                            ₹{item.price}
                          </span>
                        </div>

                        <div className="flex gap-4 mt-2">
                          {item.image?.url && (
                            <img 
                              src={item.image.url} 
                              alt={item.name} 
                              className="w-12 h-12 object-cover rounded-full opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                            />
                          )}
                          
                          {/* 8. DESCRIPTION: Changed 'text-gray-500' to 'text-rabuste-muted' */}
                          <p className="text-sm text-rabuste-muted font-light italic leading-relaxed pt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* 9. SEE MORE BUTTON: Dynamic text and border */}
                  {hasMore && isAllView && (
                    <div className="mt-8 flex justify-center md:justify-start">
                      <button 
                        onClick={() => setActiveCategory(group.category)}
                        className="text-xs font-bold uppercase tracking-widest text-rabuste-muted hover:text-rabuste-text flex items-center gap-2 border-b border-transparent hover:border-rabuste-text pb-1 transition-all"
                      >
                        View All {group.category} ({group.items.length}) <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Menu;