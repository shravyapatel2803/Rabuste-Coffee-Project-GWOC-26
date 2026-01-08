import React, { useState } from 'react';
import { Mail, MapPin, Loader2 } from 'lucide-react';
import Reveal from '../components/Reveal';
import { createFranchiseEnquiry } from '../api/franchise.api'; 

const Franchise = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await createFranchiseEnquiry(formData);
      
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', city: '', message: '' });
      
      setTimeout(() => setStatus('idle'), 5000);
      
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section id="franchise" className="py-16 md:py-32 px-6 bg-rabuste-bg border-t border-rabuste-text/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

        {/* Left Side (Text Info) */}
        <div className="order-2 lg:order-1">
          <Reveal>
            <span className="text-rabuste-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              Partner With Us
            </span>
            <h2 className="text-3xl md:text-6xl font-serif font-bold text-rabuste-text mb-6">
              Own a <span className="text-rabuste-gold italic">Rabuste</span>.
            </h2>
            <p className="text-rabuste-muted font-light leading-relaxed mb-8 md:mb-12 max-w-md">
              Join the movement. We are looking for partners who share our passion for bold coffee and industrial aesthetics.
            </p>

            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-full border border-rabuste-text/10 flex items-center justify-center group-hover:border-rabuste-orange transition-colors">
                  <Mail className="text-rabuste-muted group-hover:text-rabuste-orange transition-colors" size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-rabuste-muted mb-1">Email Us</p>
                  <p className="text-rabuste-text font-serif text-lg">franchise@rabuste.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-full border border-rabuste-text/10 flex items-center justify-center group-hover:border-rabuste-orange transition-colors">
                  <MapPin className="text-rabuste-muted group-hover:text-rabuste-orange transition-colors" size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-rabuste-muted mb-1">Headquarters</p>
                  <p className="text-rabuste-text font-serif text-lg">Gandhinagar, Gujarat</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right Side: The Form */}
        <div className="order-1 lg:order-2">
          <Reveal delay={0.2}>
            <form onSubmit={handleSubmit} className="bg-rabuste-surface p-6 md:p-12 border border-rabuste-text/10 rounded-sm">
              <h3 className="text-2xl text-rabuste-text font-serif mb-8">Request Information</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-2">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    type="text"
                    className="w-full bg-rabuste-bg border border-rabuste-text/10 p-3 md:p-4 text-rabuste-text focus:border-rabuste-gold focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-2">Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    type="email"
                    className="w-full bg-rabuste-bg border border-rabuste-text/10 p-3 md:p-4 text-rabuste-text focus:border-rabuste-gold focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                  {/* Phone Field */}
                  <div className="mt-4">
                    <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-2">Phone</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      type="tel"
                      className="w-full bg-rabuste-bg border border-rabuste-text/10 p-3 md:p-4 text-rabuste-text focus:border-rabuste-gold focus:outline-none transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  {/* City Field */}
                  <div className="mt-4">
                    <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-2">City</label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      type="text"
                      className="w-full bg-rabuste-bg border border-rabuste-text/10 p-3 md:p-4 text-rabuste-text focus:border-rabuste-gold focus:outline-none transition-colors"
                      placeholder="Mumbai"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full bg-rabuste-bg border border-rabuste-text/10 p-3 md:p-4 text-rabuste-text focus:border-rabuste-gold focus:outline-none transition-colors"
                    placeholder="Tell us about your interest..."
                  ></textarea>
                </div>

                <button
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full py-4 bg-rabuste-gold text-white font-bold tracking-widest uppercase hover:bg-rabuste-text transition-colors text-sm md:text-base flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' && <Loader2 className="animate-spin" size={20} />}
                  {status === 'success' ? 'Request Sent!' : 'Submit Request'}
                  {status === 'idle' || status === 'error' ? 'Submit Request' : null}
                </button>

                {status === 'error' && <p className="text-red-500 text-xs mt-2 text-center">Something went wrong. Please try again.</p>}
              </div>
            </form>
          </Reveal>
        </div>

      </div>
    </section>
  );
};

export default Franchise;