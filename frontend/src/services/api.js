const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper to get auth header
const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Generic Fetch Wrapper
const request = async (url, options = {}) => {
  const headers = getHeaders();
  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE}${url}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Auto logout if token expired
      if (response.status === 401 && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
      }
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`API Request Error [${url}]:`, error);
    throw error;
  }
};

export const api = {
  // Authentication
  auth: {
    login: async (credentials) => {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (res.success && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
      }
      return res;
    },
    register: async (userData) => {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (res.success && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
      }
      return res;
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    getCurrentUser: () => {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    },
  },

  // Product CRUD Operations
  products: {
    getAll: () => request('/products'),
    getOne: (id) => request(`/products/${id}`),
    create: (productData) => request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),
    update: (id, productData) => request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),
    delete: (id) => request(`/products/${id}`, {
      method: 'DELETE',
    }),
    getLowStockAlerts: () => request('/products/alerts/low-stock'),
  },

  // AI Content Generator Engine
  ai: {
    generateContent: (productData) => request('/ai/generate', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),
  },

  // Sales Analytics & Suggestions
  sales: {
    getAnalytics: () => request('/sales/analytics'),
    getSuggestions: () => request('/sales/suggestions'),
  },
};
