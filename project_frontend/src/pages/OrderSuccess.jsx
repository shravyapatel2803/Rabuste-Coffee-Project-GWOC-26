import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { CheckCircle, Home, Coffee } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { orderId } = location.state || {};

  return (
    <div className="min-h-screen bg-rabuste-bg flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-24">
        
        <div className="mb-6 animate-bounce">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500">
            <CheckCircle size={48} className="text-green-500" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-rabuste-text mb-2">
          Order Placed Successfully!
        </h1>
        
        <p className="text-rabuste-muted max-w-md mb-8">
          Thank you for choosing Rabuste Coffee. Your order has been received and is being prepared with love. ☕
        </p>

        {/* Order Details Card */}
        <div className="bg-white/5 border border-rabuste-text/10 p-6 rounded-lg w-full max-w-sm mb-8">
          <p className="text-sm text-rabuste-muted uppercase tracking-widest mb-2">Order ID</p>
          <p className="text-xl font-mono font-bold text-rabuste-orange break-all">
            {orderId || "RB-UNKNOWN"}
          </p>
          <div className="mt-4 text-xs text-gray-500">
            Please show this ID at the counter.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 border border-rabuste-text/20 rounded-lg text-rabuste-text hover:bg-white/5 transition-colors"
          >
            <Home size={18} /> Home
          </button>
          
          <button 
            onClick={() => navigate('/menu')}
            className="flex items-center gap-2 px-6 py-3 bg-rabuste-orange text-white rounded-lg font-bold hover:bg-rabuste-gold transition-colors shadow-lg shadow-orange-900/20"
          >
            <Coffee size={18} /> Order More
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;