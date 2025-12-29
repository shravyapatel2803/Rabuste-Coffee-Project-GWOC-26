import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const { scrollY } = useScroll();
  
  // Parallax effects
  const bgY = useTransform(scrollY, [0, 500], [0, 200]); // Moves background down slowly
  const textY = useTransform(scrollY, [0, 500], [0, 100]); // Moves text down slightly
  const indicatorOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  // Stagger variants for text
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.3 } 
    }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  return (
    <section id="home" className="relative h-[100dvh] w-full overflow-hidden bg-rabuste-bg flex flex-col justify-center items-center">
      
      {/* Background with Parallax */}
      <motion.div 
        style={{ y: bgY }} // Apply parallax here
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-rabuste-bg via-rabuste-bg/60 to-black/10 dark:to-black/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop"
          alt="Coffee Background"
          className="w-full h-full object-cover opacity-50 grayscale-[20%] scale-110" // scale-110 prevents gaps during parallax
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-30 text-center px-4 max-w-5xl mx-auto mt-10">
        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="visible"
          style={{ y: textY }} // Slight parallax on text too
        >
          <motion.div variants={itemVars}>
            <span className="inline-block py-1 px-3 rounded-full text-[10px] md:text-xs font-bold tracking-[0.2em] mb-4 md:mb-6 uppercase backdrop-blur-sm 
              border border-rabuste-text/10 text-rabuste-text transition-colors duration-300">
              Est. 2024 • Gujarat
            </span>
          </motion.div>

          <motion.h1 variants={itemVars} className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-serif font-black leading-[0.9] tracking-tight mb-6 
            text-rabuste-text transition-colors duration-300">
            BOLD <span className="text-rabuste-orange italic">ROBUSTA</span>
          </motion.h1>
          
          <motion.p variants={itemVars} className="text-sm sm:text-base md:text-xl font-light max-w-xl md:max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed 
            text-rabuste-muted transition-colors duration-300 px-4">
            Not just a café. A sanctuary where intense flavors meet industrial art. 
            Experience the raw energy of pure Robusta.
          </motion.p>

          <motion.div variants={itemVars} className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center">
            <a 
              href="#menu" 
              className="w-full sm:w-auto px-8 py-4 font-bold tracking-widest text-xs uppercase rounded-sm transition-all min-w-[180px] flex items-center justify-center
                bg-rabuste-text text-rabuste-bg hover:bg-rabuste-orange hover:text-white hover:scale-105 active:scale-95 duration-300"
            >
              View Menu
            </a>
            
            <a 
              href="#gallery" 
              className="w-full sm:w-auto px-8 py-4 border font-bold tracking-widest text-xs uppercase rounded-sm transition-all min-w-[180px] flex items-center justify-center
                border-rabuste-text/20 text-rabuste-text hover:bg-rabuste-text/5 hover:border-rabuste-text/40 hover:scale-105 active:scale-95 duration-300"
            >
              Current Exhibitions
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-rabuste-muted">Scroll</span>
        <div className="w-[1px] h-8 md:h-12 animate-pulse bg-gradient-to-b 
          from-transparent via-rabuste-muted to-transparent" 
        />
      </motion.div>
    </section>
  );
};

export default Hero;