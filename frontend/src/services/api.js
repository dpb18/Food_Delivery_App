// Frontend API Service Layer connecting to Spring Boot 3 Backend
const API_BASE_URL = '/api';

export const authStorage = {
  getToken: () => localStorage.getItem('feasthub_token'),
  setToken: (token) => localStorage.setItem('feasthub_token', token),
  getUser: () => {
    const raw = localStorage.getItem('feasthub_user');
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user) => localStorage.setItem('feasthub_user', JSON.stringify(user)),
  clearAuth: () => {
    localStorage.removeItem('feasthub_token');
    localStorage.removeItem('feasthub_user');
  }
};

async function apiRequest(endpoint, options = {}) {
  const token = authStorage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = json?.message || (json?.data && typeof json.data === 'object' ? Object.values(json.data).join(', ') : null) || `HTTP error ${response.status}`;
    throw new Error(errorMsg);
  }

  return json;
}

export const api = {
  // Auth endpoints
  auth: {
    login: async (email, password) => {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.data?.token) {
        authStorage.setToken(res.data.token);
        authStorage.setUser(res.data.user);
      }
      return res.data;
    },
    register: async (registerData) => {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(registerData)
      });
      if (res.data?.token) {
        authStorage.setToken(res.data.token);
        authStorage.setUser(res.data.user);
      }
      return res.data;
    },
    logout: () => {
      authStorage.clearAuth();
    }
  },

  // User & Address endpoints
  user: {
    getProfile: async () => {
      const res = await apiRequest('/users/profile');
      return res.data;
    },
    getAddresses: async () => {
      const res = await apiRequest('/users/addresses');
      return res.data;
    },
    addAddress: async (addressData) => {
      const res = await apiRequest('/users/addresses', {
        method: 'POST',
        body: JSON.stringify(addressData)
      });
      return res.data;
    }
  },

  // Restaurant & Catalog endpoints
  restaurants: {
    getAll: async () => {
      const res = await apiRequest('/restaurants');
      return res.data || [];
    },
    getById: async (id) => {
      const res = await apiRequest(`/restaurants/${id}`);
      return res.data;
    },
    getMenu: async (id) => {
      const res = await apiRequest(`/restaurants/${id}/menu`);
      return res.data || [];
    }
  },

  categories: {
    getAll: async () => {
      const res = await apiRequest('/categories');
      return res.data || [];
    }
  },

  // Customer Orders
  orders: {
    placeOrder: async (orderPayload) => {
      const res = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      });
      return res.data;
    },
    getMyOrders: async () => {
      const res = await apiRequest('/orders/my-orders');
      return res.data || [];
    },
    getById: async (id) => {
      const res = await apiRequest(`/orders/${id}`);
      return res.data;
    },
    validateCoupon: async (code, subtotal) => {
      const res = await apiRequest(`/orders/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`);
      return res.data;
    }
  },

  // Admin / Kitchen Management
  admin: {
    getAllOrders: async () => {
      const res = await apiRequest('/admin/orders');
      return res.data || [];
    },
    updateOrderStatus: async (orderId, status) => {
      const res = await apiRequest(`/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      return res.data;
    },
    getMetrics: async () => {
      const res = await apiRequest('/admin/metrics');
      return res.data;
    }
  },

  // Delivery Partner
  delivery: {
    getAvailableOrders: async () => {
      const res = await apiRequest('/delivery/available-orders');
      return res.data || [];
    },
    getMyAssignedOrders: async () => {
      const res = await apiRequest('/delivery/my-orders');
      return res.data || [];
    },
    acceptOrder: async (orderId) => {
      const res = await apiRequest(`/delivery/orders/${orderId}/accept`, {
        method: 'POST'
      });
      return res.data;
    },
    verifyOtp: async (orderId, enteredOtp) => {
      const res = await apiRequest(`/delivery/orders/${orderId}/verify-otp`, {
        method: 'POST',
        body: JSON.stringify({ enteredOtp })
      });
      return res.data;
    },
    updateLocation: async (latitude, longitude) => {
      const res = await apiRequest('/delivery/rider/location', {
        method: 'PATCH',
        body: JSON.stringify({ latitude, longitude })
      });
      return res.data;
    },
    updateStatus: async (status) => {
      const res = await apiRequest('/delivery/rider/status', {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      return res.data;
    },
    getProfile: async () => {
      const res = await apiRequest('/delivery/rider/profile');
      return res.data;
    }
  }
};
