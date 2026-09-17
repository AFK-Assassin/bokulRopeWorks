import React, { useState, useEffect } from 'react';
import {
  IconShieldCheck,
  IconFactory,
  IconPhone,
  IconMail,
  IconMapPin,
  IconSearch,
  IconX,
  IconCheckCircle,
  IconArrowRight,
  IconRope
} from './Icons';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminPanel({ onCloseAdmin }) {
  const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries' | 'products'
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Twisted Ropes',
    description: '',
    diameterRange: '6mm - 40mm',
    ply: '3-Ply',
    moq: '500 kg',
    imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
    applications: 'Marine, Scaffolding, Industrial',
    isFeatured: false
  });

  const [savingProduct, setSavingProduct] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [inqRes, prodRes] = await Promise.all([
        fetch(`${API_BASE_URL}/inquiries`).then(r => r.json()),
        fetch(`${API_BASE_URL}/products`).then(r => r.json())
      ]);

      if (inqRes.success && inqRes.data) {
        setInquiries(inqRes.data);
      }
      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data);
      }
    } catch (err) {
      console.warn('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (inquiryId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/inquiries/${inquiryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((item) => (item._id === inquiryId ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      alert('Could not update status');
    }
  };

  const handleDeleteInquiry = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this buyer inquiry?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/inquiries/${inquiryId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.filter((i) => i._id !== inquiryId));
        if (selectedInquiry?._id === inquiryId) setSelectedInquiry(null);
      }
    } catch (err) {
      alert('Could not delete inquiry');
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Twisted Ropes',
      description: '',
      diameterRange: '6mm - 40mm',
      ply: '3-Ply',
      moq: '500 kg',
      imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
      applications: 'Marine, Scaffolding, Industrial',
      isFeatured: false
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || '',
      category: prod.category || 'Twisted Ropes',
      description: prod.description || '',
      diameterRange: prod.diameterRange || '',
      ply: prod.ply || '3-Ply',
      moq: prod.moq || '500 kg',
      imageUrl: prod.imageUrl || '',
      applications: Array.isArray(prod.applications) ? prod.applications.join(', ') : (prod.applications || ''),
      isFeatured: prod.isFeatured || false
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const url = editingProduct
        ? `${API_BASE_URL}/products/${editingProduct._id}`
        : `${API_BASE_URL}/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      const payload = {
        ...productForm,
        applications: productForm.applications.split(',').map((s) => s.trim()).filter(Boolean)
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setProductModalOpen(false);
        fetchAdminData();
      } else {
        alert(data.message || 'Error saving product');
      }
    } catch (err) {
      alert('Network error saving product');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Delete this product from your catalogue?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/products/${prodId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== prodId));
      }
    } catch (err) {
      alert('Could not delete product');
    }
  };

  const exportInquiriesCSV = () => {
    if (inquiries.length === 0) return alert('No inquiries to export.');
    const headers = ['Date', 'Full Name', 'Company', 'Email', 'Phone', 'Product', 'Quantity', 'Location', 'Message', 'Status', 'Rate Range'];
    const rows = inquiries.map((i) => [
      new Date(i.createdAt).toLocaleDateString(),
      `"${i.fullName}"`,
      `"${i.companyName || ''}"`,
      i.email,
      i.phone,
      `"${i.productInterest}"`,
      `"${i.requiredQuantity || ''}"`,
      `"${i.deliveryLocation || ''}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`,
      i.status,
      `"${i.estimate?.priceRangePerKg || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BokulRopeWorks_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter((item) => {
    const matchStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchSearch =
      (item.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.phone || '').includes(searchQuery) ||
      (item.productInterest || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchSearch;
  });

  const newCount = inquiries.filter((i) => i.status === 'New').length;
  const contactedCount = inquiries.filter((i) => i.status === 'Contacted' || i.status === 'Quoted').length;

  return (
    <div className="admin-root">
      {/* Top Header */}
      <header className="admin-header">
        <div className="container admin-nav-container">
          <div className="brand-logo">
            <div className="brand-badge">BRW</div>
            <div className="brand-text" style={{ color: '#ffffff' }}>
              Owner Control Desk
              <span>Bokul Rope Works • Howrah Plant</span>
            </div>
          </div>

          <div className="admin-tabs">
            <button
              className={`admin-tab ${activeTab === 'inquiries' ? 'active' : ''}`}
              onClick={() => setActiveTab('inquiries')}
            >
              Buyer Inquiries ({inquiries.length})
            </button>
            <button
              className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Product Catalog ({products.length})
            </button>
          </div>

          <button className="btn-outline btn-sm admin-exit-btn" onClick={onCloseAdmin}>
            Exit Admin Panel ✕
          </button>
        </div>
      </header>

      <main className="container admin-main">
        {/* Metric Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="a-stat-val text-amber">{inquiries.length}</div>
            <div className="a-stat-label">Total Buyer Inquiries</div>
          </div>
          <div className="admin-stat-card">
            <div className="a-stat-val text-green">{newCount}</div>
            <div className="a-stat-label">New Actionable Leads</div>
          </div>
          <div className="admin-stat-card">
            <div className="a-stat-val">{products.length}</div>
            <div className="a-stat-label">Active Catalog Products</div>
          </div>
          <div className="admin-stat-card">
            <div className="a-stat-val text-amber">{contactedCount}</div>
            <div className="a-stat-label">Quoted / In Process</div>
          </div>
        </div>

        {/* TAB 1: BUYER INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="admin-content-box">
            <div className="admin-toolbar">
              <div className="status-filter-pills">
                {['All', 'New', 'Contacted', 'Quoted', 'Closed'].map((st) => (
                  <button
                    key={st}
                    className={`pill ${statusFilter === st ? 'active' : ''}`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="admin-toolbar-right">
                <div className="search-box admin-search">
                  <IconSearch size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search name, phone, email, or product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button className="btn-outline btn-sm" onClick={exportInquiriesCSV}>
                  📥 Export CSV
                </button>
              </div>
            </div>

            {loading ? (
              <div className="admin-loading">Loading inquiries...</div>
            ) : filteredInquiries.length === 0 ? (
              <div className="no-products-found">
                <IconRope size={40} />
                <h3>No buyer inquiries found</h3>
                <p>New quote submissions from the frontend will automatically populate here.</p>
              </div>
            ) : (
              <div className="inquiries-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Buyer / Company</th>
                      <th>Contact Info</th>
                      <th>Product Interest</th>
                      <th>Volume</th>
                      <th>Indicative Rate</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.map((inq) => (
                      <tr key={inq._id}>
                        <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
                        <td>
                          <strong>{inq.fullName}</strong>
                          {inq.companyName && <span className="table-sub">{inq.companyName}</span>}
                        </td>
                        <td>
                          <div>📞 {inq.phone}</div>
                          <div className="table-sub">✉️ {inq.email}</div>
                        </td>
                        <td>
                          <strong>{inq.productInterest}</strong>
                          {inq.deliveryLocation && <span className="table-sub">📍 {inq.deliveryLocation}</span>}
                        </td>
                        <td>{inq.requiredQuantity || 'MOQ Standard'}</td>
                        <td>
                          <span className="rate-badge">
                            {inq.estimate?.priceRangePerKg || '₹110 - ₹135/kg'}
                          </span>
                        </td>
                        <td>
                          <select
                            className={`status-select status-${(inq.status || 'New').toLowerCase()}`}
                            value={inq.status || 'New'}
                            onChange={(e) => handleUpdateStatus(inq._id, e.target.value)}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Quoted">Quoted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="btn-sm btn-outline" onClick={() => setSelectedInquiry(inq)}>
                              Details
                            </button>
                            <button className="btn-sm btn-danger" onClick={() => handleDeleteInquiry(inq._id)}>
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="admin-content-box">
            <div className="admin-toolbar">
              <h3>Product Catalogue Manager</h3>
              <button className="btn-primary btn-sm" onClick={handleOpenAddProduct}>
                + Add New Product
              </button>
            </div>

            <div className="admin-products-grid">
              {products.map((prod) => (
                <div key={prod._id} className="admin-prod-card">
                  <div className="prod-img-wrap">
                    <img src={prod.imageUrl || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80'} alt={prod.name} />
                    <span className="prod-cat-badge">{prod.category}</span>
                  </div>

                  <div className="prod-card-body">
                    <h4>{prod.name}</h4>
                    <p className="prod-desc-line">{prod.description}</p>
                    
                    <div className="prod-meta-rows">
                      <div><span>Diameter:</span> {prod.diameterRange}</div>
                      <div><span>Construction:</span> {prod.ply}</div>
                      <div><span>MOQ:</span> {prod.moq}</div>
                    </div>

                    <div className="prod-card-actions">
                      <button className="btn-outline btn-sm" onClick={() => handleOpenEditProduct(prod)}>
                        Edit Product
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => handleDeleteProduct(prod._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Inquiry Detail Drawer / Modal */}
      {selectedInquiry && (
        <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedInquiry(null)}>
              <IconX size={20} />
            </button>
            <h3>Lead Inquiry Details</h3>
            <div className="lead-detail-box">
              <div className="lead-row"><strong>Buyer Name:</strong> {selectedInquiry.fullName}</div>
              <div className="lead-row"><strong>Company:</strong> {selectedInquiry.companyName || 'N/A'}</div>
              <div className="lead-row"><strong>Phone:</strong> {selectedInquiry.phone}</div>
              <div className="lead-row"><strong>Email:</strong> {selectedInquiry.email}</div>
              <div className="lead-row"><strong>Product Requested:</strong> {selectedInquiry.productInterest}</div>
              <div className="lead-row"><strong>Volume:</strong> {selectedInquiry.requiredQuantity || 'Standard Batch'}</div>
              <div className="lead-row"><strong>Destination:</strong> {selectedInquiry.deliveryLocation || 'Not specified'}</div>
              <div className="lead-row"><strong>Buyer Requirement Message:</strong></div>
              <div className="msg-quote">{selectedInquiry.message}</div>

              {selectedInquiry.estimate && (
                <div className="ai-estimate-box" style={{ marginTop: '16px' }}>
                  <h4>Generated Estimate Breakdown</h4>
                  <div>Indicative Rate: <strong>{selectedInquiry.estimate.priceRangePerKg}</strong></div>
                  <div>Estimated Total: <strong>{selectedInquiry.estimate.estimatedTotalRange}</strong></div>
                  <div>Lead Time: <strong>{selectedInquiry.estimate.leadTime}</strong></div>
                </div>
              )}
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => setSelectedInquiry(null)}>
              Close Lead Details
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {productModalOpen && (
        <div className="modal-overlay" onClick={() => setProductModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setProductModalOpen(false)}>
              <IconX size={20} />
            </button>
            <h3>{editingProduct ? 'Edit Product Item' : 'Add New Product to Catalogue'}</h3>

            <form onSubmit={handleSaveProduct} className="quote-form" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Product Title <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3-Strand Hawser Laid Jute Rope"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="Twisted Ropes">Twisted Ropes</option>
                    <option value="Industrial Cordage">Industrial Cordage</option>
                    <option value="Packaging Twines">Packaging Twines</option>
                    <option value="Custom Orders">Custom Orders</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Diameter Range</label>
                  <input
                    type="text"
                    placeholder="e.g. 6mm - 40mm"
                    value={productForm.diameterRange}
                    onChange={(e) => setProductForm({ ...productForm, diameterRange: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Plies / Construction</label>
                  <input
                    type="text"
                    placeholder="e.g. 3-Ply Hawser Laid"
                    value={productForm.ply}
                    onChange={(e) => setProductForm({ ...productForm, ply: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>MOQ</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 kg"
                    value={productForm.moq}
                    onChange={(e) => setProductForm({ ...productForm, moq: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Image URL (e.g. Unsplash or direct image URL)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                />
                {productForm.imageUrl && (
                  <div style={{ marginTop: '8px' }}>
                    <img src={productForm.imageUrl} alt="Preview" style={{ height: '70px', borderRadius: '6px', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Applications (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="Marine, Scaffolding, Agricultural Tying"
                  value={productForm.applications}
                  onChange={(e) => setProductForm({ ...productForm, applications: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description <span className="req">*</span></label>
                <textarea
                  rows="3"
                  required
                  placeholder="Enter detailed description of the rope geometry, breaking strength, and industrial applications..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={savingProduct}
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                {savingProduct ? 'Saving Product...' : (editingProduct ? 'Update Product' : 'Add Product to Catalog')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
