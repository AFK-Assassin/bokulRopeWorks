import React, { useState, useEffect } from 'react';
import { fetchWebsiteSettings, updateWebsiteSettingsApi } from '../../services/api';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    companyName: 'Bokul Rope Works',
    tagline: '100% Pure Natural Fibre Cordage & Jute Rope Manufacturers',
    plantLocation: 'Howrah, West Bengal, India (PIN: 711114)',
    phone: '+91 70446 20790',
    email: 'bokul.rope@gmail.com',
    whatsappNumber: '917044620790',
    operatingHours: 'Mon - Sat: 8:00 AM - 6:00 PM IST',
    metaTitle: 'Bokul Rope Works | Industrial Jute Rope & Cordage Mill Howrah',
    metaDescription: 'Premier natural fibre cordage mill based in Howrah, West Bengal.',
    quoteNotificationEmail: 'bokul.rope@gmail.com',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchWebsiteSettings();
      if (data) setSettings(data);
    } catch (err) {
      console.warn('Settings load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await updateWebsiteSettingsApi(settings);
      if (updated) setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update website settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-content">
      <div className="admin-toolbar-card">
        <div className="admin-toolbar-left">
          <h3>Mill Profile & System Settings</h3>
          <p style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
            Manage commercial sales contacts, WhatsApp dispatch numbers, and metadata.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="owner-login-error" style={{ background: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.4)', color: '#86efac' }}>
          <span>✓</span> Website settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Enterprise & Sales Contacts</h3>
              <p>Displayed on header strip, footer, and quotation forms</p>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Enterprise Company Name</label>
              <input
                type="text"
                required
                value={settings.companyName || ''}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label>Tagline / Descriptor</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="admin-form-group">
              <label>Sales Phone</label>
              <input
                type="text"
                required
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label>Sales Email</label>
              <input
                type="email"
                required
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label>WhatsApp Number (Country code + digits)</label>
              <input
                type="text"
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Factory & Sales Address</label>
              <input
                type="text"
                value={settings.plantLocation || ''}
                onChange={(e) => setSettings({ ...settings, plantLocation: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label>Operating Hours</label>
              <input
                type="text"
                value={settings.operatingHours || ''}
                onChange={(e) => setSettings({ ...settings, operatingHours: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="admin-card" style={{ marginTop: '20px' }}>
          <div className="admin-card-header">
            <div>
              <h3>Search Engine Optimization (SEO)</h3>
              <p>Meta title and description for Google search indexing</p>
            </div>
          </div>

          <div className="admin-form-group">
            <label>SEO Meta Title</label>
            <input
              type="text"
              value={settings.metaTitle || ''}
              onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label>SEO Meta Description</label>
            <textarea
              rows="3"
              value={settings.metaDescription || ''}
              onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
            ></textarea>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
