import React from 'react';
import { APPLICATIONS } from '../data/productsData';
import { IconArrowRight } from './Icons';

export default function ApplicationsSection({ onOpenQuote }) {
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
          {APPLICATIONS.map((app) => (
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
                  <span className="app-info-label">Standard Diameters:</span>
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
