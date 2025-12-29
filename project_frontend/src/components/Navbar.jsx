import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import { Coffee, Menu, X, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const location = useLocation(); // Get current route

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Shop', href: '/shop' },
    { name: 'Gallery', href: '/gallery' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
          scrolled 
            ? 'bg-rabuste-bg/95 backdrop-blur-md py-3 md:py-4 border-rabuste-text/5' 
            : 'bg-transparent py-4 md:py-6 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group z-50">
            <div className="bg-rabuste-orange p-1.5 rounded-sm shadow-lg shadow-orange-600/20 group-hover:bg-rabuste-gold transition-colors">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg md:text-2xl font-serif font-bold tracking-widest text-rabuste-text uppercase">
              Rabuste
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              // Check if this link is active
              const isActive = location.pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                    isActive ? 'text-rabuste-gold' : 'text-rabuste-muted hover:text-rabuste-gold'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <button onClick={toggleTheme} className="p-2 text-rabuste-text hover:text-rabuste-orange transition-colors">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link 
              to="/book-table"
              className="px-6 py-2 border border-rabuste-text/10 hover:border-rabuste-orange hover:bg-rabuste-orange/10 hover:text-rabuste-orange text-rabuste-text text-xs font-bold tracking-widest uppercase transition-all rounded-sm"
            >
              Book Table
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden z-50">
            <button onClick={toggleTheme} className="text-rabuste-text p-2">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className="text-rabuste-text p-2 hover:bg-rabuste-text/5 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-rabuste-bg flex flex-col items-center justify-center md:hidden"
          >
            <div className="flex flex-col gap-8 items-center w-full px-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className={`text-3xl font-serif transition-colors ${
                    location.pathname === link.href ? 'text-rabuste-gold' : 'text-rabuste-text'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <Link 
                to="/book-table"
                onClick={() => setIsMenuOpen(false)}
                className="w-full max-w-xs py-4 bg-rabuste-orange text-white font-bold tracking-widest uppercase rounded-sm text-center shadow-lg"
              >
                Book a Table
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;