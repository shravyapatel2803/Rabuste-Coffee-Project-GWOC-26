import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/common/Navbar';
import { Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'; 

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
             <p className="text-rabuste-muted">Your Cart is Empty</p>
             <button onClick={() => navigate('/menu')} className="text-rabuste-orange">Browse Menu</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rabuste-bg pb-32">
      <Navbar />

      <div className="pt-24 px-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-rabuste-text">My Cart</h1>
          <span className="text-rabuste-muted text-sm">{cart.length} Items</span>
        </div>

        <div className="bg-rabuste-surface rounded-xl border border-rabuste-text/5 overflow-hidden mb-6">
          {cart.map((item) => (
            <div key={item._id} className="flex items-center gap-4 p-4 border-b border-rabuste-text/5 last:border-0">
              
              {/* Image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/20 flex-shrink-0">
                <img src={item.image?.url} alt={item.name} className="w-full h-full object-cover"/>
              </div>

              {/* Details */}
              <div className="flex-1">
                <h3 className="font-bold text-rabuste-text text-sm md:text-base">{item.name}</h3>
                <p className="text-xs text-rabuste-muted mt-1">₹{item.price} / unit</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center bg-rabuste-bg border border-rabuste-orange/30 rounded-lg overflow-hidden shadow-sm h-8">
                  
                  <button 
                    onClick={() => handleDecrease(item)}
                    className="w-8 h-full flex items-center justify-center text-rabuste-orange hover:bg-rabuste-orange/10 transition-colors"
                  >
                    <Minus size={14} strokeWidth={3} />
                  </button>
                  
                  {/* COUNT */}
                  <span className="w-8 text-center text-sm font-bold text-rabuste-text">
                    {item.qty}
                  </span>
                  
                  {/* PLUS BUTTON */}
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-8 h-full flex items-center justify-center text-rabuste-orange hover:bg-rabuste-orange/10 transition-colors"
                  >
                    <Plus size={14} strokeWidth={3} />
                  </button>

                </div>
                
                {/* Total Price for this item */}
                <span className="text-sm font-bold text-rabuste-text">
                  ₹{item.price * item.qty}
                </span>
              </div>

            </div>
          ))}
        </div>

        <div className="bg-rabuste-surface rounded-xl border border-rabuste-text/5 p-5 mb-6">
           <div className="flex justify-between text-lg font-bold text-rabuste-text">
              <span>Grand Total</span>
              <span>₹{finalTotal}</span>
            </div>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 w-full bg-rabuste-surface border-t border-rabuste-text/10 p-4 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-rabuste-muted uppercase font-bold">Total to Pay</span>
            <span className="text-xl font-serif font-bold text-rabuste-text">₹{finalTotal}</span>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="flex-1 bg-rabuste-orange hover:bg-orange-700 text-white py-3.5 px-6 rounded-lg font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Cart;