import React, { useState, useEffect } from 'react';
import { APPLICATIONS } from '../data/productsData';
import { fetchApplications } from '../services/api';
import { IconArrowRight } from './Icons';

export default function ApplicationsSection({ onOpenQuote }) {
  const [liveApps, setLiveApps] = useState(null);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const data = await fetchApplications();
      if (data && data.length > 0) {
        setLiveApps(
          data.map((a, idx) => ({
            id: a._id || `app-${idx}`,
            icon: '🏭',
            title: a.title,
            desc: a.description,
            recommended: (a.suitableProducts || []).join(', ') || '3-Strand Jute Cordage',
            diameters: (a.benefits || []).join(', ') || 'Custom Gauge Range',
          }))
        );
      }
    } catch {
      // Fallback
    }
  };

  const apps = liveApps || APPLICATIONS;

  return (
    <section id="applications" className="section applications-section">
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">Versatile Industrial Applications</div>
          <h2 className="section-title">Serving Core Industries Across India & Global Ports</h2>
          <p className="section-desc">
            From marine shipping lashing and heavy scaffolding to eco-packaging and agriculture, our natural jute cordage delivers high frictional grip and reliable strength.
          </p>
        </div>

        <div className="applications-grid">
          {apps.map((app) => (
            <div key={app.id} className="application-card">
              <div className="app-card-icon">{app.icon}</div>
              <h3 className="app-card-title">{app.title}</h3>
              <p className="app-card-desc">{app.desc}</p>
              
              <div className="app-spec-info">
                <div className="app-info-row">
                  <span className="app-info-label">Recommended Grade:</span>
                  <span className="app-info-val">{app.recommended}</span>
                </div>
                <div className="app-info-row">
                  <span className="app-info-label">Standard Diameters / Benefits:</span>
                  <span className="app-info-val">{app.diameters}</span>
                </div>
              </div>

              <button
                className="btn-app-quote"
                onClick={() => onOpenQuote(app.title)}
              >
                Inquire for {app.title.split(',')[0]} <IconArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
