import React, { useState, useEffect } from 'react';
import { IconFactory, IconSearch, IconX, IconCheckCircle } from '../../components/Icons';
import {
  fetchProcessSteps,
  createProcessStepApi,
  updateProcessStepApi,
  deleteProcessStepApi
} from '../../services/api';

export default function ProcessManager() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [form, setForm] = useState({
    stepNumber: 1,
    title: '',
    description: '',
    imageUrl: '/images/bokul_rope_works_process.webp',
    keyParameters: '',
    isPublished: true,
    order: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSteps();
  }, []);

  const loadSteps = async () => {
    setLoading(true);
    try {
      const data = await fetchProcessSteps();
      setSteps(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Process steps load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingStep(null);
    setForm({
      stepNumber: steps.length + 1,
      title: '',
      description: '',
      imageUrl: '/images/bokul_rope_works_process.webp',
      keyParameters: 'High Tension, Uniform Density, ISO Calibration',
      isPublished: true,
      order: steps.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (st) => {
    setEditingStep(st);
    setForm({
      stepNumber: st.stepNumber || 1,
      title: st.title || '',
      description: st.description || '',
      imageUrl: st.imageUrl || '/images/bokul_rope_works_process.webp',
      keyParameters: Array.isArray(st.keyParameters) ? st.keyParameters.join(', ') : (st.keyParameters || ''),
      isPublished: st.isPublished !== undefined ? st.isPublished : true,
      order: st.order || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        stepNumber: Number(form.stepNumber),
        order: Number(form.order),
        keyParameters: form.keyParameters.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingStep) {
        await updateProcessStepApi(editingStep._id, payload);
      } else {
        await createProcessStepApi(payload);
      }
      setModalOpen(false);
      await loadSteps();
    } catch (err) {
      alert(err.message || 'Failed to save process step');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (st) => {
    if (!window.confirm(`Delete "${st.title}" from manufacturing stages?`)) return;
    try {
      await deleteProcessStepApi(st._id);
      setSteps((prev) => prev.filter((s) => s._id !== st._id));
    } catch (err) {
      alert(err.message || 'Failed to delete process step');
    }
  };

  return (
    <div className="admin-page-content">
      <div className="admin-toolbar-card">
        <div className="admin-toolbar-left">
          <h3>8-Stage Manufacturing Workflow Steps ({steps.length})</h3>
        </div>
        <div className="admin-toolbar-right">
          <button className="btn-primary btn-sm" onClick={handleOpenAdd}>
            + Add Process Step
          </button>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-state">Loading manufacturing steps...</div>
        ) : steps.length === 0 ? (
          <div className="admin-empty-state">
            <IconFactory size={36} />
            <h4>No custom manufacturing steps</h4>
            <p>Click "Add Process Step" to add mill machinery and workflow stages.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Stage #</th>
                  <th>Stage Title</th>
                  <th>Description</th>
                  <th>Key Parameters</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((st) => (
                  <tr key={st._id}>
                    <td>
                      <span className="step-num-badge">Stage {st.stepNumber}</span>
                    </td>
                    <td><strong>{st.title}</strong></td>
                    <td>
                      <span className="msg-preview-text">{(st.description || '').slice(0, 70)}...</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {(st.keyParameters || []).map((p, idx) => (
                          <span key={idx} className="spec-tag">{p}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${st.isPublished !== false ? 'status-won' : 'status-lost'}`}>
                        {st.isPublished !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button className="btn-outline btn-xs" onClick={() => handleOpenEdit(st)}>Edit</button>
                        <button className="btn-danger btn-xs" onClick={() => handleDelete(st)}>✕</button>
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
              <h3>{editingStep ? 'Edit Process Stage' : 'Add Manufacturing Step'}</h3>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}><IconX size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="admin-form">
              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Step Number <span className="req">*</span></label>
                  <input
                    type="number"
                    required
                    value={form.stepNumber}
                    onChange={(e) => setForm({ ...form, stepNumber: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Step Title <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. High-Torque Twisting & Laying"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Step Image URL</label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Key Parameters / Quality Checks (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Precision Twist Pitch, Oil Emulsion Level, Tensile Calibration"
                  value={form.keyParameters}
                  onChange={(e) => setForm({ ...form, keyParameters: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Detailed Description <span className="req">*</span></label>
                <textarea
                  rows="3"
                  required
                  placeholder="Explain the machinery operation, quality checks, and parameters applied during this stage..."
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
                  <span>Published on public process page</span>
                </label>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Step'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
