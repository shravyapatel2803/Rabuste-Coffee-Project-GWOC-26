import React from 'react';
import { motion } from 'framer-motion';

// The "Reveal" style animation variants
const variants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    scale: 0.98 
  },
  enter: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    }
  },
  exit: { 
    opacity: 0, 
    y: 20, // Move back down slightly on exit
    scale: 0.98,
    transition: { 
      duration: 0.4, 
      ease: "easeIn" 
    }
  }
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      className="w-full min-h-screen" // Ensure it doesn't collapse
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;