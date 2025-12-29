import React, { useState } from 'react';
import { Calendar, Clock, Users, Phone, Mail, User, MessageSquare, CheckCircle, Download, CalendarPlus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const BookTable = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    request: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    console.log("Reservation Data:", formData);
    setSubmitted(true);
  };

  // --- CONFIRMATION SCREEN (ADVANCED UI) ---
  if (submitted) {
    return (
      <main className="min-h-screen bg-rabuste-bg text-rabuste-text flex flex-col relative overflow-hidden">
        <Navbar />
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rabuste-orange/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rabuste-gold/10 rounded-full blur-[100px]" />
        </div>

        <div className="flex-grow flex items-center justify-center px-4 py-32 z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="relative w-full max-w-lg"
          >
            {/* TICKET CONTAINER */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl overflow-hidden relative">
              
              {/* Header Section */}
              <div className="bg-rabuste-gold p-6 text-black text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <CheckCircle className="w-12 h-12 mb-2" />
                  <h2 className="text-2xl font-serif font-bold uppercase tracking-widest">Reservation Confirmed</h2>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Rabuste Coffee • Gujarat</p>
                </div>
              </div>

              {/* Ticket Body */}
              <div className="p-8 relative">
                {/* Decorative Side Notches (Ticket holes) */}
                <div className="absolute top-0 left-0 -ml-3 -mt-3 w-6 h-6 bg-rabuste-bg rounded-full border border-white/10"></div>
                <div className="absolute top-0 right-0 -mr-3 -mt-3 w-6 h-6 bg-rabuste-bg rounded-full border border-white/10"></div>

                <div className="text-center mb-8">
                  <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">Guest Name</p>
                  <h3 className="text-2xl text-white font-serif">{formData.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8 border-b border-dashed border-white/10 pb-8">
                  <div className="text-center">
                    <div className="flex justify-center mb-2 text-rabuste-gold"><Calendar size={20} /></div>
                    <p className="text-gray-500 text-xs uppercase tracking-widest">Date</p>
                    <p className="text-white font-bold">{formData.date}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2 text-rabuste-gold"><Clock size={20} /></div>
                    <p className="text-gray-500 text-xs uppercase tracking-widest">Time</p>
                    <p className="text-white font-bold">{formData.time}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2 text-rabuste-gold"><Users size={20} /></div>
                    <p className="text-gray-500 text-xs uppercase tracking-widest">Guests</p>
                    <p className="text-white font-bold">{formData.guests} People</p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2 text-rabuste-gold"><CheckCircle size={20} /></div>
                    <p className="text-gray-500 text-xs uppercase tracking-widest">Status</p>
                    <p className="text-green-500 font-bold">Confirmed</p>
                  </div>
                </div>

                {/* QR Code Mockup */}
                <div className="flex flex-col items-center gap-4 mb-8">
                  <div className="bg-white p-2 rounded-sm">
                    {/* Placeholder QR Code - Using a simple grid pattern for visual */}
                    <div className="w-32 h-32 bg-black flex flex-wrap content-start p-1">
                      {[...Array(64)].map((_, i) => (
                        <div key={i} className={`w-3 h-3 m-[0.5px] ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`}></div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Scan at the entrance</p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button 
                    onClick={() => window.print()} 
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm transition-colors"
                  >
                    <Download size={16} /> Download Ticket
                  </button>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="w-full py-3 text-gray-500 hover:text-white text-xs uppercase tracking-widest transition-colors"
                  >
                    Make Another Reservation
                  </button>
                </div>
              </div>

              {/* Bottom Decorative Edge */}
              <div className="h-2 bg-rabuste-gold/20 w-full" />
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  // --- STANDARD FORM SCREEN ---
  return (
    <main className="min-h-screen bg-rabuste-bg text-rabuste-text">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-rabuste-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              Reservations
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Book a Table
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto">
              Reserve your spot at Rabuste. Whether it's a coffee date or a business meeting, we have the perfect space for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/5 p-8 md:p-12 border border-white/10 rounded-sm shadow-2xl relative overflow-hidden">
            {/* Subtle light effect on form */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rabuste-orange/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="grid md:grid-cols-2 gap-8 mb-8 relative z-10">
              
              {/* Personal Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-serif text-white border-b border-white/10 pb-2">Contact Details</h3>
                
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                    <User size={14} className="text-rabuste-gold"/> Name
                  </label>
                  <input 
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text" 
                    className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-rabuste-gold focus:outline-none transition-colors rounded-sm" 
                    placeholder="John Doe" 
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                    <Mail size={14} className="text-rabuste-gold"/> Email
                  </label>
                  <input 
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email" 
                    className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-rabuste-gold focus:outline-none transition-colors rounded-sm" 
                    placeholder="john@example.com" 
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                    <Phone size={14} className="text-rabuste-gold"/> Phone
                  </label>
                  <input 
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel" 
                    className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-rabuste-gold focus:outline-none transition-colors rounded-sm" 
                    placeholder="+91 98765 43210" 
                  />
                </div>
              </div>

              {/* Reservation Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-serif text-white border-b border-white/10 pb-2">Reservation Details</h3>
                
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                    <Calendar size={14} className="text-rabuste-gold"/> Date
                  </label>
                  <input 
                    required
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    type="date" 
                    className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-rabuste-gold focus:outline-none transition-colors rounded-sm [color-scheme:dark]" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                      <Clock size={14} className="text-rabuste-gold"/> Time
                    </label>
                    <input 
                      required
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      type="time" 
                      className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-rabuste-gold focus:outline-none transition-colors rounded-sm [color-scheme:dark]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                      <Users size={14} className="text-rabuste-gold"/> Guests
                    </label>
                    <select 
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-rabuste-gold focus:outline-none transition-colors rounded-sm"
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num} Person{num > 1 ? 's' : ''}</option>
                      ))}
                      <option value="group">Large Group (9+)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                    <MessageSquare size={14} className="text-rabuste-gold"/> Special Request
                  </label>
                  <textarea 
                    name="request"
                    value={formData.request}
                    onChange={handleChange}
                    rows="2"
                    className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-rabuste-gold focus:outline-none transition-colors rounded-sm" 
                    placeholder="Birthday, Anniversary, Quiet corner..." 
                  ></textarea>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-rabuste-gold text-black font-bold tracking-widest uppercase hover:bg-white transition-colors rounded-sm shadow-lg shadow-yellow-900/20">
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default BookTable;