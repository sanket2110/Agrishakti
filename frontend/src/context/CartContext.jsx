import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const exists = cartItems.find(item => item.id === product.id);
    if (exists) return false; // already in cart
    setCartItems(prev => [...prev, { ...product, qty: 10 }]); // default 10 kg
    return true;
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQty = (productId, qty) => {
    setCartItems(prev => prev.map(item => item.id === productId ? { ...item, qty } : item));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
