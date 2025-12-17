import React from 'react';
import { ArrowRight } from 'lucide-react';
import Reveal from '../componets/Reveal';

const MenuSection = () => {
  const items = [
    { name: "Robusta Gold", price: "4.50", desc: "Signature dark roast, double shot", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop" },
    { name: "Hazelnut Pour", price: "5.00", desc: "Nutty undertones with oat milk", img: "https://images.unsplash.com/photo-1461023058943-48dbf945dae1?q=80&w=1000&auto=format&fit=crop" },
    { name: "Midnight Oil", price: "3.50", desc: "Pure black, maximum strength", img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=1000&auto=format&fit=crop" }
  ];

  return (
    <section id="menu" className="py-32 px-6 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4">Curated Brews</h2>
            <p className="text-rabuste-muted uppercase tracking-[0.2em] text-sm">Experience the bold side.</p>
          </div>
          <button className="group hidden md:flex items-center gap-3 text-sm font-bold tracking-widest uppercase hover:text-rabuste-gold transition-colors mt-6 md:mt-0">
            Full Menu <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <Reveal key={idx} delay={idx * 0.1} className="group cursor-pointer">
              <div className="relative overflow-hidden mb-6 aspect-[4/5] rounded-sm">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                />
              </div>
              <div className="flex justify-between items-baseline border-b border-dashed border-white/20 pb-4 mb-2 group-hover:border-rabuste-gold/50 transition-colors">
                <h3 className="text-xl font-serif font-bold">{item.name}</h3>
                <span className="text-rabuste-gold font-mono text-lg">${item.price}</span>
              </div>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </Reveal>
          ))}
        </div>
        
        <button className="md:hidden mt-12 w-full py-4 border border-white/20 text-white hover:bg-white hover:text-black transition-colors font-bold tracking-widest uppercase text-xs">
          View Full Menu
        </button>
      </div>
    </section>
  );
};

export default MenuSection;