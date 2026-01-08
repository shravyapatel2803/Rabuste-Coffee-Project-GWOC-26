import { useEffect, useState, useCallback, useRef } from "react";
import { ChevronRight } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { getUserItems } from "../api/item.api";
import ProductCard from "../components/shop/ProductCard";
import MenuFilters from "../components/menu/MenuFilters";
import Preloader from "../components/common/Preloader"; 

const LIMIT = 12;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  
  // Loading State
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filter state
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("");
  const [milkBased, setMilkBased] = useState(false);

  const [activeIndex, setActiveIndex] = useState(null);
  const itemRefs = useRef([]);

  const { cart, totalPrice } = useCart();

  const loadInitial = useCallback(async () => {
    setLoading(true); // Loader Start
    try {
      const res = await getUserItems({
        showIn: "shop",
        limit: LIMIT,
        category: category !== "all" ? category : undefined,
        type: type || undefined,
        milkBased: milkBased ? true : undefined,
      });

      setProducts(res.data.items || []);
      setNextCursor(res.data.nextCursor);
      setHasMore(res.data.hasMore);
    } catch (e) {
      console.error("SHOP LOAD ERROR", e);
    } finally {
      setLoading(false); 
    }
  }, [category, type, milkBased]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      const res = await getUserItems({
        showIn: "shop",
        limit: LIMIT,
        cursor: nextCursor,
        category: category !== "all" ? category : undefined,
        type: type || undefined,
        milkBased: milkBased ? true : undefined,
      });

      const newItems = res.data.items || [];

      setProducts((prev) => {
        const uniqueNewItems = newItems.filter(
          (newItem) => !prev.some((existing) => existing._id === newItem._id)
        );
        return [...prev, ...uniqueNewItems];
      });

      setNextCursor(res.data.nextCursor);
      setHasMore(res.data.hasMore);
    } catch (e) {
      console.error("LOAD MORE ERROR", e);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, nextCursor, category, type, milkBased]);

  useEffect(() => {
    const onScroll = () => {
      if (loadingMore || !hasMore) return;
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight * 0.75;
      if (scrollPosition >= threshold) {
        loadMore();
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loadMore, loadingMore, hasMore]);

  if (loading) {
    return (
      <div className="min-h-screen bg-rabuste-bg">
         <Preloader inline={true} />
      </div>
    );
  }

  return (
    <div className="px-3 md:px-6 py-16 bg-rabuste-bg min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-rabuste-orange font-bold tracking-[0.2em] uppercase text-xs block mb-4">
            Takeaway Orders
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-rabuste-text">
            Shop for Takeaway
          </h1>
        </div>

        <MenuFilters
          category={category}
          setCategory={setCategory}
          type={type}
          setType={setType}
          milkBased={milkBased}
          setMilkBased={setMilkBased}
        />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 pb-32">
          {products.map((product, index) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              ref={el => itemRefs.current[index] = el}
              isActive={index === activeIndex}
              onHover={() => setActiveIndex(index)}
            />
          ))}
        </div>

        {loadingMore && (
           <div className="py-10">
              <Preloader inline={true} /> 
           </div>
        )}
      </div>

      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-16 right-4 md:left-6 w-[95%] max-w-md z-[60]"
          >
            <Link
              to="/cart"
              className="flex items-center justify-between bg-rabuste-orange p-3 md:p-4 rounded-lg shadow-xl text-white backdrop-blur-sm"
            >
              <div>
                <div className="text-[10px] md:text-xs font-bold uppercase opacity-90">
                  {cart.length} items added
                </div>
                <div className="text-base md:text-lg font-black tracking-tight">₹{totalPrice}</div>
              </div>
              <div className="flex items-center gap-2 font-bold uppercase text-[10px] md:text-xs tracking-wider bg-white/20 px-3 py-1.5 rounded-sm">
                View Cart <ChevronRight size={14} />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;