import React, { use } from 'react';
import { motion, useAnimate, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
    const { scrollY } = useScroll();
  
  // We ONLY animate the scroll indicator arrow. 
  // The main text is now safe from disappearing.
  const indicatorOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-rabuste-bg flex flex-col justify-center items-center">
      
      {/* Background with Dark Gradient Overlay */}
      {/* z-0 ensures this stays in the back */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-rabuste-bg via-rabuste-bg/60 to-black/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop"
          alt="Coffee Background"
          className="w-full h-full object-cover opacity-50 grayscale-[20%]"
        />
      </div>

      {/* Main Content */}
      {/* z-30 ensures this sits ON TOP of everything */}
      <div className="relative z-30 text-center px-4 max-w-5xl mx-auto mt-10">
        <motion.div
          initial={{ opacity: 1, y: 30 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ duration: 0.8, ease: "outCirc" }}
        >
          <span className="inline-block py-1 px-3 border border-rabuste-gold/30 rounded-full text-[10px] md:text-xs font-bold tracking-[0.2em] text-rabuste-gold mb-6 uppercase backdrop-blur-sm">
            Est. 2024 • Gujarat
          </span>
          
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-black text-white leading-[0.9] tracking-tight mb-6">
            BOLD <span className="text-rabuste-orange italic">ROBUSTA</span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-400 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Not just a café. A sanctuary where intense flavors meet industrial art. 
            Experience the raw energy of pure Robusta.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button className="px-8 py-4 bg-white text-rabuste-bg hover:bg-gray-200 font-bold tracking-widest text-xs uppercase rounded-sm transition-all min-w-[180px]">
              View Menu
            </button>
            <button className="px-8 py-4 border border-white/20 text-white hover:bg-white/5 font-bold tracking-widest text-xs uppercase rounded-sm transition-all min-w-[180px]">
              Current Exhibitions
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0 animate-pulse" />
      </motion.div>
    </section>
  );
};

export default Hero;