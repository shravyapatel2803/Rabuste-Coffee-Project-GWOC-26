import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import Reveal from '../componets/Reveal';

const Franchise = () => {
  return (
    <section id="franchise" className="py-16 md:py-32 px-6 bg-rabuste-bg border-t border-rabuste-text/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Left: Info */}
        <div className="order-2 lg:order-1">
          <Reveal>
            <span className="text-rabuste-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              Partner With Us
            </span>
            {/* FIX: text-white -> text-rabuste-text */}
            <h2 className="text-3xl md:text-6xl font-serif font-bold text-rabuste-text mb-6">
              Own a <span className="text-rabuste-gold italic">Rabuste</span>.
            </h2>
            <p className="text-rabuste-muted font-light leading-relaxed mb-8 md:mb-12 max-w-md">
              Join the movement. We are looking for partners who share our passion for bold coffee and industrial aesthetics.
            </p>

            <div className="space-y-6 md:space-y-8">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-rabuste-text/5 rounded-sm">
                  {/* FIX: text-white -> text-rabuste-text */}
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-rabuste-text" />
                </div>
                <div>
                  <h4 className="text-rabuste-text font-bold uppercase tracking-wider mb-1">Headquarters</h4>
                  <p className="text-rabuste-muted text-sm">Gujarat, India</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="p-4 bg-rabuste-text/5 rounded-sm">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-rabuste-text" />
                </div>
                <div>
                  <h4 className="text-rabuste-text font-bold uppercase tracking-wider mb-1">Franchise Inquiries</h4>
                  <p className="text-rabuste-muted text-sm">franchise@rabuste.com</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right: Simple Form */}
        <div className="order-1 lg:order-2">
          <Reveal delay={0.2}>
            {/* FIX: bg-white/5 -> bg-rabuste-surface, border-white/10 -> border-rabuste-text/10 */}
            <form className="bg-rabuste-surface p-6 md:p-12 border border-rabuste-text/10 rounded-sm">
              <h3 className="text-2xl text-rabuste-text font-serif mb-8">Request Information</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-2">Name</label>
                  {/* FIX: bg-black/50 -> bg-rabuste-bg, text-white -> text-rabuste-text */}
                  <input type="text" className="w-full bg-rabuste-bg border border-rabuste-text/10 p-3 md:p-4 text-rabuste-text focus:border-rabuste-gold focus:outline-none transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-2">Email</label>
                  <input type="email" className="w-full bg-rabuste-bg border border-rabuste-text/10 p-3 md:p-4 text-rabuste-text focus:border-rabuste-gold focus:outline-none transition-colors" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-2">Message</label>
                  <textarea rows="4" className="w-full bg-rabuste-bg border border-rabuste-text/10 p-3 md:p-4 text-rabuste-text focus:border-rabuste-gold focus:outline-none transition-colors" placeholder="Tell us about your interest..."></textarea>
                </div>
                <button className="w-full py-4 bg-rabuste-gold text-white font-bold tracking-widest uppercase hover:bg-rabuste-text transition-colors text-sm md:text-base">
                  Submit Request
                </button>
              </div>
            </form>
          </Reveal>
        </div>

      </div>
    </section>
  );
};

export default Franchise;