// src/pages/Workshops.jsx
import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageTransition from '../components/common/PageTransition';
import { Loader2, Calendar, Clock, Tag, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Workshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await apiClient.getWorkshops();
        setWorkshops(data);
      } catch (error) {
        console.error("Failed to fetch workshops", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-rabuste-bg flex items-center justify-center text-rabuste-orange">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-rabuste-bg text-rabuste-text">
        <Navbar />
        
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-16">
              <span className="text-rabuste-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                Community & Learning
              </span>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-rabuste-text mb-6">
                Workshops
              </h1>
              <p className="text-rabuste-muted max-w-2xl mx-auto text-lg font-light">
                Join us for interactive sessions on brewing, tasting, and art. 
                Experience the culture of Rabuste firsthand.
              </p>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workshops.map((workshop) => {
                const isCancelled = workshop.status === 'CANCELLED';

                return (
                  <div 
                    key={workshop.id} 
                    className={`
                      relative group border rounded-sm overflow-hidden transition-all duration-300 flex flex-col
                      ${isCancelled ? 'border-red-900/30 bg-red-900/5 opacity-70' : 'border-rabuste-text/10 bg-rabuste-text/5 hover:border-rabuste-orange/50 hover:-translate-y-1'}
                    `}
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`
                        px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-lg
                        ${isCancelled ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}
                      `}>
                        {workshop.status}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="h-56 overflow-hidden relative">
                      <img 
                        src={workshop.image} 
                        alt={workshop.title} 
                        className={`w-full h-full object-cover transition-transform duration-700 ${isCancelled ? 'grayscale' : 'group-hover:scale-105'}`}
                      />
                      {isCancelled && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <AlertCircle className="text-white w-12 h-12 opacity-80" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-rabuste-gold mb-3">
                        <span className="flex items-center gap-1"><Calendar size={12}/> {workshop.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12}/> {workshop.time}</span>
                      </div>

                      <h3 className={`text-2xl font-serif font-bold mb-3 ${isCancelled ? 'text-gray-500 line-through' : 'text-rabuste-text'}`}>
                        {workshop.title}
                      </h3>

                      <p className="text-rabuste-muted text-sm leading-relaxed mb-6 line-clamp-3">
                        {workshop.description}
                      </p>

                      <div className="mt-auto pt-6 border-t border-rabuste-text/10 flex items-center justify-between">
                        <span className="text-lg font-bold text-rabuste-text flex items-center gap-2">
                           <Tag size={16} className="text-rabuste-orange"/> {workshop.price}
                        </span>

                        {isCancelled ? (
                           <span className="text-xs font-bold uppercase tracking-widest text-red-500">Unavailable</span>
                        ) : (
                          <Link 
                            to={`/workshops/register/${workshop.id}`} 
                            className="px-6 py-2 bg-rabuste-text text-rabuste-bg font-bold text-xs uppercase tracking-widest hover:bg-rabuste-orange hover:text-white transition-colors rounded-sm"
                          >
                            Register
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
        
        <Footer />
      </main>
    </PageTransition>
  );
};

export default Workshops;