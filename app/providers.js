"use client";
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import FloatingOrderTracker from '../components/FloatingOrderTracker';
import CartDrawer from '../components/CartDrawer';
import ProfileDrawer from '../components/ProfileDrawer';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <CartDrawer />
        <ProfileDrawer />
        <FloatingOrderTracker />
      </CartProvider>
    </AuthProvider>
  );
}

