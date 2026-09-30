import React, { useState, useEffect } from 'react';
import { IconShieldCheck, IconCheckCircle } from '../../components/Icons';
import { fetchWebsiteSettings, updateWebsiteSettingsApi, fetchAdminProducts } from '../../services/api';

export default function HomepageManager() {
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sets, prods] = await Promise.all([
        fetchWebsiteSettings().catch(() => null),
        fetchAdminProducts().catch(() => []),
      ]);
      setSettings(sets || {});
      setProducts(prods);
    } catch (err) {
      console.warn('Homepage load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateWebsiteSettingsApi(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading-state">Loading homepage configuration...</div>;
  }

  return (
    <div className="admin-page-content">
      <div className="admin-toolbar-card">
        <div className="admin-toolbar-left">
          <h3>Homepage Controlled Content Manager</h3>
          <p style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
            Safely update factory stats, trust pillars, and public contact information without altering the approved hero design.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="owner-login-error" style={{ background: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.4)', color: '#86efac' }}>
          <span>✓</span> Homepage parameters updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Protected Hero Guarantee Box */}
        <div className="admin-card" style={{ borderLeft: '4px solid #d97706' }}>
          <div className="admin-card-header">
            <div>
              <h3 style={{ color: '#fbbf24' }}>🛡️ Hero Section Guard</h3>
              <p>The cinematic hero section layout, background, headline, and CTA styling are permanently preserved.</p>
            </div>
          </div>
        </div>

        {/* Manufacturing Capacity & Heritage Statistics */}
        <div className="admin-card" style={{ marginTop: '20px' }}>
          <div className="admin-card-header">
            <div>
              <h3>Factory Trust Metrics & Production Stats</h3>
              <p>Displayed in the key trust pillars section</p>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Annual Manufacturing Capacity</label>
              <input
                type="text"
                value={settings?.stats?.annualCapacity || '5,000+ Metric Tons'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    stats: { ...settings?.stats, annualCapacity: e.target.value },
                  })
                }
              />
            </div>

            <div className="admin-form-group">
              <label>Manufacturing Plant Area</label>
              <input
                type="text"
                value={settings?.stats?.plantArea || '45,000+ Sq. Ft.'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    stats: { ...settings?.stats, plantArea: e.target.value },
                  })
                }
              />
            </div>

            <div className="admin-form-group">
              <label>Industry Legacy / Years</label>
              <input
                type="text"
                value={settings?.stats?.experienceYears || '35+ Years Industry Legacy'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    stats: { ...settings?.stats, experienceYears: e.target.value },
                  })
                }
              />
            </div>

            <div className="admin-form-group">
              <label>Global Export Footprint</label>
              <input
                type="text"
                value={settings?.stats?.exportCountries || '14+ Export Countries'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    stats: { ...settings?.stats, exportCountries: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Featured Products Summary */}
        <div className="admin-card" style={{ marginTop: '20px' }}>
          <div className="admin-card-header">
            <div>
              <h3>Currently Featured Catalog Products ({products.filter(p => p.isFeatured).length})</h3>
              <p>Manage which products display priority badges on the public catalog</p>
            </div>
          </div>

          <div className="featured-prods-list">
            {products.map((p) => (
              <div key={p._id} className="featured-pill-item">
                <span className={p.isFeatured ? 'text-gold' : ''}>
                  {p.isFeatured ? '★' : '☆'} {p.name}
                </span>
                <span className="cat-badge">{p.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Homepage Parameters'}
          </button>
        </div>
      </form>
    </div>
  );
}
