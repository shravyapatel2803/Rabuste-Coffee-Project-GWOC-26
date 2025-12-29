// src/componets/SmoothScroll.jsx
import { useEffect } from 'react';
import Lenis from 'lenis';

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2, // The speed of the scroll (higher = slower/smoother)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
      direction: 'vertical', 
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false, // Keep false for native feel on mobile
      touchMultiplier: 2,
    });

    // 2. The Animation Loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 3. Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    // We don't need a wrapper div, Lenis works on the body by default
    <div className="w-full min-h-screen">
      {children}
    </div>
  );
};

export default SmoothScroll;