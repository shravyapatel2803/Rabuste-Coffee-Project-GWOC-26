import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/common/Navbar';
import { Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react'; 

const Cart = () => {
  const navigate = useNavigate();
  const { cart, addToCart, decreaseQty, removeFromCart, totalPrice } = useCart();

  const tax = 20; 
  const handlingFee = 10;
  const finalTotal = totalPrice + tax + handlingFee;

  const handleDecrease = (item) => {
    if (item.qty > 1) {
      decreaseQty(item._id);
    } else {
      removeFromCart(item._id); 
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-rabuste-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
             <p className="text-rabuste-muted mb-4 text-sm">Your Cart is Empty</p>
             <button 
               onClick={() => navigate('/shop')} 
               className="bg-rabuste-orange text-white font-bold uppercase tracking-wider px-6 py-2 rounded-sm text-xs"
             >
               Browse Shop
             </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rabuste-bg pb-12">
      <Navbar />

      <div className="pt-24 px-3 max-w-2xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1 text-rabuste-muted hover:text-rabuste-orange text-[10px] font-bold uppercase tracking-wider mb-4"
          >
            <ArrowLeft size={12} /> Back
          </button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-serif font-bold text-rabuste-text">My Cart</h1>
            <span className="bg-rabuste-orange/10 text-rabuste-orange px-2 py-0.5 rounded text-[10px] font-bold">
              {cart.length} Items
            </span>
          </div>
        </div>

        {/* CART ITEMS LIST */}
        <div className="flex flex-col gap-3 mb-6">
          {cart.map((item) => (
            <div 
              key={item._id} 
              className="flex items-start gap-3 p-3 bg-white dark:bg-white/5 border border-rabuste-text/10 rounded-lg shadow-sm"
            >
              
              {/* FIXED: Smaller Image (w-12) */}
              <div className="w-12 h-12 rounded bg-gray-100 flex-shrink-0 border border-rabuste-text/5 overflow-hidden">
                <img src={item.image?.url} alt={item.name} className="w-full h-full object-cover"/>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                {/* FIXED: Allow text wrap, small font */}
                <h3 className="font-bold text-rabuste-text text-xs leading-tight">{item.name}</h3>
                <p className="text-[10px] text-rabuste-muted mt-1 font-medium">₹{item.price}</p>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-end gap-1">
                {/* FIXED: Compact Height (h-6) */}
                <div className="flex items-center bg-rabuste-bg border border-rabuste-text/20 rounded overflow-hidden h-6">
                  <button 
                    onClick={() => handleDecrease(item)}
                    className="w-6 h-full flex items-center justify-center text-rabuste-text hover:bg-rabuste-text/5"
                  >
                    <Minus size={10} strokeWidth={3} />
                  </button>
                  
                  <span className="w-6 text-center text-[10px] font-bold text-rabuste-text bg-rabuste-surface flex items-center justify-center h-full border-x border-rabuste-text/10">
                    {item.qty}
                  </span>
                  
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-6 h-full flex items-center justify-center text-rabuste-text hover:bg-rabuste-text/5"
                  >
                    <Plus size={10} strokeWidth={3} />
                  </button>
                </div>
                
                <span className="text-xs font-bold text-rabuste-orange">
                  ₹{item.price * item.qty}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="bg-white dark:bg-white/5 rounded-lg border border-rabuste-text/10 p-4 mb-6 shadow-sm">
           <div className="space-y-2 mb-3">
             <div className="flex justify-between text-xs text-rabuste-text/70">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
             </div>
             <div className="flex justify-between text-xs text-rabuste-text/70">
                <span>Taxes & Fees</span>
                <span>₹{tax + handlingFee}</span>
             </div>
           </div>
           
           <div className="flex justify-between items-end border-t border-rabuste-text/10 pt-3">
              <span className="text-sm font-bold text-rabuste-text">Total</span>
              <span className="text-lg font-serif font-bold text-rabuste-gold">₹{finalTotal}</span>
            </div>
        </div>

        {/* CHECKOUT BUTTON */}
        <button 
          onClick={() => navigate('/checkout')}
          className="w-full bg-rabuste-orange text-white py-3 rounded font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg"
        >
          Proceed to Checkout <ArrowRight size={14} />
        </button>

      </div>
    </div>
  );
};

export default Cart;