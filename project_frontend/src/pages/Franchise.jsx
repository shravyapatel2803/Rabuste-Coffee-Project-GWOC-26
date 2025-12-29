import React, { useState } from 'react';
import { Mail, MapPin, Loader2 } from 'lucide-react';
import Reveal from '../components/Reveal';
import API from '../api/api'; // Import your axios instance

const Franchise = () => {
  // 1. Add state to hold form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Send data to your backend (You'll need to create this route later!)
      await API.post('/franchise-request', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' }); // Clear form
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section id="franchise" className="py-16 md:py-32 px-6 bg-rabuste-bg border-t border-rabuste-text/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

        {/* Left Side (Text Info) - Kept same as your original file */}
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
              {/* ... (Existing icons/text code here) ... */}
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
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-rabuste-muted mb-2 pt-4 pb-1">Phone</label>
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
                  <div>
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
                  className="w-full py-4 bg-rabuste-gold text-white font-bold tracking-widest uppercase hover:bg-rabuste-text transition-colors text-sm md:text-base flex justify-center items-center gap-2"
                >
                  {status === 'loading' && <Loader2 className="animate-spin" />}
                  {status === 'success' ? 'Request Sent!' : 'Submit Request'}
                </button>

                {status === 'error' && <p className="text-red-500 text-xs mt-2">Something went wrong. Try again.</p>}
              </div>
            </form>
          </Reveal>
        </div>

      </div>
    </section>
  );
};

export default Franchise;