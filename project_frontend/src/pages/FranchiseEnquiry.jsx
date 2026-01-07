import React, { useState, useEffect } from 'react';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Briefcase, 
  CheckCircle, 
  Download, 
  IndianRupee, 
  ArrowRight,
  FileText,
  PartyPopper,
  X // Imported X icon
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

// --- CONFETTI COMPONENT ---
const Confetti = () => {
  const colors = ['#C25E00', '#D4AF37', '#ffffff', '#F3F4F6'];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full opacity-80"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{
            y: ['0vh', '100vh'],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: 720,
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: Math.random() * 2 + 3,
            delay: Math.random() * 0.5,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};

const FranchiseEnquiry = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    investmentRange: '10-20 Lakhs',
    experienceInBusiness: 'no',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  // --- EFFECT: Close on 'Escape' Key ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && submitted) {
        setSubmitted(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [submitted]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      experienceInBusiness: formData.experienceInBusiness === 'yes'
    };

    console.log("Franchise Enquiry Payload:", payload);
    setSubmitted(true);
  };

  // --- CONFIRMATION SCREEN ---
  if (submitted) {
    return (
      <main className="min-h-screen bg-rabuste-bg text-rabuste-text flex flex-col relative overflow-hidden">
        <Navbar />
        
        <Confetti />

        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rabuste-orange/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rabuste-gold/10 rounded-full blur-[100px]" />
        </div>

        <div className="flex-grow flex items-center justify-center px-4 py-32 z-10">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="relative w-full max-w-lg"
          >
            {/* RECEIPT CARD */}
            <div className="bg-rabuste-surface border border-rabuste-text/10 rounded-lg shadow-2xl overflow-hidden relative">
              
              {/* Close Button (X) */}
              <button 
                onClick={() => setSubmitted(false)}
                className="absolute top-4 right-4 z-30 p-2 text-black/50 hover:text-black bg-white/20 hover:bg-white/40 rounded-full transition-all"
                title="Close (Esc)"
              >
                <X size={18} />
              </button>

              {/* Header Section */}
              <div className="bg-rabuste-gold p-6 text-black text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="bg-white p-3 rounded-full shadow-lg"
                  >
                    <PartyPopper className="w-8 h-8 text-rabuste-orange" />
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl font-serif font-bold uppercase tracking-widest mt-2"
                  >
                    Proposal Received!
                  </motion.h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Rabuste Franchise Division</p>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="p-8 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 w-6 h-6 bg-rabuste-bg rounded-full border border-rabuste-text/10"></div>

                <div className="text-center mb-8">
                  <p className="text-rabuste-muted text-xs uppercase tracking-widest mb-1">Applicant</p>
                  <h3 className="text-xl text-rabuste-text font-serif">{formData.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8 border-b border-dashed border-rabuste-text/10 pb-8">
                  <div className="text-center">
                    <div className="flex justify-center mb-2 text-rabuste-gold"><MapPin size={20} /></div>
                    <p className="text-rabuste-muted text-[10px] uppercase tracking-widest">Location</p>
                    <p className="text-rabuste-text font-bold text-sm">{formData.city}, {formData.state}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2 text-rabuste-gold"><IndianRupee size={20} /></div>
                    <p className="text-rabuste-muted text-[10px] uppercase tracking-widest">Budget</p>
                    <p className="text-rabuste-text font-bold text-sm">{formData.investmentRange}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2 text-rabuste-gold"><Building size={20} /></div>
                    <p className="text-rabuste-muted text-[10px] uppercase tracking-widest">Experience</p>
                    <p className="text-rabuste-text font-bold text-sm">{formData.experienceInBusiness === 'yes' ? 'Experienced' : 'First Time'}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2 text-rabuste-gold"><CheckCircle size={20} /></div>
                    <p className="text-rabuste-muted text-[10px] uppercase tracking-widest">Status</p>
                    <p className="text-green-500 font-bold text-sm">In Review</p>
                  </div>
                </div>

                <div className="bg-rabuste-bg/50 border border-rabuste-text/5 p-4 rounded-sm mb-8 text-center">
                  <p className="text-rabuste-muted text-xs italic">
                    "Thank you for your interest. Our franchise development team will review your details and contact you within 24-48 hours."
                  </p>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => window.print()} 
                    className="w-full py-3 bg-rabuste-bg hover:bg-rabuste-text/5 border border-rabuste-text/10 text-rabuste-text font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm transition-colors"
                  >
                    <Download size={16} /> Save Copy
                  </button>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="w-full py-3 text-rabuste-muted hover:text-rabuste-text text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                     New Application <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div className="h-1 bg-gradient-to-r from-rabuste-orange to-rabuste-gold w-full" />
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  // --- FORM SCREEN (Unchanged) ---
  return (
    <main className="min-h-screen bg-rabuste-bg text-rabuste-text">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-rabuste-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              Join The Family
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-rabuste-text mb-6">
              Franchise Partnership
            </h1>
            <p className="text-rabuste-muted max-w-2xl mx-auto leading-relaxed">
              Embark on a profitable journey with Rabuste. We are looking for passionate partners to bring our premium coffee experience to new cities. Fill out the details below to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-rabuste-surface p-8 md:p-12 border border-rabuste-text/10 rounded-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rabuste-orange/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid md:grid-cols-2 gap-12 relative z-10">
              
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-rabuste-text/10 pb-4 mb-6">
                  <div className="bg-rabuste-gold/20 p-2 rounded-full">
                    <User size={18} className="text-rabuste-gold"/> 
                  </div>
                  <h3 className="text-xl font-serif text-rabuste-text">Applicant Details</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-2">Full Name</label>
                    <input 
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text" 
                      className="w-full bg-rabuste-bg border border-rabuste-text/10 p-4 text-rabuste-text focus:border-rabuste-gold focus:outline-none transition-colors rounded-sm placeholder-rabuste-muted/50" 
                      placeholder="Enter your name" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-2">Email Address</label>
                    <input 
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email" 
                      className="w-full bg-rabuste-bg border border-rabuste-text/10 p-4 text-rabuste-text focus:border-rabuste-gold focus:outline-none transition-colors rounded-sm placeholder-rabuste-muted/50" 
                      placeholder="partner@example.com" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-2">Phone Number</label>
                    <input 
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel" 
                      className="w-full bg-rabuste-bg border border-rabuste-text/10 p-4 text-rabuste-text focus:border-rabuste-gold focus:outline-none transition-colors rounded-sm placeholder-rabuste-muted/50" 
                      placeholder="+91 98765 43210" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-rabuste-text/10 pb-4 mb-6">
                   <div className="bg-rabuste-orange/20 p-2 rounded-full">
                    <Building size={18} className="text-rabuste-orange"/> 
                  </div>
                  <h3 className="text-xl font-serif text-rabuste-text">Business Proposal</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-2">City</label>
                    <input 
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      type="text" 
                      className="w-full bg-rabuste-bg border border-rabuste-text/10 p-4 text-rabuste-text focus:border-rabuste-gold focus:outline-none transition-colors rounded-sm placeholder-rabuste-muted/50" 
                      placeholder="Surat" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-2">State</label>
                    <input 
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      type="text" 
                      className="w-full bg-rabuste-bg border border-rabuste-text/10 p-4 text-rabuste-text focus:border-rabuste-gold focus:outline-none transition-colors rounded-sm placeholder-rabuste-muted/50" 
                      placeholder="Gujarat" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-2 flex items-center gap-2">
                    Investment Budget
                  </label>
                  <div className="relative">
                    <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-rabuste-muted"/>
                    <select 
                      name="investmentRange"
                      value={formData.investmentRange}
                      onChange={handleChange}
                      className="w-full bg-rabuste-bg border border-rabuste-text/10 p-4 pl-10 text-rabuste-text focus:border-rabuste-gold focus:outline-none transition-colors rounded-sm appearance-none"
                    >
                      <option value="10-20 Lakhs">10 – 20 Lakhs</option>
                      <option value="20-30 Lakhs">20 – 30 Lakhs</option>
                      <option value="30-50 Lakhs">30 – 50 Lakhs</option>
                      <option value="50 Lakhs+">50 Lakhs+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-3">
                    Previous Business Experience?
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.experienceInBusiness === 'yes' ? 'border-rabuste-gold' : 'border-rabuste-muted'}`}>
                        {formData.experienceInBusiness === 'yes' && <div className="w-2.5 h-2.5 bg-rabuste-gold rounded-full" />}
                      </div>
                      <input 
                        type="radio" 
                        name="experienceInBusiness" 
                        value="yes"
                        checked={formData.experienceInBusiness === 'yes'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span className={`text-sm ${formData.experienceInBusiness === 'yes' ? 'text-rabuste-text' : 'text-rabuste-muted'} group-hover:text-rabuste-text transition-colors`}>Yes, I have</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.experienceInBusiness === 'no' ? 'border-rabuste-gold' : 'border-rabuste-muted'}`}>
                        {formData.experienceInBusiness === 'no' && <div className="w-2.5 h-2.5 bg-rabuste-gold rounded-full" />}
                      </div>
                      <input 
                        type="radio" 
                        name="experienceInBusiness" 
                        value="no"
                        checked={formData.experienceInBusiness === 'no'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span className={`text-sm ${formData.experienceInBusiness === 'no' ? 'text-rabuste-text' : 'text-rabuste-muted'} group-hover:text-rabuste-text transition-colors`}>No, I am new</span>
                    </label>
                  </div>
                </div>

                <div>
                   <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-2">Message / Notes</label>
                   <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="2"
                    className="w-full bg-rabuste-bg border border-rabuste-text/10 p-4 text-rabuste-text focus:border-rabuste-gold focus:outline-none transition-colors rounded-sm placeholder-rabuste-muted/50" 
                    placeholder="Tell us why you want to partner with us..." 
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-rabuste-text/10">
              <button type="submit" className="w-full py-5 bg-gradient-to-r from-rabuste-gold to-yellow-600 text-black font-bold tracking-[0.2em] uppercase hover:to-yellow-500 transition-all rounded-sm shadow-xl shadow-yellow-900/20 transform hover:-translate-y-1">
                Submit Franchise Enquiry
              </button>
              <p className="text-center text-[10px] text-rabuste-muted mt-4 uppercase tracking-widest">
                <FileText size={10} className="inline mr-1"/> By submitting, you agree to our privacy policy
              </p>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default FranchiseEnquiry;