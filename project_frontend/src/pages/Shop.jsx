// src/pages/Shop.jsx
import { useEffect, useState, useCallback } from "react";
import { Loader2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { getUserItems } from "../api/item.api";
import ProductCard from "../components/shop/ProductCard";
import MenuFilters from "../components/menu/MenuFilters";

const LIMIT = 12;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  //  filter state (same as Menu)
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("");
  const [milkBased, setMilkBased] = useState(false);

  const { cart, totalPrice } = useCart();


  const loadInitial = useCallback(async () => {
    setLoading(true);
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

      setProducts((prev) => [...prev, ...(res.data.items || [])]);
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

      const scrollPosition =
        window.innerHeight + window.scrollY;

      const threshold =
        document.documentElement.scrollHeight * 0.75;

      if (scrollPosition >= threshold) {
        loadMore();
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loadMore, loadingMore, hasMore]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rabuste-bg text-rabuste-orange">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="px-6 py-16 bg-rabuste-bg min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <span className="text-rabuste-orange font-bold tracking-[0.2em] uppercase text-xs block mb-4">
            Takeaway Orders
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-rabuste-text">
            Shop for Takeaway
          </h1>
        </div>

        {/*FILTER */}
        <MenuFilters
          category={category}
          setCategory={setCategory}
          type={type}
          setType={setType}
          milkBased={milkBased}
          setMilkBased={setMilkBased}
        />

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* LOAD MORE LOADER */}
        {loadingMore && (
          <div className="flex justify-center py-10 text-rabuste-orange">
            <Loader2 className="animate-spin" size={32} />
          </div>
        )}
      </div>

      {/* CART BAR */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50"
          >
            <Link
              to="/checkout"
              className="flex items-center justify-between bg-rabuste-orange p-4 rounded-lg shadow-xl text-white"
            >
              <div>
                <div className="text-xs font-bold uppercase">
                  {cart.length} items
                </div>
                <div className="text-lg font-black">₹{totalPrice}</div>
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
