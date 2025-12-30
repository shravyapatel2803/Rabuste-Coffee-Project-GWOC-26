import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import { CreditCard, Clock, Receipt, Coffee, Loader2, Trash2 } from 'lucide-react';
import { useCart } from "../context/CartContext";
import { apiClient } from "../api/client";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  // Get cart data from context
  const { cart, totalPrice, clearCart, removeFromCart } = useCart();
  
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [pickupTime, setPickupTime] = useState("ASAP");

  const handlePayment = async () => {
    setIsProcessing(true);
    const orderDetails = {
      items: cart,
      total: totalPrice,
      pickupTime: pickupTime,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await apiClient.placeOrder(orderDetails);
      if (response.success) {
        alert(`Order Placed! Order ID: ${response.orderId}`);
        clearCart();
        navigate("/");
      }
    } catch (error) {
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-rabuste-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-serif mb-4 text-rabuste-text">Your cart is empty</h2>
          <button onClick={() => navigate("/shop")} className="text-rabuste-orange underline font-bold uppercase tracking-widest text-sm">
            Go back to shop
          </button>
        </div>
      </div>
    );
  }

  // Calculate Tax
  const tax = totalPrice * 0.05;
  const finalTotal = totalPrice + tax;

  return (
    <div className="min-h-screen bg-rabuste-bg">
      <Navbar />
      <div className="pt-28 pb-10 px-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-8 text-rabuste-text">Checkout (Takeaway)</h1>

        {/* Order Items */}
        <section className="bg-white/5 p-6 rounded-lg mb-6 border border-rabuste-text/10">
          <div className="flex items-center gap-2 mb-4 text-rabuste-gold">
            <Coffee size={20} /> <h2 className="font-bold uppercase tracking-wider">Your Items</h2>
          </div>
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b border-rabuste-text/5 pb-2 last:border-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="text-gray-300 font-medium">{item.name}</span>
                  <span className="text-xs text-gray-500">Takeaway Item</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="font-bold text-rabuste-text">₹{item.price}</span>
                  
                  <button 
                    onClick={() => removeFromCart(index)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-white/5 rounded-full transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pickup Time */}
        <section className="bg-white/5 p-6 rounded-lg mb-6 border border-rabuste-text/10">
          <div className="flex items-center gap-2 mb-4 text-rabuste-gold">
            <Clock size={20} /> <h2 className="font-bold uppercase tracking-wider">Pickup Time</h2>
          </div>
          <select 
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full bg-black/40 border border-rabuste-text/20 p-3 rounded-md focus:border-rabuste-orange outline-none text-rabuste-text"
          >
            <option value="ASAP">As soon as possible (15-20 mins)</option>
            <option value="30_MINS">In 30 minutes</option>
            <option value="1_HOUR">In 1 hour</option>
          </select>
        </section>

        {/* Bill */}
        <section className="bg-white/5 p-6 rounded-lg mb-6 border border-rabuste-text/10">
          <div className="flex items-center gap-2 mb-4 text-rabuste-gold">
            <Receipt size={20} /> <h2 className="font-bold uppercase tracking-wider">Bill Summary</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-rabuste-text/10 pt-2 mt-2 text-rabuste-text">
              <span>To Pay</span>
              <span className="text-rabuste-orange">₹{finalTotal.toFixed(0)}</span>
            </div>
          </div>
        </section>

        {/* Pay Button */}
        <button 
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-4 bg-rabuste-orange hover:bg-rabuste-gold disabled:bg-gray-600 text-white font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-3"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Processing...
            </>
          ) : (
            <>
              <CreditCard size={20} /> Pay Online & Place Order
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Checkout;