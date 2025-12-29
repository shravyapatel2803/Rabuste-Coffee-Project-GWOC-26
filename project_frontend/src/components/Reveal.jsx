// src/componets/Reveal.jsx
import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut', delay }
  })
};

const Reveal = ({ children, className = '', delay = 0, style }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      custom={delay}
      variants={variants}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;