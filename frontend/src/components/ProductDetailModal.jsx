import React from 'react';
import { IconX, IconCheckCircle, IconShieldCheck, IconRope, IconTruck } from './Icons';

export default function ProductDetailModal({ product, isOpen, onClose, onRequestQuote }) {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close details">
          <IconX size={20} />
        </button>

        <div className="detail-modal-header">
          <div className="modal-tag">{product.category}</div>
          <h2>{product.name}</h2>
          <p className="detail-subtitle">{product.shortDesc}</p>
        </div>

        <div className="detail-body-grid">
          <div className="detail-main-info">
            <div className="detail-section">
              <h4>Product Description & Geometry</h4>
              <p>{product.description}</p>
            </div>

            <div className="detail-section">
              <h4>Key Industrial Applications</h4>
              <ul className="detail-app-list">
                {product.applications.map((app, i) => (
                  <li key={i}>
                    <IconCheckCircle size={16} className="app-icon" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h4>Packaging & Commercial Supply</h4>
              <p className="packaging-text">
                <IconTruck size={16} /> {product.packaging}
              </p>
              <div className="moq-badge">
                <strong>Standard MOQ:</strong> {product.moq}
              </div>
            </div>
          </div>

          <div className="detail-specs-sidebar">
            <div className="specs-card">
              <div className="specs-card-title">
                <IconShieldCheck size={18} />
                <span>Technical Specifications</span>
              </div>
              <div className="specs-table">
                {product.specs && product.specs.map((s, idx) => (
                  <div key={idx} className="spec-row">
                    <span className="spec-key">{s.label}</span>
                    <span className="spec-val">{s.value}</span>
                  </div>
                ))}
                <div className="spec-row">
                  <span className="spec-key">Breaking Load</span>
                  <span className="spec-val highlight-val">{product.breakingStrength}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Available Gauge</span>
                  <span className="spec-val">{product.diameterRange}</span>
                </div>
              </div>

              <div className="specs-card-cta">
                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    onClose();
                    onRequestQuote(product);
                  }}
                >
                  Request Quote for this Product →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
