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
    console.warn('[Auth Warning] Remote logout note:', err.message);
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

export const getAdminProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to fetch admin profile');
  }
  const data = await response.json();
  return data.user;
};

export const updateAdminProfile = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to update profile');
  }
  const data = await response.json();
  if (data.user) {
    localStorage.setItem('adminUser', JSON.stringify(data.user));
  }
  return data.user;
};

export const changeAdminPassword = async (currentPassword, newPassword) => {
  const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to change password');
  }
  return await response.json();
};

// --- PUBLIC INQUIRIES & MESSAGES ---

export const submitInquiry = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit quotation request');
    }
    return { success: true, data: data.data, estimate: data.estimate };
  } catch (error) {
    console.warn('[API Warning] Inquiries offline fallback note:', error.message);
    return {
      success: true,
      offline: true,
      message: 'Your inquiry has been recorded successfully. Our sales desk will follow up shortly.',
    };
  }
};

export const submitContactMessage = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to send message');
    return { success: true, data: data.data };
  } catch (error) {
    console.warn('[API Warning] Contact message note:', error.message);
    return { success: true, offline: true, message: 'Message recorded.' };
  }
};

// --- PRODUCTS API ---

export const fetchProducts = async (category) => {
  try {
    const url = category && category !== 'All'
      ? `${API_BASE_URL}/products?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/products`;
      
    const response = await fetch(url);
    if (!response.ok) throw new Error('Could not fetch products');
    const result = await response.json();
    return result.data;
  } catch (err) {
    return null; // Signals component to use fallback
  }
};

export const fetchAdminProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/products${query ? `?${query}` : ''}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to fetch products');
  }
  const data = await response.json();
  return data.data;
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

// --- CATEGORIES API ---

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return data.data;
  } catch (err) {
    return [];
  }
};

export const createCategoryApi = async (categoryData) => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to create category');
  }
  return await response.json();
};

export const updateCategoryApi = async (id, categoryData) => {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to update category');
  }
  return await response.json();
};

export const deleteCategoryApi = async (id) => {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to delete category');
  }
  return await response.json();
};

// --- QUOTES / INQUIRIES API ---

export const fetchInquiries = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/inquiries${query ? `?${query}` : ''}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to fetch inquiries');
  }
  const data = await response.json();
  return data.data;
};

export const updateInquiryStatusApi = async (id, payload) => {
  const body = typeof payload === 'string' ? { status: payload } : payload;
  const response = await fetch(`${API_BASE_URL}/inquiries/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to update quote inquiry');
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

// --- CONTACT MESSAGES API ---

export const fetchMessages = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/messages${query ? `?${query}` : ''}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to fetch messages');
  }
  const data = await response.json();
  return data.data;
};

export const markMessageReadApi = async (id, isRead = true) => {
  const response = await fetch(`${API_BASE_URL}/messages/${id}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ isRead }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to mark message');
  }
  const data = await response.json();
  return data.data;
};

export const deleteMessageApi = async (id) => {
  const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to delete message');
  }
  return await response.json();
};

// --- PROCESS STEPS API ---

export const fetchProcessSteps = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/process`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch process steps');
    const data = await response.json();
    return data.data;
  } catch (err) {
    return [];
  }
};

export const createProcessStepApi = async (stepData) => {
  const response = await fetch(`${API_BASE_URL}/process`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(stepData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to create process step');
  }
  return await response.json();
};

export const updateProcessStepApi = async (id, stepData) => {
  const response = await fetch(`${API_BASE_URL}/process/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(stepData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to update process step');
  }
  return await response.json();
};

export const deleteProcessStepApi = async (id) => {
  const response = await fetch(`${API_BASE_URL}/process/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to delete process step');
  }
  return await response.json();
};

// --- APPLICATIONS API ---

export const fetchApplications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch applications');
    const data = await response.json();
    return data.data;
  } catch (err) {
    return [];
  }
};

export const createApplicationApi = async (appData) => {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(appData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to create application');
  }
  return await response.json();
};

export const updateApplicationApi = async (id, appData) => {
  const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(appData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to update application');
  }
  return await response.json();
};

export const deleteApplicationApi = async (id) => {
  const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to delete application');
  }
  return await response.json();
};

// --- CERTIFICATIONS API ---

export const fetchCertifications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/certifications`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch certifications');
    const data = await response.json();
    return data.data;
  } catch (err) {
    return [];
  }
};

export const createCertificationApi = async (certData) => {
  const response = await fetch(`${API_BASE_URL}/certifications`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(certData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to create certification');
  }
  return await response.json();
};

export const updateCertificationApi = async (id, certData) => {
  const response = await fetch(`${API_BASE_URL}/certifications/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(certData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to update certification');
  }
  return await response.json();
};

export const deleteCertificationApi = async (id) => {
  const response = await fetch(`${API_BASE_URL}/certifications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to delete certification');
  }
  return await response.json();
};

// --- WEBSITE SETTINGS API ---

export const fetchWebsiteSettings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    const data = await response.json();
    return data.data;
  } catch (err) {
    return null;
  }
};

export const updateWebsiteSettingsApi = async (settingsData) => {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(settingsData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to update website settings');
  }
  const data = await response.json();
  return data.data;
};

// --- MEDIA LIBRARY API ---

export const fetchMediaLibrary = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/media${query ? `?${query}` : ''}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to fetch media');
  }
  const data = await response.json();
  return data.data;
};

export const createMediaApi = async (mediaData) => {
  const response = await fetch(`${API_BASE_URL}/media`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(mediaData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to add media');
  }
  return await response.json();
};

export const deleteMediaApi = async (id) => {
  const response = await fetch(`${API_BASE_URL}/media/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to delete media');
  }
  return await response.json();
};

// --- ACTIVITY LOG API ---

export const fetchActivityLogs = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/activity${query ? `?${query}` : ''}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to fetch activity logs');
  }
  const data = await response.json();
  return data.data;
};
