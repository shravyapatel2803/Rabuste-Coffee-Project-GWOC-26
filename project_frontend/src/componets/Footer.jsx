import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const Footer = () => {
  return (
    <footer id="contact" className="bg-[#0a0a0a] text-white pt-24 pb-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16 mb-24">
        
        {/* Brand Big Text */}
        <div className="md:w-1/2">
          <h2 className="text-6xl md:text-[8rem] font-serif font-black leading-[0.8] tracking-tighter text-white/90 mb-8">
            RABUSTE.
          </h2>
          <p className="text-gray-500 max-w-sm text-lg font-light">
            Where coffee meets culture. <br />
            Bold flavors. Industrial soul.
          </p>
        </div>
        
        {/* Links */}
        <div className="flex gap-16 md:pt-4">
          <div>
            <h4 className="font-bold uppercase tracking-[0.2em] text-xs text-rabuste-gold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              {/* UPDATED LINKS: Use Link to="/#section" */}
              <li><Link to="/#about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/#menu" className="hover:text-white transition-colors">The Brews</Link></li>
              <li><Link to="/#gallery" className="hover:text-white transition-colors">Exhibitions</Link></li>
              <li><Link to="/#franchise" className="hover:text-white transition-colors">Franchise</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-[0.2em] text-xs text-rabuste-gold mb-6">Visit</h4>
            <div className="space-y-4 text-sm text-gray-400 font-medium">
              <div className="w-full max-w-[300px] overflow-hidden rounded-lg opacity-80 hover:opacity-100 transition-opacity">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1337.3376772876818!2d72.77109196269188!3d21.161730349190787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04d00111b19b5%3A0xba45eb84da00c79f!2sRABUSTE!5e1!3m2!1sen!2sin!4v1766051429585!5m2!1sen!2sin" 
                width="100%" 
                height="200" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map Location"
              ></iframe>
            </div>
              <p className="pt-4">Mon - Sun<br/>07:00 AM - 10:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-gray-600 font-medium uppercase tracking-wider">
        <p>© 2025 Rabuste Coffee Project.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="https://www.instagram.com/rabuste.coffee/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
          <a href="https://www.facebook.com/369626482902125?ref=pl_edit_xav_ig_profile_page_web_bt" target='_blank' className="hover:text-white transition-colors">Facebook</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;