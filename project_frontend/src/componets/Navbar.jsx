import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Our Story', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Art Gallery', href: '#gallery' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
          scrolled 
            ? 'bg-rabuste-bg/80 backdrop-blur-md py-4 border-white/5' 
            : 'bg-transparent py-6 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="bg-rabuste-orange p-1.5 rounded-sm shadow-lg shadow-orange-600/20 group-hover:bg-rabuste-gold transition-colors">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-serif font-bold tracking-widest text-white uppercase">
              Rabuste
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-xs font-bold uppercase tracking-[0.2em] text-rabuste-muted hover:text-rabuste-gold transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button className="px-6 py-2 border border-white/10 hover:border-rabuste-orange hover:bg-rabuste-orange/10 hover:text-rabuste-orange text-white text-xs font-bold tracking-widest uppercase transition-all rounded-sm">
              Book Table
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-white p-2 hover:bg-white/5 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-rabuste-bg pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 items-center">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-2xl font-serif text-white hover:text-rabuste-orange transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="w-12 h-[1px] bg-white/10 my-4"></div>
              <button className="px-8 py-3 bg-rabuste-orange text-white font-bold tracking-widest uppercase rounded-sm">
                Book a Table
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;