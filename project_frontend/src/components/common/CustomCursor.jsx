// src/componets/CustomCursor.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// REPLACE THIS URL WITH YOUR UPLOADED IMAGE PATH
// Example: import cursorImage from '../assets/my-cursor.png';
const CURSOR_IMAGE_URL = "https://cdn3d.iconscout.com/3d/premium/thumb/mouse-pointer-3d-icon-png-download-7488161.png"; // Placeholder Coffee Bean

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      // Check if hovering over clickable elements
      if (e.target.closest('a') || e.target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <motion.img
      src={CURSOR_IMAGE_URL}
      alt="Custom Cursor"
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block select-none"
      animate={{
        x: mousePos.x - (isHovering ? 20 : 12), // Center the image (adjust based on size)
        y: mousePos.y - (isHovering ? 20 : 12),
        width: isHovering ? 40 : 24, // Scale up on hover
        height: isHovering ? 40 : 24,
        rotate: isHovering ? 45 : 0, // Slight rotation on hover for effect
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.5
      }}
    />
  );
};

export default CustomCursor;