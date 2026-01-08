import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, ContactShadows, OrbitControls } from '@react-three/drei';
import { Link } from 'react-router-dom'; 

import ThreeCoffeeCup from '../ThreeCoffeeCup'; 
import ThreeDoubleSidedBox from '../ThreeDoubleSidedBox'; 

const useThemeDetector = () => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
};

const Hero = ({ featuredItem }) => {
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, 200]);
  const isDark = useThemeDetector();

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const hasFeatured = featuredItem && featuredItem.image?.url;

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden flex items-center bg-rabuste-bg transition-colors duration-500">
      
      {/* TEXT CONTENT */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-6 md:pl-20 relative z-20 pointer-events-none">
        <motion.div style={{ y: textY }} initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }} className="pointer-events-auto">
          
          <motion.div variants={itemVars}>
            <span className="inline-block py-1 px-3 rounded-full text-[10px] md:text-xs font-bold tracking-[0.2em] mb-4 md:mb-6 uppercase backdrop-blur-sm border border-rabuste-text/10 text-rabuste-text transition-colors duration-300">
              {hasFeatured ? "Featured Selection" : "Est. 2024 • Gujarat"}
            </span>
          </motion.div>
          
          <motion.h1 variants={itemVars} className="text-5xl md:text-7xl lg:text-8xl font-serif font-black leading-[0.9] mb-6 text-rabuste-text transition-colors duration-300">
            {hasFeatured ? (
              <>
                TRY <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rabuste-gold to-rabuste-orange italic">
                  {featuredItem.name.split(" ")[0]} 
                </span>
                <span className="block text-4xl md:text-6xl mt-2 opacity-80">
                   {featuredItem.name.split(" ").slice(1).join(" ")}
                </span>
              </>
            ) : (
              <>
                BOLD <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rabuste-gold to-rabuste-orange italic">
                  ROBUSTE
                </span>
              </>
            )}
          </motion.h1>

          <motion.p variants={itemVars} className="text-lg max-w-md leading-relaxed mb-8 text-rabuste-muted transition-colors duration-300">
            {hasFeatured 
              ? featuredItem.shortDescription || featuredItem.description?.substring(0, 100) + "..."
              : "Experience the raw energy of pure coffee. Where intense flavors meet industrial art."
            }
          </motion.p>

          <motion.div variants={itemVars} className="flex gap-4">
             {hasFeatured ? (
                <Link to={`/shop/${featuredItem.slug}`} className="px-8 py-4 bg-rabuste-text text-rabuste-bg hover:bg-rabuste-orange hover:text-white font-bold uppercase tracking-widest text-xs rounded-sm transition-all duration-300">
                  Order Now - ₹{featuredItem.price}
                </Link>
             ) : (
                <a href="#menu" className="px-8 py-4 bg-rabuste-text text-rabuste-bg hover:bg-rabuste-orange hover:text-white font-bold uppercase tracking-widest text-xs rounded-sm transition-all duration-300">
                  View Menu
                </a>
             )}
             
             <a href="#gallery" className="px-8 py-4 border border-rabuste-text/20 text-rabuste-text hover:border-rabuste-gold hover:text-rabuste-gold font-bold uppercase tracking-widest text-xs rounded-sm transition-all duration-300">
               Gallery
             </a>
          </motion.div>
        </motion.div>
      </div>

      {/* 3D INTERACTIVE SECTION */}
      <div className="absolute h-full inset-0 md:static md:w-1/2  z-10 cursor-move "> 
         <Canvas camera={{ position: [0, 0, 12], fov: 35 }}>
            
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              autoRotate={true}
              autoRotateSpeed={1}
              minPolarAngle={Math.PI / 4} 
              maxPolarAngle={Math.PI / 1.5}
            />

            {/* Lighting */}
            <ambientLight intensity={3.0} />
            <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={15} color="#ffffff" />
            <spotLight position={[-10, 10, -10]} intensity={20} color="#D4AF37" />
            <pointLight position={[0, -10, 5]} intensity={5} color="#ffffff" />
            <directionalLight position={[0, 10, 0]} intensity={5} color="#ffffff" />

            <Environment preset="studio" />

            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
               {hasFeatured ? (
                 <ThreeDoubleSidedBox 
                    frontSrc={featuredItem.image.url} 
                    backSrc={featuredItem.image.url} 
                 />
               ) : (
                 <ThreeCoffeeCup />
               )}
            </Float>
            
            <ContactShadows 
              position={[0, -3, 0]} 
              opacity={isDark ? 0.6 : 0.5} 
              scale={10} 
              blur={2.5} 
              far={4.5} 
              color={isDark ? "#D4AF37" : "#000000"} 
            />
         </Canvas>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 md:hidden"
      >
        <span className="text-[10px] uppercase tracking-widest text-rabuste-muted">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-rabuste-muted/50 to-transparent"></div>
      </motion.div>

    </section>
  );
};

export default Hero;