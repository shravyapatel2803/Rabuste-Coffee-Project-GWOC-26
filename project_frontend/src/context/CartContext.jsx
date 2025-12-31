import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("rabuste_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("rabuste_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i._id === item._id);

      if (existingItem) {
        return prevCart.map((i) =>
          i._id === item._id ? { ...i, qty: (i.qty || 1) + 1 } : i
        );
      } else {
        return [...prevCart, { ...item, qty: 1 }];
      }
    });
  };

  const decreaseQty = (itemId) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item._id === itemId) {
          return { ...item, qty: item.qty > 1 ? item.qty - 1 : 1 }; 
        }
        return item;
      });
    });
  };

  // Remove Item Completely
  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
  };

  const clearCart = () => setCart([]);

  // Total Price Calculation
  const totalPrice = cart.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, decreaseQty, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};