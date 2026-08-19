import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { getCart as fetchCart } from '../api/cart.api.js';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, idToken } = useAuth();

  useEffect(() => {
    if (user && idToken) {
      loadCart();
    }
  }, [user, idToken]);

  const loadCart = async () => {
    if (!idToken) return;
    try {
      setLoading(true);
      const cartData = await fetchCart(idToken);
      setCart(cartData);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCart = (newCartData) => {
    setCart(newCartData);
  };

  return (
    <CartContext.Provider value={{ cart, loading, updateCart, loadCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return React.useContext(CartContext);
}
