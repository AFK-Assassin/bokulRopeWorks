import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="hero-tag">
              🏭 Direct Manufacturer & Exporter
            </div>
            <h1 className="hero-title">
              Heavy-Duty <span>Jute Ropes</span> Engineered for Strength.
            </h1>
            <p className="hero-desc">
              Premium quality 3-ply & 4-ply natural jute cordage, industrial ropes, and twines manufactured with high tensile strength in Howrah, West Bengal.
            </p>
            <div className="hero-actions">
              <a href="#products" className="btn-primary">
                Explore Product Catalog
              </a>
              <a href="#contact" className="btn-outline">
                Get Bulk Pricing
              </a>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-header">
              <h3>Manufacturing Highlights</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Reliable B2B Supply & Custom Specifications
              </p>
            </div>
            <div className="hero-stat-list">
              <div className="stat-item">
                <div className="stat-num">100%</div>
                <div className="stat-label">Pure Natural Jute</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">4mm - 50mm+</div>
                <div className="stat-label">Diameter Range</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">Custom</div>
                <div className="stat-label">Cut Lengths & Coils</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">Pan-India</div>
                <div className="stat-label">Bulk Dispatch</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
