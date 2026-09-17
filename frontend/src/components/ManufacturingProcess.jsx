import React from 'react';
import { MANUFACTURING_STEPS } from '../data/productsData';
import { IconShieldCheck, IconFactory } from './Icons';

export default function ManufacturingProcess({ onOpenQuote }) {
  return (
    <section id="process" className="section process-section">
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">Manufacturing Excellence</div>
          <h2 className="section-title">From Bengal Golden Fiber to Industrial Rope</h2>
          <p className="section-desc">
            Our multi-stage manufacturing process combines authentic West Bengal jute craftsmanship with mechanical precision, ensuring uniform tension, low elongation, and consistent breaking strength.
          </p>
        </div>

        <div className="process-grid">
          {MANUFACTURING_STEPS.map((step, index) => (
            <div key={index} className="process-step-card">
              <div className="step-header">
                <span className="step-num">{step.step}</span>
                <span className="step-icon">{step.icon}</span>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="process-quality-banner">
          <div className="p-quality-left">
            <div className="p-quality-badge">
              <IconShieldCheck size={24} />
            </div>
            <div>
              <h4>Standardized Batch Tolerances & Quality Pledge</h4>
              <p>
                Every production run undergoes strict linear mass verification and tensile strain measurement to verify consistency across bulk export consignments.
              </p>
            </div>
          </div>
          <div>
            <button className="btn-primary" onClick={() => onOpenQuote()}>
              Request Quality Certifications & Quote →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
