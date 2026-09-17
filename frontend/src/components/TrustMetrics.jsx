import React from 'react';
import { IconFactory, IconShieldCheck, IconLeaf, IconTruck } from './Icons';

export default function TrustMetrics() {
  const pillars = [
    {
      icon: <IconFactory size={28} />,
      title: 'Direct Manufacturer Pricing',
      desc: 'No middleman commissions. Direct-from-factory commercial quotes for wholesale distributors and industrial buyers.'
    },
    {
      icon: <IconShieldCheck size={28} />,
      title: 'Stringent Quality Control',
      desc: 'Uniform gauge thickness, controlled twist pitch, and tensile batch validation to prevent slippage and load breakage.'
    },
    {
      icon: <IconLeaf size={28} />,
      title: '100% Biodegradable & Natural',
      desc: 'Sourced from selected Bengal golden jute fiber, offering a carbon-neutral alternative to synthetic plastic cordage.'
    },
    {
      icon: <IconTruck size={28} />,
      title: 'Howrah Logistics Hub',
      desc: 'Strategically located near major transport corridors and Kolkata / Haldia ports for reliable pan-India and export dispatch.'
    }
  ];

  return (
    <section className="trust-metrics-section">
      <div className="container">
        <div className="pillars-grid">
          {pillars.map((item, idx) => (
            <div key={idx} className="pillar-card">
              <div className="pillar-icon-wrap">{item.icon}</div>
              <div className="pillar-content">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
