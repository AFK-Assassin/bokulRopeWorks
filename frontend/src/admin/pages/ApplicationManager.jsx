import React, { useState, useEffect } from 'react';
import { IconShieldCheck, IconX, IconCheckCircle } from '../../components/Icons';
import {
  fetchApplications,
  createApplicationApi,
  updateApplicationApi,
  deleteApplicationApi
} from '../../services/api';

export default function ApplicationManager() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    suitableProducts: '',
    benefits: '',
    imageUrl: '/images/bokul_rope_works_hero.webp',
    isPublished: true,
    order: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    setLoading(true);
    try {
      const data = await fetchApplications();
      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Apps load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingApp(null);
    setForm({
      title: '',
      description: '',
      suitableProducts: '3-Strand Jute Rope, Manila Rope, Baan Cordage',
      benefits: 'High Knot Friction, Bio-Degradable, UV Resistance',
      imageUrl: '/images/bokul_rope_works_hero.webp',
      isPublished: true,
      order: apps.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (app) => {
    setEditingApp(app);
    setForm({
      title: app.title || '',
      description: app.description || '',
      suitableProducts: Array.isArray(app.suitableProducts) ? app.suitableProducts.join(', ') : (app.suitableProducts || ''),
      benefits: Array.isArray(app.benefits) ? app.benefits.join(', ') : (app.benefits || ''),
      imageUrl: app.imageUrl || '/images/bokul_rope_works_hero.webp',
      isPublished: app.isPublished !== undefined ? app.isPublished : true,
      order: app.order || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        order: Number(form.order),
        suitableProducts: form.suitableProducts.split(',').map((s) => s.trim()).filter(Boolean),
        benefits: form.benefits.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingApp) {
        await updateApplicationApi(editingApp._id, payload);
      } else {
        await createApplicationApi(payload);
      }
      setModalOpen(false);
      await loadApps();
    } catch (err) {
      alert(err.message || 'Failed to save application');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (app) => {
    if (!window.confirm(`Delete application sector "${app.title}"?`)) return;
    try {
      await deleteApplicationApi(app._id);
      setApps((prev) => prev.filter((a) => a._id !== app._id));
    } catch (err) {
      alert(err.message || 'Failed to delete application');
    }
  };

  return (
    <div className="admin-page-content">
      <div className="admin-toolbar-card">
        <div className="admin-toolbar-left">
          <h3>Core Industrial & Commercial Applications ({apps.length})</h3>
        </div>
        <div className="admin-toolbar-right">
          <button className="btn-primary btn-sm" onClick={handleOpenAdd}>
            + Add Sector Application
          </button>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-state">Loading application sectors...</div>
        ) : apps.length === 0 ? (
          <div className="admin-empty-state">
            <h4>No custom applications defined</h4>
            <p>Click "Add Sector Application" to create industrial sectors.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sector Title</th>
                  <th>Suitable Products</th>
                  <th>Core Benefits</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr key={app._id}>
                    <td><strong>{app.title}</strong></td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {(app.suitableProducts || []).map((p, idx) => (
                          <span key={idx} className="spec-tag">{p}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="cell-sub">{(app.benefits || []).join(' • ')}</span>
                    </td>
                    <td>
                      <span className={`status-pill ${app.isPublished !== false ? 'status-won' : 'status-lost'}`}>
                        {app.isPublished !== false ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button className="btn-outline btn-xs" onClick={() => handleOpenEdit(app)}>Edit</button>
                        <button className="btn-danger btn-xs" onClick={() => handleDelete(app)}>✕</button>
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
          <div className="admin-modal-box large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingApp ? 'Edit Sector Application' : 'Add Application Sector'}</h3>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}><IconX size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="admin-form">
              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Sector Title <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marine Mooring & Port Operations"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Suitable Products (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. 4-Ply Manila Rope, 3-Strand Hawser Jute, Spunyarn"
                  value={form.suitableProducts}
                  onChange={(e) => setForm({ ...form, suitableProducts: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Key Advantages (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Zero Static Discharge, High Salt-Water Grip, Heavy Tensile Strength"
                  value={form.benefits}
                  onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Description <span className="req">*</span></label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe how Bokul Rope Works natural fibre products serve this specific sector..."
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
                  <span>Published on public applications section</span>
                </label>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Sector'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
