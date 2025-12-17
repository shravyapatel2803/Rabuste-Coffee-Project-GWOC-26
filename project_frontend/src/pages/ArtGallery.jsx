import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const Gallery = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-55%"]);

  const artworks = [
    { title: "Industrial Solitude", artist: "Maya V.", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop" },
    { title: "Coffee & Chaos", artist: "Davide R.", img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop" },
    { title: "Raw Beans", artist: "Unknown", img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1000&auto=format&fit=crop" },
    { title: "Urban Decay", artist: "Sarah J.", img: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000&auto=format&fit=crop" },
  ];

  return (
    <section id="gallery" ref={targetRef} className="relative h-[300vh] bg-rabuste-surface">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Section Header */}
        <div className="absolute top-10 left-6 md:left-20 z-20">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-2">The Gallery.</h2>
          <p className="text-rabuste-muted uppercase tracking-[0.2em] text-sm">Curated Local Art</p>
        </div>

        {/* Horizontal Scroll Container */}
        <motion.div style={{ x }} className="flex gap-10 pl-6 md:pl-20">
          {artworks.map((art, index) => (
            <div key={index} className="group relative min-w-[300px] md:min-w-[500px] h-[50vh] md:h-[60vh] bg-black/20 overflow-hidden">
              <img 
                src={art.img} 
                alt={art.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <h3 className="text-2xl text-white font-serif italic">{art.title}</h3>
                <p className="text-rabuste-gold text-sm uppercase tracking-widest mt-1">{art.artist}</p>
                <button className="mt-6 flex items-center gap-2 text-white border-b border-white/30 pb-1 w-fit hover:text-rabuste-orange hover:border-rabuste-orange transition-colors">
                  Inquire <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {/* "Your Art Here" Card */}
          <div className="min-w-[300px] md:min-w-[500px] h-[50vh] md:h-[60vh] border border-white/10 flex items-center justify-center bg-white/5">
            <div className="text-center">
              <h3 className="text-3xl text-white/50 font-serif mb-4">You?</h3>
              <p className="text-gray-500 text-sm uppercase tracking-widest">Submit your work</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;