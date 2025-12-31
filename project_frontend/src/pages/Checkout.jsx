import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { 
  CreditCard, Clock, Receipt, Coffee, Loader2, 
  User, Phone, Calendar, AlertCircle, ArrowLeft, MessageSquare 
} from 'lucide-react';
import { useCart } from "../context/CartContext";
import { createPreOrder, createRazorpayOrder } from "../api/order.api"; 
import { loadRazorpayScript } from "../utils/razorpay"; 
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart(); 
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [timeSlots, setTimeSlots] = useState([]); 
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    pickupDate: new Date().toISOString().split("T")[0], 
    pickupTime: "", 
    paymentMethod: "online", 
    specialRequest: "" 
  });

  // Calculate Tax & Total
  const tax = totalPrice * 0.05;
  const finalTotal = Math.round(totalPrice + tax); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const generateSlots = () => {
      const slots = [];
      const startHour = 11; // 11:00 AM
      const endHour = 19;   // 07:00 PM
      
      const now = new Date();
      const isToday = formData.pickupDate === now.toISOString().split("T")[0];

      for (let hour = startHour; hour <= endHour; hour++) {
        for (let min = 0; min < 60; min += 30) {
          // Time formatting logic
          const timeString = new Date(0, 0, 0, hour, min).toLocaleTimeString([], { 
            hour: '2-digit', minute: '2-digit' 
          });

          if (isToday) {
            const slotTime = new Date();
            slotTime.setHours(hour, min, 0);
            
            if (slotTime > new Date(now.getTime() + 30 * 60000)) {
              slots.push(timeString);
            }
          } else {
            slots.push(timeString);
          }
        }
      }
      setTimeSlots(slots);
    };

    generateSlots();
  }, [formData.pickupDate]);

  const handleRazorpayPayment = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      setError("Razorpay SDK failed to load. Check your internet.");
      return;
    }

    try {
      const { data: orderData } = await createRazorpayOrder(finalTotal);

      const options = {
        key: "rzp_test_Ry7wIoBJUhrL2e", // razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Rabuste Coffee",
        description: "Takeaway Order Payment",
        order_id: orderData.id, 
        
        handler: async function (response) {
          await placeOrder({
            paymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            paymentStatus: "paid"
          });
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#D4A373", 
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response){
        setError("Payment Failed: " + response.error.description);
        setIsProcessing(false);
      });

    } catch (err) {
      console.error(err);
      setError("Failed to initiate payment. Server might be down.");
      setIsProcessing(false);
    }
  };

  const placeOrder = async (paymentDetails = {}) => {
    try {
      const formattedItems = cart.map(item => ({
        itemId: item._id,
        nameSnapshot: item.name,
        priceSnapshot: item.price,
        quantity: item.qty || 1
      }));

      const payload = {
        ...formData,
        items: formattedItems,
        totalAmount: finalTotal,
        ...paymentDetails 
      };

      const res = await createPreOrder(payload);
      
      if (res.status === 201 || res.status === 200) {
        clearCart();
        localStorage.setItem("lastOrderId", res.data._id); 
        navigate("/track-order", { state: { orderId: res.data._id } });
      }

    } catch (err) {
      console.error(err);
      setError("Failed to place order. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    
    if (!formData.name || !formData.phone || !formData.pickupTime || !formData.email) {
      setError("Please fill all required fields (*).");
      return;
    }

    setIsProcessing(true);

    if (formData.paymentMethod === "online") {
      await handleRazorpayPayment();
    } else {
      await placeOrder({ paymentStatus: "pending" });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-rabuste-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Coffee size={48} className="text-rabuste-muted mb-4 opacity-50" />
          <h2 className="text-2xl font-serif mb-4 text-rabuste-text">Your cart is empty</h2>
          <button onClick={() => navigate("/menu")} className="text-rabuste-orange underline font-bold uppercase tracking-widest text-sm">
            Go back to shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rabuste-bg pb-20">
      <Navbar />
      
      <div className="pt-28 px-6 max-w-3xl mx-auto">
        
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-rabuste-muted hover:text-rabuste-orange mb-6 transition-colors text-sm font-bold uppercase tracking-wide"
        >
          <ArrowLeft size={16} /> Back to Menu
        </button>

        <h1 className="text-3xl font-serif font-bold mb-8 text-rabuste-text">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            
            {/* Personal Details */}
            <section className="bg-white/5 p-6 rounded-lg border border-rabuste-text/10">
              <div className="flex items-center gap-2 mb-4 text-rabuste-gold">
                <User size={20} /> <h2 className="font-bold uppercase tracking-wider text-sm">Details</h2>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" name="name" placeholder="Your Name *"
                  value={formData.name} onChange={handleChange}
                  className="w-full bg-black/40 border border-rabuste-text/20 p-3 rounded-md focus:border-rabuste-orange outline-none text-rabuste-text text-sm placeholder:text-gray-600"
                />
                <input 
                  type="tel" name="phone" placeholder="Phone Number *"
                  value={formData.phone} onChange={handleChange}
                  className="w-full bg-black/40 border border-rabuste-text/20 p-3 rounded-md focus:border-rabuste-orange outline-none text-rabuste-text text-sm placeholder:text-gray-600"
                />
                
                {/*  MANDATORY EMAIL */}
                <input 
                  type="email" name="email" placeholder="Email *"
                  value={formData.email} onChange={handleChange}
                  className="w-full bg-black/40 border border-rabuste-text/20 p-3 rounded-md focus:border-rabuste-orange outline-none text-rabuste-text text-sm placeholder:text-gray-600"
                />
              </div>
            </section>

            {/* Pickup Time */}
            <section className="bg-white/5 p-6 rounded-lg border border-rabuste-text/10">
              <div className="flex items-center gap-2 mb-4 text-rabuste-gold">
                <Clock size={20} /> <h2 className="font-bold uppercase tracking-wider text-sm">Pickup</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input 
                    type="date" name="pickupDate"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.pickupDate} onChange={handleChange}
                    className="w-full bg-black/40 border border-rabuste-text/20 p-3 rounded-md focus:border-rabuste-orange outline-none text-rabuste-text text-sm"
                  />
                  <Calendar size={16} className="absolute right-3 top-3 text-gray-500 pointer-events-none"/>
                </div>
                
                {/* DYNAMIC TIME SLOTS */}
                <select 
                  name="pickupTime"
                  value={formData.pickupTime} onChange={handleChange}
                  className="w-full bg-black/40 border border-rabuste-text/20 p-3 rounded-md focus:border-rabuste-orange outline-none text-rabuste-text text-sm"
                >
                  <option value="">Select Time</option>
                  {timeSlots.length > 0 ? (
                    timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))
                  ) : (
                    <option disabled>No slots available today</option>
                  )}
                </select>
              </div>
            </section>

            {/* SPECIAL SUGGESTION  */}
            <section className="bg-white/5 p-6 rounded-lg border border-rabuste-text/10">
              <div className="flex items-center gap-2 mb-4 text-rabuste-gold">
                <MessageSquare size={20} /> <h2 className="font-bold uppercase tracking-wider text-sm">Suggestion</h2>
              </div>
              <textarea 
                name="specialRequest"
                placeholder="Any special requests or suggestions? (Optional)"
                rows="2"
                value={formData.specialRequest} onChange={handleChange}
                className="w-full bg-black/40 border border-rabuste-text/20 p-3 rounded-md focus:border-rabuste-orange outline-none text-rabuste-text text-sm placeholder:text-gray-600 resize-none"
              ></textarea>
            </section>

            {/* Payment Method */}
            <section className="bg-white/5 p-6 rounded-lg border border-rabuste-text/10">
              <div className="flex items-center gap-2 mb-4 text-rabuste-gold">
                <CreditCard size={20} /> <h2 className="font-bold uppercase tracking-wider text-sm">Payment</h2>
              </div>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${formData.paymentMethod === 'online' ? 'border-rabuste-orange bg-rabuste-orange/10' : 'border-rabuste-text/20'}`}>
                  <input type="radio" name="paymentMethod" value="online" checked={formData.paymentMethod === 'online'} onChange={handleChange} className="accent-rabuste-orange w-4 h-4" />
                  <span className="text-rabuste-text text-sm font-bold">Pay Online (Razorpay)</span>
                </label>
                <label className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${formData.paymentMethod === 'offline' ? 'border-rabuste-orange bg-rabuste-orange/10' : 'border-rabuste-text/20'}`}>
                  <input type="radio" name="paymentMethod" value="offline" checked={formData.paymentMethod === 'offline'} onChange={handleChange} className="accent-rabuste-orange w-4 h-4" />
                  <span className="text-rabuste-text text-sm font-bold">Pay at Counter</span>
                </label>
              </div>
            </section>

          </div>

          {/* SUMMARY*/}
          <div className="space-y-6">
            
            {/* Order Items */}
            <section className="bg-white/5 p-6 rounded-lg border border-rabuste-text/10">
              <div className="flex items-center gap-2 mb-4 text-rabuste-gold">
                <Coffee size={20} /> <h2 className="font-bold uppercase tracking-wider text-sm">Your Items</h2>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-start border-b border-rabuste-text/5 pb-3 last:border-0">
                    <div>
                      <span className="text-gray-300 font-medium text-sm block">{item.name}</span>
                      <span className="text-xs text-gray-500">Qty: {item.qty || 1}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-rabuste-text text-sm">₹{item.price * (item.qty || 1)}</span>
                    
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Bill Summary & Pay Button */}
            <section className="bg-white/5 p-6 rounded-lg border border-rabuste-text/10 sticky top-28">
              <div className="flex items-center gap-2 mb-4 text-rabuste-gold">
                <Receipt size={20} /> <h2 className="font-bold uppercase tracking-wider text-sm">Total</h2>
              </div>
              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-serif font-bold border-t border-rabuste-text/10 pt-3 mt-2 text-rabuste-text">
                  <span>To Pay</span>
                  <span className="text-rabuste-orange">₹{finalTotal.toFixed(0)}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md text-xs mb-4 flex items-center gap-2 animate-pulse">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button 
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full py-4 bg-rabuste-orange hover:bg-rabuste-gold disabled:bg-gray-600 text-white font-black uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-3 text-sm"
              >
                {isProcessing ? (
                  <><Loader2 className="animate-spin" size={18} /> Processing...</>
                ) : (
                  formData.paymentMethod === 'online' ? 
                  "Pay Now" : "Place Order"
                )}
              </button>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;