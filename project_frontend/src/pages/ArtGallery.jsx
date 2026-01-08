import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import { useShop } from "../context/ShopContext";

const Card = ({ art, onClick }) => {
  return (
    <motion.div
      layoutId={`card-${art._id}`}
      onClick={onClick}
      className="group relative cursor-pointer break-inside-avoid mb-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="relative overflow-hidden rounded-sm bg-stone-200 dark:bg-stone-800 aspect-[3/4]">
        <motion.img
          layoutId={`image-${art._id}`}
          src={art.image?.url}
          alt={art.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <p className="text-white text-xs font-bold uppercase tracking-widest border border-white/50 px-4 py-2 rounded-full backdrop-blur-md">
            View Detail
          </p>
        </div>
      </div>

      <div className="mt-3">
        <motion.h3 className="font-serif text-lg font-bold text-rabuste-text dark:text-white leading-tight">
          {art.title}
        </motion.h3>
        <p className="text-xs text-rabuste-muted dark:text-stone-400 mt-1">
          {art.artistName}
        </p>
      </div>
    </motion.div>
  );
};

// --- IMMERSIVE OVERLAY (Horizontal Scroll) ---
const ImmersiveView = ({ arts, selectedId, onClose }) => {
  const selectedIndex = arts.findIndex((a) => a._id === selectedId);
  const containerRef = useRef(null);

  // 1. Initial Scroll Position
  useEffect(() => {
    if (containerRef.current && selectedIndex !== -1) {
      const cardWidth = window.innerWidth;
      containerRef.current.scrollTo({ left: selectedIndex * cardWidth, behavior: "instant" });
    }
  }, [selectedIndex]);

  // 2. Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // 3. Mouse Wheel -> Horizontal Scroll Logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: true });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-rabuste-bg/95 backdrop-blur-xl flex flex-col"
    >
      {/* --- TOP CONTROLS --- */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-50 pointer-events-none bg-gradient-to-b from-black/80 to-transparent h-32">
        <div className="text-white font-bold text-xs uppercase tracking-widest opacity-90 mt-1">
          Gallery View
        </div>
        <button
          onClick={onClose}
          className="pointer-events-auto p-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-colors shadow-lg"
        >
          <X size={24} />
        </button>
      </div>

      {/* HORIZONTAL SCROLL CONTAINER */}
      <div
        ref={containerRef}
        className="flex-1 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth no-scrollbar items-center"
      >
        {arts.map((art) => (
          <div
            key={art._id}
            className="w-screen h-full flex-shrink-0 snap-center flex items-center justify-center relative p-0 md:p-10"
          >
            {/* LAYOUT: Mobile (Flex Column) / Desktop (Grid) */}
            <div className="w-full max-w-6xl h-full flex flex-col md:grid md:grid-cols-2 gap-0 md:gap-16 items-center shadow-2xl md:bg-transparent">
              
              {/* IMAGE SIDE */}
              <div className="w-full h-[50vh] md:h-[80vh] flex items-center justify-center relative p-0 bg-stone-900">
                <motion.div
                  layoutId={art._id === selectedId ? `card-${art._id}` : undefined}
                  className="relative w-full h-full max-h-[800px] md:rounded-sm overflow-hidden"
                >
                  <motion.img
                    layoutId={art._id === selectedId ? `image-${art._id}` : undefined}
                    src={art.image?.url}
                    alt={art.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* DETAILS SIDE (FIXED VISIBILITY) */}
              <div className="w-full flex-1 md:h-full flex flex-col justify-center text-left p-8 md:pr-10 overflow-y-auto no-scrollbar 
                              bg-white dark:bg-stone-950 md:bg-transparent"> 
                
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="pb-24 md:pb-0"
                >
                  <span className="text-rabuste-orange font-bold tracking-[0.2em] uppercase text-xs mb-2 md:mb-4 block">
                    {art.artStyle}
                  </span>
                  
                  {/* Title Text Color forced to be readable */}
                  <h2 className="text-3xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">
                    {art.title}
                  </h2>

                  <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-6 md:mb-8 max-w-md">
                    {art.description || "A masterpiece that speaks volumes through its texture and color."}
                  </p>

                  <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8">
                    <div className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 dark:border-gray-700 rounded-sm text-[10px] md:text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                      {art.medium}
                    </div>
                    {art.dimensions && (
                        <div className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 dark:border-gray-700 rounded-sm text-[10px] md:text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                        {art.dimensions.width} x {art.dimensions.height} cm
                        </div>
                    )}
                  </div>

                  <div className="flex items-center gap-8 border-t border-gray-200 dark:border-gray-800 pt-6 md:pt-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Price</p>
                      <p className="text-2xl md:text-3xl font-serif font-bold text-rabuste-gold">
                        {art.availabilityStatus === 'available' ? `₹${art.price}` : 'Sold'}
                      </p>
                    </div>
                    
                    {art.availabilityStatus === 'available' && (
                        <button className="px-6 py-3 md:px-8 bg-rabuste-orange text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-rabuste-gold hover:scale-105 transition-all shadow-lg shadow-orange-900/20">
                          Acquire Art
                        </button>
                    )}
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM HINT */}
      <div className="absolute bottom-6 left-0 w-full text-center pointer-events-none z-50">
        <div className="inline-flex items-center gap-4 text-white/80 text-[10px] md:text-xs font-bold uppercase tracking-widest animate-pulse bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
          <ArrowLeft size={14}/> Swipe or Scroll <ArrowRight size={14}/>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE COMPONENT ---
const ArtGallery = () => {
  const { arts } = useShop(); 
  const [selectedId, setSelectedId] = useState(null);


  return (
    <div className="min-h-screen bg-rabuste-bg pb-20 pt-24 md:pt-32 transition-colors duration-500">
      <Navbar /> 
      
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-rabuste-text dark:text-white">
              Art Gallery
            </h1>
            <p className="text-rabuste-muted dark:text-stone-400 text-lg leading-relaxed">
              Click on any artwork to enter immersive view. Swipe to explore the collection.
            </p>
          </div>
        </div>

        {/* GRID */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {arts.map((art) => (
            <Card 
              key={art._id} 
              art={art} 
              onClick={() => setSelectedId(art._id)} 
            />
          ))}
        </div>
      </div>

      {/* IMMERSIVE MODAL */}
      <AnimatePresence>
        {selectedId && (
          <ImmersiveView 
            arts={arts} 
            selectedId={selectedId} 
            onClose={() => setSelectedId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArtGallery;