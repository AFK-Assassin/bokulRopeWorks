import { useState, useEffect, useRef, useCallback } from 'react';
import { IconFactory, IconX } from '../../components/Icons';
import {
  fetchProcessSteps,
  createProcessStepApi,
  updateProcessStepApi,
  deleteProcessStepApi,
  uploadMediaApi,
} from '../../services/api';

export default function ProcessManager() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

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

  const loadSteps = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProcessSteps();
      setSteps(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Process steps load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSteps();
  }, [loadSteps]);

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
    setImagePreview('/images/bokul_rope_works_process.webp');
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
    setImagePreview(st.imageUrl || '/images/bokul_rope_works_process.webp');
    setModalOpen(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) processAndUploadFile(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processAndUploadFile(file);
  };

  const processAndUploadFile = async (file) => {
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result);
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      formData.append('title', form.title || cleanTitle);
      formData.append('altText', form.title || cleanTitle);

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
          <h3>Factory Manufacturing Process Steps ({steps.length})</h3>
        </div>
        <div className="admin-toolbar-right">
          <button className="btn-primary btn-sm" onClick={handleOpenAdd}>
            + Add Stage Step
          </button>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-state">Loading process pipeline...</div>
        ) : steps.length === 0 ? (
          <div className="admin-empty-state">
            <IconFactory size={36} />
            <h4>No process steps configured</h4>
            <p>Add the manufacturing stages for public display.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Stage #</th>
                  <th>Step Title</th>
                  <th>Key Parameters</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((st) => (
                  <tr key={st._id}>
                    <td>
                      <span className="rate-badge">Stage {st.stepNumber || 1}</span>
                    </td>
                    <td>
                      <strong>{st.title}</strong>
                      <span className="cell-sub">{st.description?.slice(0, 70)}...</span>
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

              {/* Direct Image Upload from PC */}
              <div className="admin-form-group">
                <label>Step Machinery / Factory Photo</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.svg,.bmp,.tiff,.tif,.avif,.heic,.jfif"
                  onChange={handleFileSelect}
                />
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
                        <img src={imagePreview} alt="Step Preview" />
                      </div>
                      <div className="preview-info-box">
                        <div className="preview-status-pill">
                          {uploadingImage ? '⏳ Uploading from PC...' : '✓ Image Uploaded from PC'}
                        </div>
                        <span className="preview-path-text">Path: <code>{form.imageUrl}</code></span>
                        <div className="preview-actions-row">
                          <button
                            type="button"
                            className="btn-outline btn-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            📁 Change Image from PC
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-prompt-box">
                      <div className="upload-icon-circle">📷</div>
                      <div className="upload-prompt-text">
                        <strong>Click to Browse Photo from PC or Drag & Drop</strong>
                        <span>Accepts all formats (JPG, JPEG, PNG, WEBP, etc.)</span>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '6px' }}>
                  <input
                    type="text"
                    placeholder="Or specify URL / path"
                    value={form.imageUrl}
                    onChange={(e) => {
                      setForm({ ...form, imageUrl: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                  />
                </div>
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
                <button type="submit" className="btn-primary" disabled={saving || uploadingImage}>
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
