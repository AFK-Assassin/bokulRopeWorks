import React, { useState, useEffect } from 'react';
import { IconRope, IconSearch, IconX, IconCheckCircle } from '../../components/Icons';
import {
  fetchCategories,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi
} from '../../services/api';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', order: 0, isPublished: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Category load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setForm({ name: '', description: '', order: categories.length + 1, isPublished: true });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name || '',
      description: cat.description || '',
      order: cat.order || 0,
      isPublished: cat.isPublished !== undefined ? cat.isPublished : true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCategory) {
        await updateCategoryApi(editingCategory._id, form);
      } else {
        await createCategoryApi(form);
      }
      setModalOpen(false);
      await loadCategories();
    } catch (err) {
      alert(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    try {
      await deleteCategoryApi(cat._id);
      setCategories((prev) => prev.filter((c) => c._id !== cat._id));
    } catch (err) {
      alert(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="admin-page-content">
      <div className="admin-toolbar-card">
        <div className="admin-toolbar-left">
          <h3>Product Category Classification ({categories.length})</h3>
        </div>
        <div className="admin-toolbar-right">
          <button className="btn-primary btn-sm" onClick={handleOpenAdd}>
            + Add New Category
          </button>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-state">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="admin-empty-state">
            <IconRope size={36} />
            <h4>No custom categories yet</h4>
            <p>Click "Add New Category" to organize your rope & twine products.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td>{cat.order || 0}</td>
                    <td><strong>{cat.name}</strong></td>
                    <td><code>{cat.slug}</code></td>
                    <td>{cat.description || '—'}</td>
                    <td>
                      <span className={`status-pill ${cat.isPublished !== false ? 'status-won' : 'status-lost'}`}>
                        {cat.isPublished !== false ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button className="btn-outline btn-xs" onClick={() => handleOpenEdit(cat)}>Edit</button>
                        <button className="btn-danger btn-xs" onClick={() => handleDelete(cat)}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingCategory ? 'Edit Category' : 'Create Product Category'}</h3>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}><IconX size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="admin-form">
              <div className="admin-form-group">
                <label>Category Title <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jute Rope, Manila Cordage, Jute Twine"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </div>

              <div className="admin-form-group">
                <label>Short Description</label>
                <textarea
                  rows="2"
                  placeholder="Category explanation for buyers..."
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
                  <span>Active & Published</span>
                </label>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
