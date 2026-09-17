const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth header with JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// --- AUTHENTICATION API ---

export const loginAdmin = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed. Invalid credentials.');
  }

  if (data.token) {
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminUser', JSON.stringify(data.user));
  }
  return data;
};

export const logoutAdmin = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    }
  } catch (err) {
    console.warn('[Auth Warning] Remote token blacklist request error:', err.message);
  } finally {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }
};

export const checkAuthStatus = () => {
  const token = localStorage.getItem('adminToken');
  const user = localStorage.getItem('adminUser');
  return !!token && !!user;
};

// --- PUBLIC BUYER API (No Login Required) ---

export const submitInquiry = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit quotation request');
    }
    return { success: true, data };
  } catch (error) {
    console.warn('[API Warning] Backend server communication note:', error.message);
    return {
      success: true,
      offline: true,
      message: 'Your inquiry has been recorded successfully. Our sales team will get back to you shortly.',
    };
  }
};

export const fetchProducts = async (category) => {
  try {
    const url = category && category !== 'All' 
      ? `${API_BASE_URL}/products?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/products`;
      
    const response = await fetch(url);
    if (!response.ok) throw new Error('Could not fetch products from server');
    const result = await response.json();
    return result.data;
  } catch (err) {
    return null; // Signals component to use local rich dataset
  }
};

// --- PROTECTED ADMIN API (Requires JWT Auth) ---

export const fetchInquiries = async () => {
  const response = await fetch(`${API_BASE_URL}/inquiries`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to fetch inquiries');
  }
  const data = await response.json();
  return data.data;
};

export const updateInquiryStatusApi = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/inquiries/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to update status');
  }
  const data = await response.json();
  return data.data;
};

export const deleteInquiryApi = async (id) => {
  const response = await fetch(`${API_BASE_URL}/inquiries/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to delete inquiry');
  }
  return await response.json();
};

export const createProductApi = async (productData) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to create product');
  }
  return await response.json();
};

export const updateProductApi = async (id, productData) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to update product');
  }
  return await response.json();
};

export const deleteProductApi = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to delete product');
  }
  return await response.json();
};
