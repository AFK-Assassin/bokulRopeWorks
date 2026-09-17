import React from 'react';
import { IconFactory, IconMapPin, IconShieldCheck, IconCheckCircle } from './Icons';

export default function AboutSection({ onOpenQuote }) {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <div className="section-subtitle">About Bokul Rope Works</div>
            <h2 className="section-title">Rooted in Howrah — The Golden Fiber Capital of India</h2>
            
            <p className="about-lead">
              <strong>Bokul Rope Works</strong> is an established manufacturer and supplier of industrial jute ropes, cordage, and agricultural twines based in Howrah, West Bengal.
            </p>
            
            <p className="about-body">
              Strategically located in West Bengal's historic jute manufacturing corridor, we leverage access to the world's finest raw jute fiber, expert rope craftsmen, and modern twisting equipment to produce dependable cordage for B2B buyers across India and international markets.
            </p>

            <div className="about-commitments">
              <div className="commit-item">
                <IconCheckCircle size={20} className="text-amber" />
                <div>
                  <strong>Direct Mill Accountability:</strong> Every batch is manufactured, inspected, and dispatched directly from our Howrah facility.
                </div>
              </div>
              <div className="commit-item">
                <IconCheckCircle size={20} className="text-amber" />
                <div>
                  <strong>Sustainable Manufacturing:</strong> 100% biodegradable natural fiber products supporting global green packaging transitions.
                </div>
              </div>
              <div className="commit-item">
                <IconCheckCircle size={20} className="text-amber" />
                <div>
                  <strong>Custom Engineering:</strong> Flexible production machinery to calibrate diameters, lay tightness, and coil packaging for client specifications.
                </div>
              </div>
            </div>

            <div className="about-actions">
              <button className="btn-primary" onClick={() => onOpenQuote()}>
                Request Factory Quote
              </button>
              <a href="#contact" className="btn-outline">
                Contact Sales Desk
              </a>
            </div>
          </div>

          <div className="about-side-card">
            <div className="about-badge-card">
              <div className="badge-icon-box">
                <IconFactory size={36} />
              </div>
              <h3>Bokul Rope Works</h3>
              <p className="badge-location">
                <IconMapPin size={16} /> Howrah, West Bengal, India
              </p>

              <div className="about-stats-list">
                <div className="about-stat">
                  <span className="stat-big">100%</span>
                  <span className="stat-text">Natural Bengal Jute</span>
                </div>
                <div className="about-stat">
                  <span className="stat-big">4mm-50mm</span>
                  <span className="stat-text">Manufacturing Range</span>
                </div>
                <div className="about-stat">
                  <span className="stat-big">Pan-India</span>
                  <span className="stat-text">Transport & Export Hub</span>
                </div>
                <div className="about-stat">
                  <span className="stat-big">B2B</span>
                  <span className="stat-text">Wholesale & Custom Batches</span>
                </div>
              </div>

              <div className="about-dispatch-note">
                ⚡ Direct port accessibility to Kolkata and Haldia for international ocean freight container shipments.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
