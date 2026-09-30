import React, { useState, useEffect } from 'react';
import { IconShieldCheck, IconX, IconCheckCircle } from '../../components/Icons';
import {
  fetchCertifications,
  createCertificationApi,
  updateCertificationApi,
  deleteCertificationApi
} from '../../services/api';

export default function CertificationManager() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [form, setForm] = useState({
    title: '',
    issuingAuthority: '',
    certificateNumber: '',
    standardCode: 'IS 5175 / ISO 9001',
    description: '',
    validUntil: '',
    documentUrl: '',
    isPublished: true,
    order: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCerts();
  }, []);

  const loadCerts = async () => {
    setLoading(true);
    try {
      const data = await fetchCertifications();
      setCerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Certifications load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCert(null);
    setForm({
      title: '',
      issuingAuthority: 'Bureau of Indian Standards (BIS)',
      certificateNumber: '',
      standardCode: 'IS 5175:2014',
      description: 'Specification for Natural Fibre Ropes and Cordages',
      validUntil: '2028-12-31',
      documentUrl: '',
      isPublished: true,
      order: certs.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cert) => {
    setEditingCert(cert);
    setForm({
      title: cert.title || '',
      issuingAuthority: cert.issuingAuthority || '',
      certificateNumber: cert.certificateNumber || '',
      standardCode: cert.standardCode || 'IS 5175',
      description: cert.description || '',
      validUntil: cert.validUntil || '',
      documentUrl: cert.documentUrl || '',
      isPublished: cert.isPublished !== undefined ? cert.isPublished : true,
      order: cert.order || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) };
      if (editingCert) {
        await updateCertificationApi(editingCert._id, payload);
      } else {
        await createCertificationApi(payload);
      }
      setModalOpen(false);
      await loadCerts();
    } catch (err) {
      alert(err.message || 'Failed to save certification');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cert) => {
    if (!window.confirm(`Delete certification "${cert.title}"?`)) return;
    try {
      await deleteCertificationApi(cert._id);
      setCerts((prev) => prev.filter((c) => c._id !== cert._id));
    } catch (err) {
      alert(err.message || 'Failed to delete certification');
    }
  };

  return (
    <div className="admin-page-content">
      <div className="admin-toolbar-card">
        <div className="admin-toolbar-left">
          <h3>Standards & Compliance Certifications ({certs.length})</h3>
        </div>
        <div className="admin-toolbar-right">
          <button className="btn-primary btn-sm" onClick={handleOpenAdd}>
            + Add New Certification
          </button>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-state">Loading certifications...</div>
        ) : certs.length === 0 ? (
          <div className="admin-empty-state">
            <IconShieldCheck size={36} />
            <h4>No certifications recorded</h4>
            <p>Click "Add New Certification" to display compliance standards to buyers.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Certification Name</th>
                  <th>Issuing Authority</th>
                  <th>Standard Code</th>
                  <th>Certificate #</th>
                  <th>Validity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {certs.map((cert) => (
                  <tr key={cert._id}>
                    <td><strong>{cert.title}</strong></td>
                    <td>{cert.issuingAuthority}</td>
                    <td><code>{cert.standardCode}</code></td>
                    <td>{cert.certificateNumber || '—'}</td>
                    <td>{cert.validUntil || 'Lifetime / Regular Audit'}</td>
                    <td>
                      <span className={`status-pill ${cert.isPublished !== false ? 'status-won' : 'status-lost'}`}>
                        {cert.isPublished !== false ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button className="btn-outline btn-xs" onClick={() => handleOpenEdit(cert)}>Edit</button>
                        <button className="btn-danger btn-xs" onClick={() => handleDelete(cert)}>✕</button>
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
              <h3>{editingCert ? 'Edit Certification' : 'Add Compliance Certification'}</h3>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}><IconX size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="admin-form">
              <div className="admin-form-group">
                <label>Certificate Title <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BIS Quality Certification for Natural Cordage"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Issuing Authority <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bureau of Indian Standards (BIS)"
                    value={form.issuingAuthority}
                    onChange={(e) => setForm({ ...form, issuingAuthority: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Standard Code</label>
                  <input
                    type="text"
                    placeholder="e.g. IS 5175 / ISO 9001:2015"
                    value={form.standardCode}
                    onChange={(e) => setForm({ ...form, standardCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Certificate Number</label>
                  <input
                    type="text"
                    placeholder="e.g. CM/L-7829103"
                    value={form.certificateNumber}
                    onChange={(e) => setForm({ ...form, certificateNumber: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Valid Until</label>
                  <input
                    type="text"
                    placeholder="e.g. 2028-12-31 or Active Audit"
                    value={form.validUntil}
                    onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Document / PDF URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://... or /documents/cert.pdf"
                  value={form.documentUrl}
                  onChange={(e) => setForm({ ...form, documentUrl: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Description & Scope</label>
                <textarea
                  rows="2"
                  placeholder="Scope of testing and specifications covered..."
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
                  <span>Published on public quality & standards page</span>
                </label>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
