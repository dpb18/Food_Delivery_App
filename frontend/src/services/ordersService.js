// Orders Service communicating with Spring Boot 3 Backend APIs
import { api, authStorage } from './api';

export const ordersApi = {
  // Fetch orders from backend based on role
  async fetchOrders() {
    try {
      const user = authStorage.getUser();
      if (!user) {
        // Fallback to localStorage if guest or offline
        const stored = localStorage.getItem('feasthub_orders');
        return stored ? JSON.parse(stored) : [];
      }

      if (user.role === 'ROLE_ADMIN') {
        const adminOrders = await api.admin.getAllOrders();
        return adminOrders.length > 0 ? adminOrders : [];
      } else if (user.role === 'ROLE_DELIVERY_PARTNER') {
        const [available, assigned] = await Promise.all([
          api.delivery.getAvailableOrders().catch(() => []),
          api.delivery.getMyAssignedOrders().catch(() => [])
        ]);
        const map = new Map();
        [...assigned, ...available].forEach((o) => map.set(o.id, o));
        return Array.from(map.values());
      } else {
        const myOrders = await api.orders.getMyOrders();
        return myOrders.length > 0 ? myOrders : [];
      }
    } catch (err) {
      console.warn('Backend fetch failed, using fallback/localStorage:', err);
      const stored = localStorage.getItem('feasthub_orders');
      return stored ? JSON.parse(stored) : null;
    }
  },

  // Save new order into backend MySQL via Spring Boot API
  async createOrder(newOrder) {
    try {
      // Map to backend CreateOrderRequest
      const payload = {
        restaurantId: newOrder.restaurantId || 1,
        addressId: newOrder.addressId || 1,
        paymentMethod: newOrder.paymentMethod || 'UPI',
        couponCode: newOrder.couponApplied || newOrder.couponCode || '',
        items: (newOrder.items || []).map((i) => ({
          menuItemId: i.menuItemId || i.id || 1,
          quantity: i.quantity || 1
        }))
      };

      const created = await api.orders.placeOrder(payload);
      return created;
    } catch (err) {
      console.error('Error saving order to backend, fallback to local:', err);
      return newOrder;
    }
  },

  // Update order status, delivery partner assignment, or delivery verification
  async updateOrder(orderId, patchData) {
    try {
      const user = authStorage.getUser();
      if (user?.role === 'ROLE_ADMIN' && patchData.status) {
        return await api.admin.updateOrderStatus(orderId, patchData.status);
      }
      if (user?.role === 'ROLE_DELIVERY_PARTNER') {
        if (patchData.status === 'OUT_FOR_DELIVERY') {
          return await api.delivery.acceptOrder(orderId);
        }
        if (patchData.status === 'DELIVERED' && patchData.enteredOtp) {
          return await api.delivery.verifyOtp(orderId, patchData.enteredOtp);
        }
      }
      return null;
    } catch (err) {
      console.error(`Error updating order #${orderId}:`, err);
      return null;
    }
  }
};
