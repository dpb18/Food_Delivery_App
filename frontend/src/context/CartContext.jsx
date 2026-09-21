import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';

export const CartContext = createContext();

export const AVAILABLE_COUPONS = [
  {
    code: 'FEAST50',
    discountPercent: 50,
    maxDiscount: 150,
    minOrder: 200,
    description: '50% OFF up to ₹150 on your order'
  },
  {
    code: 'FREEDEL',
    freeDelivery: true,
    minOrder: 150,
    description: 'Zero Delivery Fee on orders above ₹150'
  },
  {
    code: 'GOURMET20',
    discountPercent: 20,
    maxDiscount: 200,
    minOrder: 350,
    description: 'Flat 20% OFF on fine dining & gourmet orders'
  }
];

export const CartProvider = ({ children }) => {
  const { customerSession, setAuthModal, showToast } = useApp();

  const [cart, setCart] = useState(() => {
    try {
      const savedUser = localStorage.getItem('feasthub_user');
      if (!savedUser) return [];
      const saved = localStorage.getItem('feasthub_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartRestaurant, setCartRestaurant] = useState(() => {
    try {
      const savedUser = localStorage.getItem('feasthub_user');
      if (!savedUser) return null;
      const saved = localStorage.getItem('feasthub_cart_restaurant');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // When not logged in as customer, ensure cart is empty
  useEffect(() => {
    if (!customerSession) {
      setCart([]);
      setCartRestaurant(null);
      setAppliedCoupon(null);
      try {
        localStorage.removeItem('feasthub_cart');
        localStorage.removeItem('feasthub_cart_restaurant');
      } catch {}
    }
  }, [customerSession]);

  // Persist cart only when logged in
  useEffect(() => {
    if (customerSession) {
      try {
        localStorage.setItem('feasthub_cart', JSON.stringify(cart));
        if (cartRestaurant) {
          localStorage.setItem('feasthub_cart_restaurant', JSON.stringify(cartRestaurant));
        } else {
          localStorage.removeItem('feasthub_cart_restaurant');
        }
      } catch {}
    }
  }, [cart, cartRestaurant, customerSession]);

  // Cart actions
  const addToCart = (item, restaurant) => {
    if (!customerSession) {
      if (showToast) showToast('⚠️ Please sign in to add items to your cart!', 'info');
      if (setAuthModal) setAuthModal({ isOpen: true, targetPortal: 'customer' });
      return;
    }

    if (cart.length > 0 && cartRestaurant && restaurant && cartRestaurant.id !== restaurant.id) {
      const confirmReset = window.confirm(
        `Your cart has items from "${cartRestaurant.name}". Clear cart to add from "${restaurant.name}"?`
      );
      if (!confirmReset) return;
      setCart([{ ...item, quantity: 1 }]);
      setCartRestaurant(restaurant);
      setAppliedCoupon(null);
      return;
    }

    if (restaurant) {
      setCartRestaurant(restaurant);
    }

    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, delta) => {
    if (!customerSession) return;
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const next = prevCart.filter((i) => i.id !== itemId);
      if (next.length === 0) {
        setCartRestaurant(null);
        setAppliedCoupon(null);
      }
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
    setCartRestaurant(null);
    setAppliedCoupon(null);
    setCouponError('');
  };

  // Subtotal calculation (0 if not logged in)
  const cartSubtotal = customerSession
    ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;
  const cartCount = customerSession
    ? cart.reduce((count, item) => count + item.quantity, 0)
    : 0;

  // Delivery Fee calculation
  let baseDeliveryFee = customerSession && cart.length > 0 ? (cartRestaurant?.deliveryFee || 35.0) : 0;
  if (appliedCoupon && appliedCoupon.freeDelivery) {
    baseDeliveryFee = 0;
  }

  // Discount calculation
  let discountAmount = 0;
  if (customerSession && appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      const calculated = (cartSubtotal * appliedCoupon.discountPercent) / 100;
      discountAmount = Math.min(calculated, appliedCoupon.maxDiscount || calculated);
    }
  }

  // Tax & Final Total
  const cartTax = customerSession && cart.length > 0 ? +(cartSubtotal * 0.05).toFixed(2) : 0;
  const cartDeliveryFee = baseDeliveryFee;
  const cartTotal = customerSession && cart.length > 0
    ? +Math.max(0, cartSubtotal - discountAmount + cartDeliveryFee + cartTax).toFixed(2)
    : 0;

  // Apply Coupon Code
  const applyCoupon = (couponCode) => {
    if (!customerSession) {
      return { success: false, message: 'Please sign in first' };
    }
    const code = couponCode.trim().toUpperCase();
    const foundCoupon = AVAILABLE_COUPONS.find((c) => c.code === code);

    if (!foundCoupon) {
      setCouponError('Invalid coupon code');
      return { success: false, message: 'Invalid coupon code' };
    }

    if (cartSubtotal < foundCoupon.minOrder) {
      const err = `Minimum order of ₹${foundCoupon.minOrder} required for ${foundCoupon.code}`;
      setCouponError(err);
      return { success: false, message: err };
    }

    setAppliedCoupon(foundCoupon);
    setCouponError('');
    return { success: true, coupon: foundCoupon };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  return (
    <CartContext.Provider
      value={{
        cart: customerSession ? cart : [],
        cartRestaurant: customerSession ? cartRestaurant : null,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCount,
        cartDeliveryFee,
        discountAmount,
        cartTax,
        cartTotal,
        appliedCoupon: customerSession ? appliedCoupon : null,
        couponError,
        applyCoupon,
        removeCoupon,
        availableCoupons: AVAILABLE_COUPONS
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
