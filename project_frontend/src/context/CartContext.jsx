import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add to cart
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  // Remove from cart
  const removeFromCart = (indexToRemove) => {
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Clear cart
  const clearCart = () => setCart([]);

  // FIXED: Total price logic
  // We accept item.price directly. We wrap it in Number() just in case it's a string like "250".
  const totalPrice = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    return sum + price;
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);