import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import { getWorkshopBySlug, registerForWorkshop } from '../api/workshop.api'; 
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Loader2, Calendar, Clock, MapPin, User, Mail, Phone, Ticket, CheckCircle, ArrowLeft, Users } from 'lucide-react';
import { motion } from 'framer-motion';

import { useShop } from '../context/ShopContext';

const WorkshopRegistration = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const { workshops } = useShop();

  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tickets: 1,
  });

  useEffect(() => {
    const fetchWorkshop = async () => {
      if (!id) return; 

      setLoading(true);

      const cachedWorkshop = workshops.find(w => w.slug === id || w._id === id);

      if (cachedWorkshop) {
        setWorkshop(cachedWorkshop);
        setLoading(false);
      }

      try {
        if (!cachedWorkshop) {
            const { data } = await getWorkshopBySlug(id);
            setWorkshop(data.data || data); 
        }
      } catch (error) {
        console.error("Error fetching workshop:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshop();
  }, [id, workshops]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await registerForWorkshop({ 
          ...formData, 
          workshopId: workshop._id, 
          slug: workshop.slug
      });
      setSubmitted(true);
    } catch (error) {
        const msg = error.response?.data?.message || "Registration failed. Please try again.";
        alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rabuste-bg flex justify-center items-center text-rabuste-orange">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen bg-rabuste-bg text-rabuste-text flex flex-col justify-center items-center">
        <h2 className="text-2xl font-serif mb-4">Workshop not found</h2>
        <Link to="/workshops" className="text-rabuste-orange underline">Back to Workshops</Link>
      </div>
    );
  }

  const spotsLeft = workshop.capacity - workshop.registeredCount;
  const isSoldOut = spotsLeft <= 0;

  if (submitted) {
    return (
      <main className="min-h-screen bg-rabuste-bg text-rabuste-text flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center px-4 py-32">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1a1a1a] border border-rabuste-gold/30 rounded-lg max-w-md w-full overflow-hidden shadow-2xl relative"
          >
             {/* Ticket Header */}
             <div className="bg-rabuste-gold p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 text-black">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                    <h2 className="text-2xl font-black uppercase tracking-widest">Access Granted</h2>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">See you at Rabuste</p>
                </div>
             </div>

             {/* Ticket Body */}
             <div className="p-8 relative">
                {/* Punch Holes */}
                <div className="absolute top-0 left-0 -ml-3 -mt-3 w-6 h-6 bg-rabuste-bg rounded-full"></div>
                <div className="absolute top-0 right-0 -mr-3 -mt-3 w-6 h-6 bg-rabuste-bg rounded-full"></div>

                <div className="text-center mb-8">
                    <h3 className="text-xl text-white font-serif font-bold mb-2">{workshop.title}</h3>
                    <p className="text-rabuste-gold text-sm uppercase tracking-widest">{formData.tickets} Ticket(s) Reserved</p>
                </div>

                <div className="space-y-4 border-t border-dashed border-white/20 pt-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 uppercase tracking-wider text-xs">Guest</span>
                        <span className="text-white font-bold">{formData.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 uppercase tracking-wider text-xs">Date</span>
                        <span className="text-white font-bold">{new Date(workshop.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 uppercase tracking-wider text-xs">Time</span>
                        <span className="text-white font-bold">{workshop.startTime}</span>
                    </div>
                </div>

                <button onClick={() => navigate('/workshops')} className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors">
                    Back to Workshops
                </button>
             </div>
          </motion.div>
        </div>
      </main>
    )
  }

 
  return (
    <main className="min-h-screen bg-rabuste-bg text-rabuste-text">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-rabuste-muted hover:text-rabuste-orange transition-colors mb-8 uppercase tracking-widest text-xs font-bold"
        >
          <ArrowLeft size={16} /> Back to Workshops
        </button>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Left: Event Details */}
            <div>
                <div className="rounded-lg overflow-hidden border border-rabuste-text/10 mb-8">
                    <img src={workshop.image?.url} alt={workshop.image?.alt || workshop.title} className="w-full h-64 object-cover" />
                </div>
                
                <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6">{workshop.title}</h1>
                <p className="text-rabuste-muted leading-relaxed mb-8">{workshop.description}</p>
                
                <div className="space-y-4 text-sm font-medium">
                    <div className="flex items-center gap-4 text-rabuste-text">
                        <Calendar className="text-rabuste-gold" size={20} />
                        <span>{new Date(workshop.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-4 text-rabuste-text">
                        <Clock className="text-rabuste-gold" size={20} />
                        <span>{workshop.startTime} {workshop.endTime && `- ${workshop.endTime}`}</span>
                    </div>
                    <div className="flex items-center gap-4 text-rabuste-text">
                        <MapPin className="text-rabuste-gold" size={20} />
                        <span>Rabuste HQ, Gandhinagar</span>
                    </div>
                    <div className="flex items-center gap-4 text-rabuste-text">
                        <Ticket className="text-rabuste-gold" size={20} />
                        <span className="text-rabuste-orange font-bold">
                            {workshop.isFree ? "FREE" : `${workshop.currency} ${workshop.price}`}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-rabuste-text">
                        <Users className="text-rabuste-gold" size={20} />
                        <span>{spotsLeft} spots remaining</span>
                    </div>
                </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white/5 p-8 md:p-10 rounded-sm border border-white/10 h-fit sticky top-32">
                <h2 className="text-2xl font-serif font-bold mb-6 border-b border-white/10 pb-4">Secure Your Spot</h2>
                
                {isSoldOut ? (
                    <div className="bg-red-500/10 border border-red-500/20 p-6 text-center rounded-sm">
                        <h3 className="text-red-500 font-bold uppercase tracking-widest mb-2">Sold Out</h3>
                        <p className="text-gray-400 text-sm">We are sorry, this workshop is currently at full capacity.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input 
                                    required name="name" type="text" value={formData.name} onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 p-4 pl-12 text-white focus:border-rabuste-gold focus:outline-none rounded-sm transition-colors"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input 
                                    required name="email" type="email" value={formData.email} onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 p-4 pl-12 text-white focus:border-rabuste-gold focus:outline-none rounded-sm transition-colors"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input 
                                    required name="phone" type="tel" value={formData.phone} onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 p-4 pl-12 text-white focus:border-rabuste-gold focus:outline-none rounded-sm transition-colors"
                                    placeholder="+91 ..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Number of Tickets</label>
                            <select 
                                name="tickets" value={formData.tickets} onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-rabuste-gold focus:outline-none rounded-sm transition-colors"
                            >
                                {[...Array(Math.min(5, spotsLeft))].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1} Ticket{i > 0 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="w-full py-4 bg-rabuste-orange text-white font-bold tracking-widest uppercase hover:bg-rabuste-gold transition-colors rounded-sm flex justify-center gap-2 items-center"
                        >
                            {submitting && <Loader2 className="animate-spin" size={20} />}
                            {submitting ? 'Processing...' : 'Confirm Registration'}
                        </button>
                        
                        <p className="text-center text-xs text-gray-500">
                            By registering, you agree to our terms of service.
                        </p>
                    </form>
                )}
            </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default WorkshopRegistration;