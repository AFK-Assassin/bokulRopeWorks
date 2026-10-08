import { useState, useEffect, useCallback } from 'react';
import { IconX, IconSearch, IconRope } from '../../components/Icons';
import {
  fetchTechnicalStandards,
  createStandardApi,
  updateStandardApi,
  deleteStandardApi,
} from '../../services/api';

export default function StandardManager() {
  const [standards, setStandards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStandard, setEditingStandard] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    diameter: '',
    plies: '3-Strand',
    approxWeight: '',
    breakingLoad: '',
    primaryUse: '',
    order: 0,
    isPublished: true,
  });

  const loadStandards = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTechnicalStandards();
      setStandards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Technical standards load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStandards();
  }, [loadStandards]);

  const handleOpenAdd = () => {
    setEditingStandard(null);
    setForm({
      diameter: '',
      plies: '3-Strand',
      approxWeight: '',
      breakingLoad: '',
      primaryUse: '',
      order: standards.length + 1,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (std) => {
    setEditingStandard(std);
    setForm({
      diameter: std.diameter || '',
      plies: std.plies || '3-Strand',
      approxWeight: std.approxWeight || '',
      breakingLoad: std.breakingLoad || '',
      primaryUse: std.primaryUse || '',
      order: std.order || 0,
      isPublished: std.isPublished !== undefined ? std.isPublished : true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) };
      if (editingStandard) {
        await updateStandardApi(editingStandard._id, payload);
      } else {
        await createStandardApi(payload);
      }
      setModalOpen(false);
      await loadStandards();
    } catch (err) {
      alert(err.message || 'Failed to save technical standard specification');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (std) => {
    if (!window.confirm(`Delete technical standard for diameter "${std.diameter}"?`)) return;
    try {
      await deleteStandardApi(std._id);
      setStandards((prev) => prev.filter((s) => s._id !== std._id));
    } catch (err) {
      alert(err.message || 'Failed to delete standard');
    }
  };

  const filteredStandards = standards.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      (s.diameter || '').toLowerCase().includes(q) ||
      (s.plies || '').toLowerCase().includes(q) ||
      (s.primaryUse || '').toLowerCase().includes(q) ||
      (s.breakingLoad || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-page-content">
      {/* Top Toolbar */}
      <div className="admin-toolbar-card">
        <div className="admin-toolbar-left">
          <div className="search-box">
            <IconSearch size={16} />
            <input
              type="text"
              placeholder="Search diameter (e.g. 8mm, 14mm), plies, or use..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="admin-toolbar-right">
          <button className="btn-primary btn-sm" onClick={handleOpenAdd}>
            + Add New Standard (e.g. 8mm, 14mm)
          </button>
        </div>
      </div>

      {/* Standards Card Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Breaking Strength & Technical Standards Chart ({filteredStandards.length})</h3>
            <p>Direct mill physical specifications displayed on the public Technical Standards section</p>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading-state">Loading technical standards chart...</div>
        ) : filteredStandards.length === 0 ? (
          <div className="admin-empty-state">
            <IconRope size={36} />
            <h4>No standards recorded</h4>
            <p>Click "+ Add New Standard" above to create diameter specifications.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Nominal Diameter</th>
                  <th>Construction / Plies</th>
                  <th>Approx. Weight (kg/100m)</th>
                  <th>Average Breaking Load</th>
                  <th>Recommended Utility</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStandards.map((std) => (
                  <tr key={std._id}>
                    <td><code>#{std.order || 0}</code></td>
                    <td><strong>{std.diameter}</strong></td>
                    <td>{std.plies}</td>
                    <td>{std.approxWeight}</td>
                    <td><strong className="text-amber">{std.breakingLoad}</strong></td>
                    <td>{std.primaryUse}</td>
                    <td>
                      <span className={`status-pill ${std.isPublished !== false ? 'status-won' : 'status-lost'}`}>
                        {std.isPublished !== false ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button className="btn-outline btn-xs" onClick={() => handleOpenEdit(std)}>
                          Edit
                        </button>
                        <button className="btn-danger btn-xs" onClick={() => handleDelete(std)}>
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

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingStandard ? 'Edit Technical Standard' : 'Add Technical Standard Gauge'}</h3>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}>
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="admin-form">
              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Nominal Diameter <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 8 mm (5/16&quot;) or 14 mm (9/16&quot;)"
                    value={form.diameter}
                    onChange={(e) => setForm({ ...form, diameter: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Construction / Plies <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3-Strand or 3/4-Strand"
                    value={form.plies}
                    onChange={(e) => setForm({ ...form, plies: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Approx. Weight (kg/100m) <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4.5 kg / 100m or 13.8 kg / 100m"
                    value={form.approxWeight}
                    onChange={(e) => setForm({ ...form, approxWeight: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Average Breaking Load <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 650 - 800 kgf or 1,550 - 1,900 kgf"
                    value={form.breakingLoad}
                    onChange={(e) => setForm({ ...form, breakingLoad: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Recommended Utility / Primary Application <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Packaging bundles, nursery, scaffolding ties..."
                  value={form.primaryUse}
                  onChange={(e) => setForm({ ...form, primaryUse: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Sort Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                  />
                </div>
                <div className="admin-form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '10px' }}>
                  <label className="custom-checkbox-label" style={{ margin: 0 }}>
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    />
                    <span>Visible in Public Standards Table</span>
                  </label>
                </div>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn-outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Technical Standard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
