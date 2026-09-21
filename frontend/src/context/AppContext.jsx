import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CATEGORIES,
  RESTAURANTS,
  MENU_ITEMS,
  INITIAL_USERS,
  DELIVERY_PARTNER,
  INITIAL_ORDERS
} from '../data/mockData';
import { ordersApi } from '../services/ordersService';
import { api, authStorage } from '../services/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication & Users State
  const [users, setUsers] = useState(INITIAL_USERS);
  const [customerSession, setCustomerSession] = useState(() => {
    const token = authStorage.getToken();
    const savedUser = authStorage.getUser();
    if (token && savedUser && savedUser.role === 'ROLE_CUSTOMER') return savedUser;
    return null; // Guest by default -> Opens Landing Page first!
  });
  const [adminSession, setAdminSession] = useState(() => {
    const savedUser = authStorage.getUser();
    return savedUser && savedUser.role === 'ROLE_ADMIN' ? savedUser : null;
  });
  const [deliverySession, setDeliverySession] = useState(() => {
    const savedUser = authStorage.getUser();
    return savedUser && savedUser.role === 'ROLE_DELIVERY_PARTNER' ? savedUser : null;
  });

  // Auth Modal State
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    targetPortal: 'admin' // 'customer' | 'admin' | 'delivery'
  });

  // Active Portal Role: 'customer' | 'admin' | 'delivery'
  const [activePortal, setActivePortal] = useState('customer');

  // App Navigation States
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'restaurant' | 'checkout' | 'tracking'
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(1);

  // Selected Dish for Detailed AI-Nutrition Modal
  const [activeDishModal, setActiveDishModal] = useState(null);

  // Core Data Collections
  const [categories, setCategories] = useState(CATEGORIES);
  const [restaurants, setRestaurants] = useState(RESTAURANTS);
  const [menuItems, setMenuItems] = useState(MENU_ITEMS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [deliveryPartner, setDeliveryPartner] = useState(DELIVERY_PARTNER);

  // Fetch live restaurants, menu items & categories from backend on mount
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const [liveRestaurants, liveCategories] = await Promise.all([
          api.restaurants.getAll().catch(() => null),
          api.categories.getAll().catch(() => null)
        ]);
        if (isMounted) {
          if (liveRestaurants && liveRestaurants.length > 0) {
            const normalized = liveRestaurants.map((r) => ({
              ...r,
              image: r.imageUrl || r.image,
              lat: r.latitude || 12.9716,
              lng: r.longitude || 77.5946,
              category:
                r.category ||
                (r.name.toLowerCase().includes('burger')
                  ? 'Burgers'
                  : r.name.toLowerCase().includes('pizz')
                  ? 'Pizzas'
                  : r.name.toLowerCase().includes('biryani')
                  ? 'Biryani & Indian'
                  : 'Asian & Bowls'),
              tags: r.tags || ['Top Rated', 'Trending', 'Fast Delivery'],
              tagline: r.tagline || r.description,
              reviewsCount: r.reviewsCount || 240
            }));
            setRestaurants(normalized);

            // Fetch menu items from MySQL for all restaurants
            const menuPromises = liveRestaurants.map((r) =>
              api.restaurants.getMenu(r.id).catch(() => [])
            );
            const allMenus = await Promise.all(menuPromises);
            const flatMenu = allMenus.flat().map((item) => ({
              ...item,
              image: item.imageUrl || item.image,
              popular: true,
              nutrition: {
                calories: item.caloriesKcal || 450,
                protein: item.proteinG || 18,
                carbs: item.carbsG || 45,
                fat: item.fatG || 14,
                fiber: item.fiberG || 4,
                allergens: item.allergens || 'Gluten, Dairy'
              }
            }));
            if (flatMenu.length > 0) {
              setMenuItems(flatMenu);
            }
          }
          if (liveCategories && liveCategories.length > 0) {
            setCategories(liveCategories);
          }
        }
      } catch (e) {
        console.warn('Could not load live catalog from Spring Boot:', e);
      }
    };
    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync Orders with backend periodically
  const syncOrders = useCallback(async () => {
    try {
      const data = await ordersApi.fetchOrders();
      if (data && Array.isArray(data) && data.length > 0) {
        setOrders(data);
      }
    } catch (e) {
      console.warn('Order sync error:', e);
    }
  }, []);

  useEffect(() => {
    syncOrders();
    const interval = setInterval(syncOrders, 4000);
    return () => clearInterval(interval);
  }, [syncOrders]);

  // Cart State Management
  const [cart, setCart] = useState([]);
  const [cartRestaurant, setCartRestaurant] = useState(null);

  // Notification Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Switch Portal Guard with Password Verification
  const requestSwitchPortal = (targetPortal) => {
    if (targetPortal === 'customer') {
      if (!customerSession) {
        setAuthModal({ isOpen: true, targetPortal: 'customer' });
      } else {
        setActivePortal('customer');
        setCurrentView('home');
      }
      return;
    }

    if (targetPortal === 'admin') {
      if (!adminSession) {
        setAuthModal({ isOpen: true, targetPortal: 'admin' });
      } else {
        setActivePortal('admin');
      }
      return;
    }

    if (targetPortal === 'delivery') {
      if (!deliverySession) {
        setAuthModal({ isOpen: true, targetPortal: 'delivery' });
      } else {
        setActivePortal('delivery');
      }
      return;
    }
  };

  // Login Function with Spring Boot Backend Integration
  const login = async (email, password, portalRole) => {
    const roleKey =
      portalRole === 'admin'
        ? 'ROLE_ADMIN'
        : portalRole === 'delivery'
        ? 'ROLE_DELIVERY_PARTNER'
        : 'ROLE_CUSTOMER';

    try {
      // 1. Authenticate with Spring Boot Backend
      const authData = await api.auth.login(email.trim(), password);
      const user = authData.user;

      if (user.role !== roleKey) {
        showToast(`❌ Account is not registered for ${portalRole} portal!`, 'error');
        return { success: false, message: 'Invalid role for portal' };
      }

      if (portalRole === 'customer') setCustomerSession(user);
      if (portalRole === 'admin') setAdminSession(user);
      if (portalRole === 'delivery') {
        setDeliverySession(user);
        setDeliveryPartner((prev) => ({
          ...prev,
          id: user.id,
          fullName: user.fullName,
          phone: user.phone
        }));
      }

      setActivePortal(portalRole);
      setAuthModal({ isOpen: false, targetPortal: portalRole });
      showToast(`Welcome back, ${user.fullName}! (Connected to MySQL)`, 'success');
      syncOrders();
      return { success: true, user };
    } catch (err) {
      console.warn('Backend login attempt failed, checking local demo users:', err);

      // 2. Fallback to local mock users if backend is unreachable
      const matchedUser = users.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password &&
          u.role === roleKey
      );

      if (!matchedUser) {
        showToast(err.message || '❌ Invalid credentials for this portal!', 'error');
        return { success: false, message: err.message || 'Invalid email or password' };
      }

      if (portalRole === 'customer') setCustomerSession(matchedUser);
      if (portalRole === 'admin') setAdminSession(matchedUser);
      if (portalRole === 'delivery') {
        setDeliverySession(matchedUser);
        setDeliveryPartner((prev) => ({
          ...prev,
          fullName: matchedUser.fullName,
          phone: matchedUser.phone,
          vehicleNumber: matchedUser.vehicleNumber || 'KA 03 EZ 9821'
        }));
      }

      setActivePortal(portalRole);
      setAuthModal({ isOpen: false, targetPortal: portalRole });
      showToast(`Welcome back, ${matchedUser.fullName}!`, 'success');
      return { success: true, user: matchedUser };
    }
  };

  // Registration Function with Backend Integration
  const register = async (data, portalRole) => {
    const { fullName, email, phone, password, vehicleType, vehicleNumber } = data;

    const roleKey =
      portalRole === 'admin'
        ? 'ROLE_ADMIN'
        : portalRole === 'delivery'
        ? 'ROLE_DELIVERY_PARTNER'
        : 'ROLE_CUSTOMER';

    try {
      // 1. Try Backend Registration
      const authData = await api.auth.register({
        fullName,
        email: email.trim(),
        phone,
        password,
        role: roleKey
      });

      const user = authData.user;
      if (portalRole === 'customer') setCustomerSession(user);
      if (portalRole === 'admin') setAdminSession(user);
      if (portalRole === 'delivery') setDeliverySession(user);

      setActivePortal(portalRole);
      setAuthModal({ isOpen: false, targetPortal: portalRole });
      showToast(`🎉 Account created in MySQL! Welcome, ${user.fullName}!`, 'success');
      return { success: true, user };
    } catch (err) {
      console.warn('Backend registration failed, creating locally:', err);

      // 2. Fallback to local mock registration
      const newUser = {
        id: Date.now(),
        fullName,
        email: email.trim(),
        phone,
        password,
        role: roleKey,
        vehicleType: vehicleType || 'BIKE',
        vehicleNumber: vehicleNumber || 'KA 05 MN 1234',
        addresses: [
          {
            id: 1,
            label: 'Home',
            streetAddress: 'Flat 101, Lakeview Residency, Indiranagar',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560038',
            lat: 12.9784,
            lng: 77.6408,
            isDefault: true
          }
        ]
      };

      setUsers((prev) => [...prev, newUser]);
      if (portalRole === 'customer') setCustomerSession(newUser);
      if (portalRole === 'admin') setAdminSession(newUser);
      if (portalRole === 'delivery') setDeliverySession(newUser);

      setActivePortal(portalRole);
      setAuthModal({ isOpen: false, targetPortal: portalRole });
      showToast(`🎉 Account created! Welcome, ${newUser.fullName}!`, 'success');
      return { success: true, user: newUser };
    }
  };

  // Sign out
  const logout = (portalRole) => {
    api.auth.logout();
    if (portalRole === 'customer') {
      setCustomerSession(null);
      clearCart();
      try {
        localStorage.removeItem('feasthub_cart');
        localStorage.removeItem('feasthub_cart_restaurant');
      } catch {}
    }
    if (portalRole === 'admin') setAdminSession(null);
    if (portalRole === 'delivery') setDeliverySession(null);

    showToast('Signed out successfully', 'info');
    setActivePortal('customer');
    setCurrentView('home');
  };

  // Reset / Forgot Password
  const resetPassword = (email, newPassword) => {
    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (userIndex === -1) {
      showToast('❌ No registered account found with this email', 'error');
      return { success: false, message: 'Email address not found in system' };
    }

    if (!newPassword || newPassword.length < 6) {
      showToast('❌ Password must be at least 6 characters', 'error');
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    const updatedUser = { ...users[userIndex], password: newPassword };
    setUsers((prev) => prev.map((u, i) => (i === userIndex ? updatedUser : u)));

    if (updatedUser.role === 'ROLE_CUSTOMER') {
      setCustomerSession(updatedUser);
    }

    showToast(`🔒 Password updated! Welcome, ${updatedUser.fullName}!`, 'success');
    return { success: true, user: updatedUser };
  };

  // Update Profile
  const updateProfile = ({ fullName, phone, avatar, password, role = 'customer' }) => {
    if (role === 'customer' && customerSession) {
      const updated = {
        ...customerSession,
        ...(fullName && { fullName }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
        ...(password && { password })
      };
      setCustomerSession(updated);
      setUsers((prev) => prev.map((u) => (u.id === customerSession.id ? updated : u)));
      return updated;
    }
    if (role === 'admin' && adminSession) {
      const updated = {
        ...adminSession,
        ...(fullName && { fullName }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
        ...(password && { password })
      };
      setAdminSession(updated);
      setUsers((prev) => prev.map((u) => (u.id === adminSession.id ? updated : u)));
      return updated;
    }
    if (role === 'delivery' && deliverySession) {
      const updated = {
        ...deliverySession,
        ...(fullName && { fullName }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
        ...(password && { password })
      };
      setDeliverySession(updated);
      setDeliveryPartner((prev) => ({
        ...prev,
        fullName: updated.fullName,
        phone: updated.phone
      }));
      setUsers((prev) => prev.map((u) => (u.id === deliverySession.id ? updated : u)));
      return updated;
    }
  };

  // Cart Functions
  const addToCart = (item, restaurant) => {
    if (cart.length > 0 && cartRestaurant && cartRestaurant.id !== restaurant.id) {
      const confirmReset = window.confirm(
        `Your cart contains items from "${cartRestaurant.name}". Reset cart to add items from "${restaurant.name}"?`
      );
      if (!confirmReset) return;
      setCart([{ ...item, quantity: 1 }]);
      setCartRestaurant(restaurant);
      showToast(`Started new cart from ${restaurant.name}`, 'success');
      return;
    }

    setCartRestaurant(restaurant);
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    showToast(`Added "${item.name}" to cart!`, 'success');
  };

  const updateQuantity = (itemId, delta) => {
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

  const clearCart = () => {
    setCart([]);
    setCartRestaurant(null);
  };

  // Cart Totals
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((count, i) => count + i.quantity, 0);
  const cartDeliveryFee = cart.length > 0 ? (cartRestaurant?.deliveryFee || 35.0) : 0;
  const cartTax = cart.length > 0 ? +(cartSubtotal * 0.05).toFixed(2) : 0;
  const cartTotal = +(cartSubtotal + cartDeliveryFee + cartTax).toFixed(2);

  // Order Placement
  const placeOrder = async (paymentMethod = 'UPI') => {
    if (cart.length === 0 || !cartRestaurant) return null;

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrderId = Math.floor(80000 + Math.random() * 19999);

    const orderPayload = {
      id: newOrderId,
      customerId: customerSession?.id || 1,
      customerName: customerSession?.fullName || 'Guest Customer',
      customerPhone: customerSession?.phone || '+91 98765 43210',
      restaurantId: cartRestaurant.id,
      restaurantName: cartRestaurant.name,
      restaurantAddress: cartRestaurant.address,
      restaurantLat: cartRestaurant.lat || cartRestaurant.latitude || 12.9719,
      restaurantLng: cartRestaurant.lng || cartRestaurant.longitude || 77.6412,
      deliveryAddress: customerSession?.addresses?.[0] || {
        streetAddress: 'Apartment 402, Indiranagar',
        city: 'Bengaluru',
        lat: 12.9784,
        lng: 77.6408
      },
      items: cart.map((i) => ({
        id: i.id,
        menuItemId: i.id,
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.price,
        subtotal: i.price * i.quantity,
        isVeg: i.isVeg
      })),
      subtotal: cartSubtotal,
      deliveryFee: cartDeliveryFee,
      taxAmount: cartTax,
      totalAmount: cartTotal,
      status: 'PLACED',
      deliveryOtp: generatedOtp,
      otpVerified: false,
      deliveryPartnerId: null,
      deliveryPartnerName: null,
      paymentMethod,
      paymentStatus: 'PAID',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '25-30 mins'
    };

    const saved = await saveOrder(orderPayload);
    clearCart();
    setSelectedOrderId(saved?.id || newOrderId);
    setCurrentView('tracking');
    showToast(`Order #${saved?.id || newOrderId} placed successfully!`, 'success');
    return saved;
  };

  const saveOrder = async (newOrder) => {
    try {
      const created = await ordersApi.createOrder(newOrder);
      const merged = { ...newOrder, ...(created || {}) };
      setOrders((prev) => [merged, ...prev]);
      return merged;
    } catch (e) {
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    try {
      await api.admin.updateOrderStatus(orderId, newStatus);
    } catch (e) {
      console.warn('Admin status update failed on backend, local state updated:', e);
    }
    showToast(`Order #${orderId} status updated to ${newStatus}`, 'info');
  };

  const assignDeliveryPartner = async (orderId, partner) => {
    const patch = {
      deliveryPartnerId: partner.id,
      deliveryPartnerName: partner.fullName,
      deliveryPartnerPhone: partner.phone,
      deliveryPartnerVehicle: `${partner.vehicleType} (${partner.vehicleNumber})`,
      status: 'READY_FOR_PICKUP'
    };
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, ...patch } : order))
    );
    await ordersApi.updateOrder(orderId, patch);
    showToast(`Assigned ${partner.fullName} to Order #${orderId}!`, 'success');
  };

  const acceptDeliveryOrder = async (orderId) => {
    const patch = {
      status: 'OUT_FOR_DELIVERY',
      deliveryPartnerId: deliveryPartner.id,
      deliveryPartnerName: deliveryPartner.fullName,
      deliveryPartnerPhone: deliveryPartner.phone,
      deliveryPartnerVehicle: `${deliveryPartner.vehicleType} (${deliveryPartner.vehicleNumber})`
    };
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, ...patch } : order))
    );
    try {
      await api.delivery.acceptOrder(orderId);
    } catch (e) {
      console.warn('Backend accept order failed, local state updated:', e);
    }
    showToast(`Order #${orderId} accepted! Navigation route loaded.`, 'success');
  };

  const verifyOrderOtpAndDeliver = async (orderId, enteredOtp) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) {
      return { success: false, message: 'Order not found' };
    }

    try {
      // 1. Try backend OTP verification
      await api.delivery.verifyOtp(orderId, enteredOtp);
      const patch = { status: 'DELIVERED', otpVerified: true };
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, ...patch } : order))
      );
      setDeliveryPartner((prev) => ({
        ...prev,
        totalEarnings: prev.totalEarnings + (targetOrder.deliveryFee || 30.0) + 15.0,
        completedDeliveries: prev.completedDeliveries + 1
      }));
      showToast(`🎉 OTP Verified! Order #${orderId} delivered. Earnings credited!`, 'success');
      return { success: true };
    } catch (backendError) {
      // If backend reports invalid OTP
      if (backendError.message?.toLowerCase().includes('otp')) {
        showToast('❌ ' + backendError.message, 'error');
        return { success: false, message: backendError.message };
      }

      // Local fallback check
      if (targetOrder.deliveryOtp?.trim() !== enteredOtp.trim()) {
        showToast('❌ Incorrect OTP! Please ask customer for the 4-digit code.', 'error');
        return { success: false, message: 'Invalid OTP code' };
      }

      const patch = { status: 'DELIVERED', otpVerified: true };
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, ...patch } : order))
      );
      setDeliveryPartner((prev) => ({
        ...prev,
        totalEarnings: prev.totalEarnings + (targetOrder.deliveryFee || 30.0) + 15.0,
        completedDeliveries: prev.completedDeliveries + 1
      }));
      showToast(`🎉 OTP Verified! Order #${orderId} delivered. Earnings credited!`, 'success');
      return { success: true };
    }
  };

  const toggleDeliveryStatus = () => {
    setDeliveryPartner((prev) => {
      const nextStatus = prev.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
      api.delivery.updateStatus(nextStatus).catch(() => {});
      showToast(`Rider status is now ${nextStatus}`, 'info');
      return { ...prev, status: nextStatus };
    });
  };

  const toggleItemAvailability = (itemId) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
    showToast('Menu item availability updated', 'info');
  };

  // AI-Powered Nutritional Calculation for New Items (Admin feature)
  const generateAiNutrition = (dishName, description, isVeg) => {
    const nameLower = (dishName + ' ' + description).toLowerCase();
    let calories = 480;
    let protein = 18;
    let carbs = 45;
    let fat = 16;
    let fiber = 4;
    let allergens = 'Gluten';

    if (nameLower.includes('burger') || nameLower.includes('sandwich')) {
      calories = isVeg ? 560 : 680;
      protein = isVeg ? 22 : 36;
      carbs = 54;
      fat = 28;
      allergens = 'Gluten, Dairy';
    } else if (nameLower.includes('pizza')) {
      calories = 690;
      protein = 28;
      carbs = 72;
      fat = 32;
      allergens = 'Gluten, Dairy';
    } else if (nameLower.includes('biryani') || nameLower.includes('rice')) {
      calories = isVeg ? 620 : 760;
      protein = isVeg ? 24 : 42;
      carbs = 82;
      fat = 24;
      allergens = 'Dairy';
    } else if (nameLower.includes('boba') || nameLower.includes('shake') || nameLower.includes('brew')) {
      calories = 340;
      protein = 8;
      carbs = 62;
      fat = 8;
      allergens = 'Dairy';
    } else if (nameLower.includes('cake') || nameLower.includes('dessert') || nameLower.includes('tart')) {
      calories = 490;
      protein = 8;
      carbs = 56;
      fat = 27;
      allergens = 'Gluten, Dairy, Eggs';
    }

    return {
      calories,
      protein,
      carbs,
      fat,
      fiber,
      allergens,
      aiSummary: `AI Verified Profile: ${isVeg ? 'Vegetarian' : 'High-protein'} recipe prepared with balanced dietary lipids and vital micronutrients.`
    };
  };

  // Admin Add Dish with AI Nutrition
  const addDishWithAiNutrition = (dishData) => {
    const aiNutrition = generateAiNutrition(
      dishData.name,
      dishData.description,
      dishData.isVeg
    );

    const newDish = {
      id: Date.now(),
      restaurantId: Number(dishData.restaurantId),
      categoryId: Number(dishData.categoryId),
      name: dishData.name,
      description: dishData.description,
      price: Number(dishData.price),
      image:
        dishData.image ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      isVeg: dishData.isVeg,
      isAvailable: true,
      popular: false,
      nutrition: aiNutrition
    };

    setMenuItems((prev) => [newDish, ...prev]);
    showToast(`✨ Added "${newDish.name}" with AI Generated Nutritional Profile!`, 'success');
    return newDish;
  };

  return (
    <AppContext.Provider
      value={{
        // Auth & Sessions
        users,
        customerSession,
        adminSession,
        deliverySession,
        authModal,
        setAuthModal,
        requestSwitchPortal,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,

        // Role & Views
        activePortal,
        setActivePortal,
        currentView,
        setCurrentView,
        selectedRestaurantId,
        setSelectedRestaurantId,
        selectedOrderId,
        setSelectedOrderId,
        activeDishModal,
        setActiveDishModal,

        // Data Collections
        categories,
        restaurants,
        setRestaurants,
        menuItems,
        setMenuItems,
        orders,
        setOrders,
        deliveryPartner,
        currentUser: customerSession,

        // Cart Actions
        cart,
        cartRestaurant,
        addToCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDeliveryFee,
        cartTax,
        cartTotal,

        // Order Actions
        placeOrder,
        saveOrder,
        updateOrderStatus,
        assignDeliveryPartner,
        acceptDeliveryOrder,
        verifyOrderOtpAndDeliver,
        toggleDeliveryStatus,
        toggleItemAvailability,
        addDishWithAiNutrition,

        // Toast Feedback
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
