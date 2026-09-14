"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import AuthModal from '../components/AuthModal';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Clear cart if user logs out or is unauthenticated
  useEffect(() => {
    if (!user) {
      setCartItems([]);
    }
  }, [user]);

  const getItemKey = (item) => {
    if (!item) return '';
    return item.id || item.name || '';
  };
  
  const addToCart = (item) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return false;
    }
    if (!item) return false;
    const key = getItemKey(item);
    setCartItems(prev => {
      const existing = prev.find(i => 
        (key && getItemKey(i) === key) || 
        (item.id && i.id === item.id) || 
        (item.name && i.name === item.name)
      );
      if (existing) {
        const existKey = getItemKey(existing);
        return prev.map(i => getItemKey(i) === existKey ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    return true;
  };

  const updateQuantity = (identifier, delta) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const targetKey = (typeof identifier === 'object' && identifier !== null)
      ? (identifier.id || identifier.name)
      : identifier;

    if (!targetKey) return;

    setCartItems(prev => {
      const item = prev.find(i => 
        getItemKey(i) === targetKey || 
        i.id === targetKey || 
        i.name === targetKey
      );
      if (!item) return prev;
      const key = getItemKey(item);
      const newQty = item.qty + delta;
      if (newQty <= 0) {
        return prev.filter(i => getItemKey(i) !== key && i.id !== key && i.name !== key);
      }
      return prev.map(i => getItemKey(i) === key ? { ...i, qty: newQty } : i);
    });
  };
  
  const removeFromCart = (identifier) => {
    const targetKey = (typeof identifier === 'object' && identifier !== null)
      ? (identifier.id || identifier.name)
      : identifier;
    if (!targetKey) return;
    setCartItems(prev => prev.filter(item => 
      getItemKey(item) !== targetKey && 
      item.name !== targetKey && 
      item.id !== targetKey
    ));
  };
  
  const clearCart = () => setCartItems([]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  
  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, 
      isCartOpen, setIsCartOpen, toggleCart, 
      isProfileOpen, setIsProfileOpen, toggleProfile,
      isAuthModalOpen, setIsAuthModalOpen,
      cartTotal 
    }}>
      {children}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
