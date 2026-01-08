import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageTransition from '../components/common/PageTransition';
import { Calendar, Clock, Tag, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useShop } from '../context/ShopContext';

const Workshops = () => {
  const { workshops } = useShop();

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
                const isFull = workshop.registeredCount >= workshop.capacity;
                const isActive = workshop.isActive;
                
                let statusLabel = "OPEN";
                let statusColor = "bg-green-600";

                if (!isActive) {
                    statusLabel = "CANCELLED";
                    statusColor = "bg-red-600";
                } else if (isFull) {
                    statusLabel = "SOLD OUT";
                    statusColor = "bg-gray-600";
                }

                return (
                  <div 
                    key={workshop._id} 
                    className={`
                      relative group border rounded-sm overflow-hidden transition-all duration-300 flex flex-col
                      ${!isActive ? 'border-red-900/30 bg-red-900/5 opacity-70' : 'border-rabuste-text/10 bg-rabuste-text/5 hover:border-rabuste-orange/50 hover:-translate-y-1'}
                    `}
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`
                        px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-lg text-white ${statusColor}
                      `}>
                        {statusLabel}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="h-56 overflow-hidden relative">
                      <img 
                        src={workshop.image?.url} 
                        alt={workshop.image?.alt || workshop.title} 
                        className={`w-full h-full object-cover transition-transform duration-700 ${!isActive ? 'grayscale' : 'group-hover:scale-105'}`}
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-rabuste-gold">
                            <span className="flex items-center gap-1">
                                <Calendar size={12}/> 
                                {new Date(workshop.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={12}/> 
                                {workshop.startTime}
                            </span>
                        </div>
                      </div>

                      <h3 className={`text-2xl font-serif font-bold mb-3 ${!isActive ? 'text-gray-500 line-through' : 'text-rabuste-text'}`}>
                        {workshop.title}
                      </h3>

                      <p className="text-rabuste-muted text-sm leading-relaxed mb-6 line-clamp-3">
                        {workshop.shortDescription || workshop.description}
                      </p>

                      <div className="mt-auto pt-6 border-t border-rabuste-text/10 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-rabuste-text flex items-center gap-2">
                            <Tag size={16} className="text-rabuste-orange"/> 
                            {workshop.isFree ? "FREE" : `${workshop.currency} ${workshop.price}`}
                            </span>
                            {isActive && (
                                <span className="text-[10px] text-rabuste-muted flex items-center gap-1 mt-1">
                                    <Users size={10} />
                                    {workshop.capacity - workshop.registeredCount} spots left
                                </span>
                            )}
                        </div>

                        {!isActive || isFull ? (
                           <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                               {isFull ? "Join Waitlist" : "Unavailable"}
                           </span>
                        ) : (
                          <Link 
                            to={`/workshops/register/${workshop.slug}`} 
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