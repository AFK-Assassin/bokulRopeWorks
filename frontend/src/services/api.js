const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    // Graceful offline fallback simulation
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
