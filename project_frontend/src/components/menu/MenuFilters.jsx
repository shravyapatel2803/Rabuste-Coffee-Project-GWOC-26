import { useEffect, useState, useRef } from "react";
import { getUserCategories, getUserTypes } from "../../api/item.api";
import { ChevronDown, Check, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- CUSTOM SCROLLBAR STYLES ---
const scrollbarStyles = `
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #b58d3f transparent;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #b58d3f; 
    border-radius: 20px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #d4af37; 
  }
`;

// --- CUSTOM DROPDOWN COMPONENT ---
const CustomDropdown = ({ options, value, onChange, placeholder, prefix = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-w-[10px]" ref={dropdownRef}>
      <style>{scrollbarStyles}</style>

      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-4 text-xs tracking-wider transition-all duration-300 rounded-sm border group select-none
          ${isOpen 
            ? "bg-white dark:bg-rabuste-surface border-rabuste-gold shadow-lg" 
            : "bg-transparent border-rabuste-text/20 hover:border-rabuste-gold/50"
          }`}
      >
        <div className="flex flex-col items-start text-left">
           <span className="text-[10px] uppercase font-bold text-rabuste-muted mb-0.5 group-hover:text-rabuste-gold transition-colors">
             {prefix || ""}
           </span>
           <span className={`font-serif text-sm font-medium truncate ${value ? "text-rabuste-text" : "text-rabuste-text/50"}`}>
             {value ? value : placeholder}
           </span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown 
            size={16} 
            className={`transition-colors ${isOpen ? "text-rabuste-orange" : "text-rabuste-muted group-hover:text-rabuste-text"}`} 
          />
        </motion.div>
      </button>

      {/* DROPDOWN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 top-full left-0 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-rabuste-gold/20 shadow-2xl rounded-sm overflow-hidden"
          >
            {/* SCROLL FIX: 
                1. 'overscroll-contain' prevents the page from scrolling when you hit the bottom of the list.
                2. 'max-h-64' limits height so scrolling triggers.
                3. 'overflow-y-auto' enables the scrollbar.
            */}
            <div 
              className="max-h-64 overflow-y-auto custom-scrollbar p-1 overscroll-contain"
              onWheel={(e) => e.stopPropagation()} // Stop event bubbling to parent (extra safety)
            >
              {options.map((opt) => {
                const optValue = typeof opt === 'string' ? opt : opt.value;
                const optLabel = typeof opt === 'string' ? opt : opt.label;
                const isSelected = value === optValue;

                return (
                  <div
                    key={optValue}
                    onClick={() => {
                      onChange(optValue);
                      setIsOpen(false);
                    }}
                    className={`relative px-4 py-3 mb-1 text-sm font-serif cursor-pointer flex items-center justify-between transition-all rounded-sm group select-none
                      ${isSelected 
                        ? "bg-rabuste-gold/10 text-rabuste-gold" 
                        : "text-rabuste-muted hover:bg-gray-100 dark:hover:bg-white/5 hover:text-rabuste-text dark:hover:text-white hover:pl-6"
                      }`}
                  >
                    <span className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-sm transition-all duration-300
                      ${isSelected ? "bg-rabuste-gold" : "bg-transparent group-hover:bg-rabuste-orange"}`} 
                    />
                    
                    <span className="capitalize">{optLabel.toLowerCase()}</span>
                    
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Check size={14} className="text-rabuste-gold"/>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MAIN FILTERS ---
const MenuFilters = ({ category, setCategory, type, setType, milkBased, setMilkBased }) => {
  const [categories, setCategories] = useState(["all"]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [catRes, typeRes] = await Promise.all([
          getUserCategories(),
          getUserTypes(),
        ]);
        setCategories(["all", ...(Array.isArray(catRes?.data?.data) ? catRes.data.data : [])]);
        setTypes(Array.isArray(typeRes?.data?.data) ? typeRes.data.data : []);
      } catch (err) {
        setCategories(["all"]);
        setTypes([]);
      }
    };
    loadFilters();
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 border-b border-rabuste-text/10 pb-8 ">
      
      {/* SECTION TITLE */}
      <div className="flex items-center gap-3">
        <div className="bg-rabuste-orange/10 p-2.5 rounded-sm border border-rabuste-orange/20">
           <Filter size={20} className="text-rabuste-orange" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-rabuste-text leading-none">Filter Menu</h3>
          <p className="text-[10px] uppercase tracking-widest text-rabuste-muted mt-1">Find your perfect brew</p>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap items-center gap-4 md:gap-2">
        
        <CustomDropdown 
          options={categories} 
          value={category === "all" ? "" : category} 
          onChange={setCategory} 
          placeholder="All Categories" // Added placeholder
        />

        <CustomDropdown 
          options={["", ...types]} 
          value={type === "" ? "" : type} 
          onChange={setType} 
          placeholder="All Types" // Added placeholder
        />

        {/* CHECKBOX */}
        <label 
          className={`flex items-center cursor-pointer group select-none h-[60px] px-5 rounded-sm border transition-all duration-300
          ${milkBased 
            ? "bg-white dark:bg-rabuste-surface border-rabuste-gold/50 shadow-md" 
            : "bg-transparent border-rabuste-text/20 hover:border-rabuste-gold/30"}`}
        >
          <div className="relative flex items-center gap-3">
             <div className="relative w-5 h-5">
                <input
                  type="checkbox"
                  checked={milkBased}
                  onChange={(e) => setMilkBased(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border border-rabuste-text/30 rounded-sm peer-checked:bg-rabuste-orange peer-checked:border-rabuste-orange transition-all"></div>
                <svg className="absolute w-3.5 h-3.5 text-white top-[3px] left-[3px] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
             </div>
             
             <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-rabuste-muted group-hover:text-rabuste-gold transition-colors">Preference</span>
                <span className={`font-serif text-sm font-medium ${milkBased ? "text-rabuste-text" : "text-rabuste-text/50"}`}>Milk Based</span>
             </div>
          </div>
        </label>

        {/* RESET BUTTON */}
        <button
          onClick={() => { setCategory("all"); setType(""); setMilkBased(false); }}
          className="h-[60px] px-4 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-white hover:bg-red-600/90 border border-transparent hover:border-red-500 rounded-sm transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default MenuFilters;