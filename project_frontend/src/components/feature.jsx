import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Coffee, Frame } from 'lucide-react';
import Reveal from './Reveal';

const Features = () => {
  return (
    <section id="about" className="py-16 md:py-32 px-6 bg-rabuste-bg relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-rabuste-gold/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-20"
        >
          <span className="text-rabuste-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
            Our Philosophy
          </span>
          {/* FIX: text-white -> text-rabuste-text */}
          <h2 className="text-3xl md:text-6xl font-serif font-bold text-rabuste-text mb-6">
            The <span className="italic text-rabuste-gold">Robuste</span> Standard.
          </h2>
          <div className="h-[1px] w-24 bg-rabuste-text/20" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { 
              icon: <Zap className="w-8 h-8" />, 
              title: "High Octane", 
              desc: "Double the caffeine. Pure energy for the creators and the night owls." 
            },
            { 
              icon: <Coffee className="w-8 h-8" />, 
              title: "Bold Roast", 
              desc: "Deep, earthy profiles with zero acidity. A coffee that punches back." 
            },
            { 
              icon: <Frame className="w-8 h-8" />, 
              title: "Art Space", 
              desc: "A living gallery. Sip amidst curated works from the city's underground artists." 
            }
          ].map((feature, index) => (
            <Reveal key={index} delay={index * 0.1}>
              {/* FIX: bg-white/5 -> bg-rabuste-text/5, border-white/10 -> border-rabuste-text/10 */}
              <div className="group p-8 md:p-10 h-full bg-rabuste-text/5 border border-rabuste-text/10 hover:border-rabuste-orange/50 transition-all duration-500 rounded-sm hover:bg-rabuste-text/10">
                <div className="mb-6 md:mb-8 text-rabuste-muted group-hover:text-rabuste-orange transition-colors duration-300">
                  {feature.icon}
                </div>
                {/* FIX: text-white -> text-rabuste-text */}
                <h3 className="text-xl md:text-2xl font-serif font-bold text-rabuste-text mb-4 group-hover:translate-x-1 transition-transform">
                  {feature.title}
                </h3>
                {/* FIX: text-gray-400 -> text-rabuste-muted */}
                <p className="text-rabuste-muted font-light leading-relaxed text-sm tracking-wide">
                  {feature.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;