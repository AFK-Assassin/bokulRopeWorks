import { useState, useEffect, useRef, useCallback } from 'react';
import {
  IconRope,
  IconSearch,
  IconX
} from '../../components/Icons';
import {
  fetchAdminProducts,
  fetchCategories,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  uploadMediaApi,
} from '../../services/api';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' by default as requested

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // Direct PC Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const initialForm = {
    name: '',
    category: 'Jute Rope',
    shortDescription: '',
    description: '',
    material: '100% High-Grade Tossa / White Jute Fibre',
    ply: '3-Ply Hawser Laid',
    diameterRange: '6mm - 40mm',
    length: '100m / 220m Coils / Custom Lengths',
    breakingStrength: '1,900 - 2,400 kgf (IS 5175 compliant)',
    color: 'Natural Golden Brown',
    packaging: 'Heavy-Duty Gunny Bundles / Wrapped Coils',
    moq: '500 kg / Bulk Order',
    applications: 'Marine, Scaffolding, Industrial, Agriculture',
    imageUrl: '/images/bokul_rope_works_hero.webp',
    isFeatured: false,
    isPublished: true,
  };

  const [form, setForm] = useState(initialForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        fetchAdminProducts().catch(() => []),
        fetchCategories().catch(() => []),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.warn('Product load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm(initialForm);
    setImagePreview('/images/bokul_rope_works_hero.webp');
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setForm({
      name: prod.name || '',
      category: prod.category || 'Jute Rope',
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      material: prod.material || '100% High-Grade Tossa / White Jute Fibre',
      ply: prod.ply || '3-Ply Hawser Laid',
      diameterRange: prod.diameterRange || '6mm - 40mm',
      length: prod.length || '100m / 220m Coils',
      breakingStrength: prod.breakingStrength || '1,900 - 2,400 kgf',
      color: prod.color || 'Natural Golden Brown',
      packaging: prod.packaging || 'Heavy-Duty Gunny Bundles',
      moq: prod.moq || '500 kg',
      applications: Array.isArray(prod.applications) ? prod.applications.join(', ') : (prod.applications || ''),
      imageUrl: prod.imageUrl || '/images/bokul_rope_works_hero.webp',
      isFeatured: prod.isFeatured || false,
      isPublished: prod.isPublished !== undefined ? prod.isPublished : true,
    });
    setImagePreview(prod.imageUrl || '/images/bokul_rope_works_hero.webp');
    setModalOpen(true);
  };

  // Direct PC File Upload
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  const processAndUploadFile = async (file) => {
    // Instant local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result);
    };
    reader.readAsDataURL(file);

    // Direct Upload to Backend
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      formData.append('title', form.name || cleanTitle);
      formData.append('altText', form.name || cleanTitle);

      const res = await uploadMediaApi(formData);
      if (res && res.data && res.data.url) {
        setForm((prev) => ({ ...prev, imageUrl: res.data.url }));
        setImagePreview(res.data.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image from PC: ' + (err.message || 'Server error'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        applications: form.applications ? form.applications.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };

      if (editingProduct) {
        await updateProductApi(editingProduct._id, payload);
      } else {
        await createProductApi(payload);
      }

      setModalOpen(false);
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (prod) => {
    try {
      const newStatus = !prod.isPublished;
      await updateProductApi(prod._id, { isPublished: newStatus });
      setProducts((prev) =>
        prev.map((p) => (p._id === prod._id ? { ...p, isPublished: newStatus } : p))
      );
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleToggleFeatured = async (prod) => {
    try {
      const newStatus = !prod.isFeatured;
      await updateProductApi(prod._id, { isFeatured: newStatus });
      setProducts((prev) =>
        prev.map((p) => (p._id === prod._id ? { ...p, isFeatured: newStatus } : p))
      );
    } catch (err) {
      alert(err.message || 'Failed to update feature status');
    }
  };

  const handleDelete = async (prod) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${prod.name}" from the product catalogue?`)) {
      return;
    }
    try {
      await deleteProductApi(prod._id);
      setProducts((prev) => prev.filter((p) => p._id !== prod._id));
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchSearch =
      (prod.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.category || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory = categoryFilter === 'All' || prod.category === categoryFilter;
    const matchStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Published' && prod.isPublished !== false) ||
      (statusFilter === 'Draft' && prod.isPublished === false);

    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="admin-page-content">
      {/* Header & Controls Toolbar */}
      <div className="admin-toolbar-card">
        <div className="admin-toolbar-left">
          <div className="search-box">
            <IconSearch size={16} />
            <input
              type="text"
              placeholder="Search product name, material, specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="admin-select"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
              {categories.length === 0 && (
                <>
                  <option value="Jute Rope">Jute Rope</option>
                  <option value="Manila Rope">Manila Rope</option>
                  <option value="Sisal Rope">Sisal Rope</option>
                  <option value="Jute Twine">Jute Twine</option>
                  <option value="Industrial Cordage">Industrial Cordage</option>
                </>
              )}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-select"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published Online</option>
              <option value="Draft">Draft / Unpublished</option>
            </select>
          </div>
        </div>

        <div className="admin-toolbar-right">
          <div className="view-mode-toggle">
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              ⊞ Grid
            </button>
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              ☰ Table
            </button>
          </div>
          <button className="btn-primary btn-sm" onClick={handleOpenAdd}>
            + Add New Product
          </button>
        </div>
      </div>

      {/* Product List Table / Grid */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Manufacturing Catalog ({filteredProducts.length})</h3>
            <p>Direct mill specifications and published products</p>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading-state">Loading product catalogue...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="admin-empty-state">
            <IconRope size={36} />
            <h4>No products found matching filters</h4>
            <p>Try resetting the search terms or add a new product item.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="product-catalog-grid">
            {filteredProducts.map((prod) => (
              <div key={prod._id} className="product-catalog-card">
                <div className="product-card-thumb-wrap" onClick={() => handleOpenEdit(prod)}>
                  <img
                    src={prod.imageUrl || '/images/bokul_rope_works_hero.webp'}
                    alt={prod.name}
                    onError={(e) => {
                      e.target.src = '/images/bokul_rope_works_hero.webp';
                    }}
                  />
                  <div className="product-card-badges">
                    <span className="cat-badge">{prod.category}</span>
                    <button
                      type="button"
                      className={`star-toggle-btn ${prod.isFeatured ? 'starred' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFeatured(prod);
                      }}
                      title={prod.isFeatured ? 'Featured on Home' : 'Mark as Featured'}
                    >
                      {prod.isFeatured ? '★ Featured' : '☆ Standard'}
                    </button>
                  </div>
                </div>

                <div className="product-card-body">
                  <div className="product-card-header-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <h4 className="product-card-title">{prod.name}</h4>
                      <button
                        type="button"
                        className={`status-pill ${prod.isPublished !== false ? 'status-won' : 'status-lost'}`}
                        onClick={() => handleTogglePublish(prod)}
                        title="Click to toggle publish status"
                        style={{ flexShrink: 0 }}
                      >
                        {prod.isPublished !== false ? '● Published' : '○ Draft'}
                      </button>
                    </div>
                    <span className="product-card-sub">
                      {prod.material || '100% Natural Jute'} &bull; {prod.ply || '3-Strand'}
                    </span>
                  </div>

                  <div className="product-specs-chips">
                    <div className="spec-chip-item">
                      <span className="spec-chip-label">Diameter</span>
                      <span className="spec-chip-val">{prod.diameterRange || '6mm - 40mm'}</span>
                    </div>
                    <div className="spec-chip-item">
                      <span className="spec-chip-label">MOQ</span>
                      <span className="spec-chip-val">{prod.moq || '500 kg'}</span>
                    </div>
                  </div>

                  <div className="product-card-actions">
                    <button
                      type="button"
                      className="btn-outline btn-xs"
                      onClick={() => handleOpenEdit(prod)}
                      style={{ flex: 1 }}
                    >
                      Edit Product
                    </button>
                    <button
                      type="button"
                      className="btn-danger btn-xs"
                      onClick={() => handleDelete(prod)}
                      title="Delete product"
                    >
                      ✕ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Diameter / Plies</th>
                  <th>MOQ</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <div className="product-table-cell">
                        <img
                          src={prod.imageUrl || '/images/bokul_rope_works_hero.webp'}
                          alt={prod.name}
                          className="prod-thumb"
                          onError={(e) => {
                            e.target.src = '/images/bokul_rope_works_hero.webp';
                          }}
                        />
                        <div>
                          <strong>{prod.name}</strong>
                          <span className="cell-sub">{prod.material || '100% Natural Jute'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="cat-badge">{prod.category}</span>
                    </td>
                    <td>
                      <div>{prod.diameterRange || '6mm - 40mm'}</div>
                      <span className="cell-sub">{prod.ply || '3-Strand'}</span>
                    </td>
                    <td>{prod.moq || '500 kg'}</td>
                    <td>
                      <button
                        className={`star-toggle-btn ${prod.isFeatured ? 'starred' : ''}`}
                        onClick={() => handleToggleFeatured(prod)}
                        title={prod.isFeatured ? 'Featured on Home' : 'Mark as Featured'}
                      >
                        {prod.isFeatured ? '★ Featured' : '☆ Standard'}
                      </button>
                    </td>
                    <td>
                      <button
                        className={`status-pill ${prod.isPublished !== false ? 'status-won' : 'status-lost'}`}
                        onClick={() => handleTogglePublish(prod)}
                        title="Click to toggle publish status"
                      >
                        {prod.isPublished !== false ? '● Published' : '○ Draft'}
                      </button>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button
                          className="btn-outline btn-xs"
                          onClick={() => handleOpenEdit(prod)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-danger btn-xs"
                          onClick={() => handleDelete(prod)}
                        >
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

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-box large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingProduct ? 'Edit Product Item' : 'Add New Product to Mill Catalogue'}</h3>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}>
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="admin-form">
              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Product Name <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3-Strand Hawser Laid Jute Rope"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Category <span className="req">*</span></label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="Jute Rope">Jute Rope</option>
                    <option value="Manila Rope">Manila Rope</option>
                    <option value="Sisal Rope">Sisal Rope</option>
                    <option value="Jute Twine">Jute Twine</option>
                    <option value="Industrial Cordage">Industrial Cordage</option>
                    <option value="Traditional Baan">Traditional Baan</option>
                    <option value="Other Products">Other Products</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-3">
                <div className="admin-form-group">
                  <label>Diameter Range</label>
                  <input
                    type="text"
                    placeholder="e.g. 6mm - 40mm (1/4 to 1-1/2 in)"
                    value={form.diameterRange}
                    onChange={(e) => setForm({ ...form, diameterRange: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Plies / Construction</label>
                  <input
                    type="text"
                    placeholder="e.g. 3-Ply Hawser Laid"
                    value={form.ply}
                    onChange={(e) => setForm({ ...form, ply: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Breaking Strength (IS 5175)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1,900 - 2,400 kgf"
                    value={form.breakingStrength}
                    onChange={(e) => setForm({ ...form, breakingStrength: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="admin-form-group">
                  <label>Raw Material</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Pure Tossa Jute"
                    value={form.material}
                    onChange={(e) => setForm({ ...form, material: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Coil Length</label>
                  <input
                    type="text"
                    placeholder="e.g. 100m, 220m or Cut Lengths"
                    value={form.length}
                    onChange={(e) => setForm({ ...form, length: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>MOQ</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 kg / Bulk"
                    value={form.moq}
                    onChange={(e) => setForm({ ...form, moq: e.target.value })}
                  />
                </div>
              </div>

              {/* Direct Image Upload From PC Section */}
              <div className="admin-form-group">
                <label>Product Photograph / Image <span className="req">*</span></label>
                
                {/* Hidden Native File Input accepting all image types */}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.svg,.bmp,.tiff,.tif,.avif,.heic,.heif,.jfif"
                  onChange={handleFileSelect}
                />

                {/* Modern Drag & Drop / Direct PC Upload Box */}
                <div
                  className={`direct-upload-dropzone ${dragOver ? 'dragover' : ''} ${imagePreview ? 'has-image' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                >
                  {imagePreview ? (
                    <div className="upload-preview-container">
                      <div className="preview-image-box">
                        <img
                          src={imagePreview}
                          alt="Product Preview"
                          onError={(e) => {
                            e.target.src = '/images/bokul_rope_works_hero.webp';
                          }}
                        />
                      </div>
                      <div className="preview-info-box">
                        <div className="preview-status-pill">
                          {uploadingImage ? '⏳ Uploading from PC...' : '✓ Image Linked from PC'}
                        </div>
                        <span className="preview-path-text">
                          Path: <code>{form.imageUrl}</code>
                        </span>
                        <div className="preview-actions-row">
                          <button
                            type="button"
                            className="btn-outline btn-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            📁 Change Image (Upload New from PC)
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-prompt-box">
                      <div className="upload-icon-circle">📷</div>
                      <div className="upload-prompt-text">
                        <strong>Click to Browse Image from PC or Drag & Drop Here</strong>
                        <span>Accepts JPG, JPEG, PNG, WEBP, GIF, SVG, BMP & all photo formats</span>
                      </div>
                      <span className="upload-helper-badge">Direct PC Upload</span>
                    </div>
                  )}
                </div>

                {/* Optional direct URL edit field */}
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    placeholder="Or specify image URL / path (e.g. /images/...)"
                    value={form.imageUrl}
                    onChange={(e) => {
                      setForm({ ...form, imageUrl: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Applications (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Marine, Scaffolding, Industrial, Agriculture, Bundling"
                  value={form.applications}
                  onChange={(e) => setForm({ ...form, applications: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Full Technical Description <span className="req">*</span></label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detailed breakdown of the rope geometry, breaking strength, moisture absorption, and industrial use cases..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-checkbox-row">
                <label className="custom-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  />
                  <span>Publish this product immediately on the website</span>
                </label>

                <label className="custom-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  />
                  <span>Feature on homepage product showcase</span>
                </label>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving || uploadingImage}
                >
                  {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Save Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
