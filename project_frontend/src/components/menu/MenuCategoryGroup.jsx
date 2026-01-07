import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- CUSTOM STYLES ---
const styles = `
  /* Custom Scrollbar */
  .custom-menu-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-menu-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-menu-scrollbar::-webkit-scrollbar-thumb {
    background-color: #b58d3f; 
    border-radius: 20px;
  }
  
  /* Stop parent page from scrolling when this list ends */
  .stop-scroll-chaining {
    overscroll-behavior: contain;
    overscroll-behavior-y: contain;
  }
`;

const INITIAL_ITEMS_COUNT = 6;
const LOAD_MORE_INCREMENT = 4;
const AUTO_SCROLL_DELAY = 3000;

// --- REVEAL ANIMATION VARIANTS (Matches Reveal.jsx) ---
const imageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" } // Matches Reveal.jsx timing
  },
  exit: { 
    opacity: 0, 
    scale: 0.98, // Scale back down slightly on exit for a breathing effect
    transition: { duration: 0.4, ease: "easeIn" } 
  }
};

const MenuCategoryGroup = ({ group }) => {
  if (!group || !Array.isArray(group.items) || group.items.length === 0) {
    return null;
  }

  // --- STATE ---
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS_COUNT);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  
  // Refs
  const listRef = useRef(null);
  const loaderRef = useRef(null);
  const itemRefs = useRef([]);
  const userScrollTimeout = useRef(null);

  const visibleItems = group.items.slice(0, visibleCount);
  const activeImage = visibleItems[activeIndex]?.image?.url || null;

  // --- EFFECT: Reset on Category Change ---
  useEffect(() => {
    setVisibleCount(INITIAL_ITEMS_COUNT);
    setActiveIndex(0);
    setIsPaused(false);
    setUserHasScrolled(false);
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [group]);

  // --- EFFECT: Auto-Play Timer ---
  useEffect(() => {
    if (isPaused || userHasScrolled || visibleItems.length === 0) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % visibleItems.length);
    }, AUTO_SCROLL_DELAY);

    return () => clearInterval(timer);
  }, [isPaused, userHasScrolled, visibleItems.length]);

  // --- EFFECT: Safe Auto-Scroll ---
  useEffect(() => {
    if (!isPaused && !userHasScrolled && itemRefs.current[activeIndex] && listRef.current) {
      const item = itemRefs.current[activeIndex];
      const list = listRef.current;

      const itemTop = item.offsetTop;
      const itemHeight = item.offsetHeight;
      const listHeight = list.clientHeight;
      
      const targetScroll = itemTop - (listHeight / 2) + (itemHeight / 2);

      list.scrollTo({
        top: targetScroll,
        behavior: "smooth"
      });
    }
  }, [activeIndex, isPaused, userHasScrolled]);

  // --- HANDLER: Detect Manual Scroll ---
  const handleScroll = (e) => {
    e.stopPropagation(); 
    if (!isPaused) {
       setUserHasScrolled(true);
       if (userScrollTimeout.current) clearTimeout(userScrollTimeout.current);
       userScrollTimeout.current = setTimeout(() => {
         setUserHasScrolled(false);
       }, 4000);
    }
  };

  // --- EFFECT: Infinite Scroll Loader ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < group.items.length) {
           setTimeout(() => setVisibleCount(p => p + LOAD_MORE_INCREMENT), 200);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [visibleCount, group.items.length]);

  return (
    <div className="mb-20">
      <style>{styles}</style>

      <h3 className="text-2xl lg:text-3xl font-serif text-rabuste-text mb-6 lg:mb-10 capitalize border-l-4 border-rabuste-orange pl-4 lg:pl-6">
        {group.category}
      </h3>

      {/* CONTAINER: Mobile Stacked, Desktop Side-by-Side */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-stretch h-[600px]">
        
        {/* --- 1. IMAGE DISPLAY (With Reveal Animation) --- */}
        <div className="w-full lg:w-5/12 h-[220px] lg:h-auto rounded-sm overflow-hidden shadow-xl border border-rabuste-text/10 bg-rabuste-surface shrink-0 relative order-1 group/image">
          <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage || "placeholder"}
                src={activeImage || "/placeholder-food.jpg"}
                alt="Active Menu Item"
                // Applying Reveal Animation Props
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10 pointer-events-none" />

            {/* Text Overlay (Animates with image) */}
            <div className="absolute bottom-4 left-4 right-4 lg:bottom-8 lg:left-8 lg:right-8 z-20">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }} // Slight delay to play after image
              >
                <h4 className="text-xl lg:text-2xl font-serif font-bold text-white drop-shadow-lg mb-1 truncate">
                  {visibleItems[activeIndex]?.name}
                </h4>
                <p className="text-white/90 text-xs lg:text-sm font-light line-clamp-1 lg:line-clamp-2">
                  {visibleItems[activeIndex]?.shortDescription || visibleItems[activeIndex]?.description}
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* --- 2. LIST (SCROLLABLE) --- */}
        <div 
          ref={listRef}
          onScroll={handleScroll} 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onWheel={(e) => e.stopPropagation()} 
          className="w-full lg:w-7/12 flex-1 lg:h-full flex flex-col gap-3 lg:gap-4 overflow-y-auto custom-menu-scrollbar pr-2 pb-2 stop-scroll-chaining relative order-2"
        >
          {visibleItems.map((item, index) => {
            if (!item) return null;
            const isActive = index === activeIndex;
            const linkTarget = item.slug ? `/menu/${item.slug}` : `/menu/${item._id}`;

            return (
              <Link
                key={item._id}
                to={linkTarget}
                ref={el => itemRefs.current[index] = el}
                onMouseEnter={() => setActiveIndex(index)}
                className={`group relative block p-4 lg:p-5 rounded-sm transition-all duration-300 shrink-0 border
                  ${isActive 
                    ? "bg-rabuste-gold/10 border-rabuste-gold shadow-md scale-[1.01]" 
                    : "bg-white dark:bg-white/5 border-transparent hover:border-rabuste-gold/30"
                  }
                `}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-grow">
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className={`text-base lg:text-lg font-serif font-medium transition-colors duration-300 ${isActive ? "text-rabuste-orange" : "text-rabuste-text"}`}>
                        {item.name}
                      </h4>
                      {typeof item.price === "number" && (
                        <span className="text-sm lg:text-base font-bold text-rabuste-gold whitespace-nowrap ml-2">
                          ₹{item.price}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] lg:text-xs text-rabuste-muted font-light leading-relaxed line-clamp-2">
                      {item.shortDescription || item.description || "Delightful selection from our menu."}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
          
          {/* LOADER */}
          <div ref={loaderRef} className="py-2 text-center text-[10px] lg:text-xs text-rabuste-muted flex items-center justify-center shrink-0 w-full min-h-[40px]">
            {visibleCount < group.items.length ? (
               <span className="animate-pulse">Loading more...</span>
            ) : (
               <span className="opacity-30 tracking-widest uppercase">End of list</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCategoryGroup;