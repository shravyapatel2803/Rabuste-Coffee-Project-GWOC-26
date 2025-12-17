import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import Reveal from '../componets/Reveal';

const Franchise = () => {
  return (
    <section id="franchise" className="py-32 px-6 bg-rabuste-bg border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left: Info */}
        <div>
          <Reveal>
            <span className="text-rabuste-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              Partner With Us
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
              Own a <span className="text-rabuste-gold italic">Rabuste</span>.
            </h2>
            <p className="text-gray-400 font-light leading-relaxed mb-12 max-w-md">
              Join the movement. We are looking for partners who share our passion for bold coffee and industrial aesthetics.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-white/5 rounded-sm">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wider mb-1">Headquarters</h4>
                  <p className="text-gray-500 text-sm">Gujarat, India</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="p-4 bg-white/5 rounded-sm">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wider mb-1">Franchise Inquiries</h4>
                  <p className="text-gray-500 text-sm">franchise@rabuste.com</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right: Simple Form */}
        <Reveal delay={0.2}>
          <form className="bg-white/5 p-8 md:p-12 border border-white/10 rounded-sm">
            <h3 className="text-2xl text-white font-serif mb-8">Request Information</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Name</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-rabuste-gold focus:outline-none transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email</label>
                <input type="email" className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-rabuste-gold focus:outline-none transition-colors" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Message</label>
                <textarea rows="4" className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-rabuste-gold focus:outline-none transition-colors" placeholder="Tell us about your interest..."></textarea>
              </div>
              <button className="w-full py-4 bg-rabuste-gold text-black font-bold tracking-widest uppercase hover:bg-white transition-colors">
                Submit Request
              </button>
            </div>
          </form>
        </Reveal>

      </div>
    </section>
  );
};

export default Franchise;