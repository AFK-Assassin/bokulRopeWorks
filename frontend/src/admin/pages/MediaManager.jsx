import React, { useState, useEffect } from 'react';
import { IconSearch, IconX, IconCheckCircle } from '../../components/Icons';
import { fetchMediaLibrary, createMediaApi, deleteMediaApi } from '../../services/api';

export default function MediaManager() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({
    title: '',
    url: '',
    filename: '',
    fileType: 'image',
    altText: '',
  });
  const [saving, setSaving] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await fetchMediaLibrary();
      setMediaItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Media load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setForm({
      title: '',
      url: '/images/',
      filename: '',
      fileType: 'image',
      altText: '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createMediaApi(form);
      setModalOpen(false);
      await loadMedia();
    } catch (err) {
      alert(err.message || 'Failed to register media asset');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete media asset "${item.title}" from library?`)) return;
    try {
      await deleteMediaApi(item._id);
      setMediaItems((prev) => prev.filter((m) => m._id !== item._id));
      if (previewItem?._id === item._id) setPreviewItem(null);
    } catch (err) {
      alert(err.message || 'Failed to delete media');
    }
  };

  const filteredMedia = mediaItems.filter((m) => {
    return (
      (m.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.filename || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.url || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="admin-page-content">
      <div className="admin-toolbar-card">
        <div className="admin-toolbar-left">
          <div className="search-box">
            <IconSearch size={16} />
            <input
              type="text"
              placeholder="Search media files, photos, assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="admin-toolbar-right">
          <button className="btn-primary btn-sm" onClick={handleOpenAdd}>
            + Register / Upload Media
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Mill Photo & Document Assets ({filteredMedia.length})</h3>
            <p>Stored assets usable across products, manufacturing process, and standards</p>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading-state">Loading media library...</div>
        ) : filteredMedia.length === 0 ? (
          <div className="admin-empty-state">
            <h4>No media files found</h4>
            <p>Click "Register / Upload Media" to add asset URLs or mill photographs.</p>
          </div>
        ) : (
          <div className="media-gallery-grid">
            {filteredMedia.map((item) => (
              <div key={item._id} className="media-gallery-card">
                <div className="media-thumb-box" onClick={() => setPreviewItem(item)}>
                  <img src={item.url} alt={item.title} />
                </div>
                <div className="media-info-box">
                  <strong>{item.title}</strong>
                  <code>{item.url}</code>
                  <div className="media-card-actions">
                    <button
                      className="btn-outline btn-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(item.url);
                        alert(`Copied URL: ${item.url}`);
                      }}
                    >
                      Copy URL
                    </button>
                    <button
                      className="btn-danger btn-xs"
                      onClick={() => handleDelete(item)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Media Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Register Media Asset</h3>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}>
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="admin-form">
              <div className="admin-form-group">
                <label>Asset Title <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3-Ply Manila Rope High-Res"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Asset Path / URL <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="/images/... or https://..."
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>File Type</label>
                  <select
                    value={form.fileType}
                    onChange={(e) => setForm({ ...form, fileType: e.target.value })}
                  >
                    <option value="image">Image (WebP/JPG/PNG)</option>
                    <option value="pdf">PDF Document</option>
                    <option value="document">General Document</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Alt Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Jute Rope Manufacturing Mill"
                    value={form.altText}
                    onChange={(e) => setForm({ ...form, altText: e.target.value })}
                  />
                </div>
              </div>

              {form.url && form.url.startsWith('/') && (
                <div style={{ marginTop: '8px' }}>
                  <img src={form.url} alt="Preview" style={{ height: '70px', borderRadius: '6px', objectFit: 'cover' }} />
                </div>
              )}

              <div className="admin-modal-actions">
                <button type="button" className="btn-outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Registering...' : 'Add to Library'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="admin-modal-overlay" onClick={() => setPreviewItem(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="admin-modal-header">
              <h3>{previewItem.title}</h3>
              <button className="admin-modal-close" onClick={() => setPreviewItem(null)}>
                <IconX size={20} />
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <img
                src={previewItem.url}
                alt={previewItem.title}
                style={{ maxHeight: '350px', width: '100%', objectFit: 'contain', borderRadius: '8px' }}
              />
              <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#a1a1aa' }}>
                Asset Path: <code>{previewItem.url}</code>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
