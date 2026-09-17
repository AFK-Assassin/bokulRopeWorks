import React from 'react';
import { IconShieldCheck, IconCheckCircle, IconLeaf } from './Icons';

export default function QualitySpecs({ onOpenQuote }) {
  const specsComparison = [
    { diameter: '6 mm (1/4")', plies: '3-Strand', approxWeight: '2.5 kg / 100m', breakingLoad: '450 - 550 kgf', primaryUse: 'General tying, agriculture, crafts' },
    { diameter: '10 mm (3/8")', plies: '3-Strand', approxWeight: '6.8 kg / 100m', breakingLoad: '850 - 1,100 kgf', primaryUse: 'Packaging, construction ties' },
    { diameter: '12 mm (1/2")', plies: '3-Strand', approxWeight: '10.2 kg / 100m', breakingLoad: '1,200 - 1,500 kgf', primaryUse: 'Scaffolding lashing, light rigging' },
    { diameter: '16 mm (5/8")', plies: '3/4-Strand', approxWeight: '17.5 kg / 100m', breakingLoad: '1,900 - 2,400 kgf', primaryUse: 'Marine mooring, transport lashing' },
    { diameter: '20 mm (3/4")', plies: '3/4-Strand', approxWeight: '27.0 kg / 100m', breakingLoad: '2,800 - 3,500 kgf', primaryUse: 'Heavy cargo tie-downs, tug lines' },
    { diameter: '24 mm (1")', plies: '3/4-Strand', approxWeight: '39.0 kg / 100m', breakingLoad: '3,800 - 4,600 kgf', primaryUse: 'Heavy industrial hoisting, barriers' },
    { diameter: '32 mm (1-1/4")', plies: '4-Strand / Cable', approxWeight: '70.0 kg / 100m', breakingLoad: '5,500 - 6,800 kgf', primaryUse: 'Quarry & heavy port rigging' }
  ];

  return (
    <section id="quality" className="section quality-section">
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">Technical Standards & Rigor</div>
          <h2 className="section-title">Physical Properties & Breaking Strength Reference</h2>
          <p className="section-desc">
            Standard indicative specifications for 3-ply and 4-ply natural jute cordage. Customized tolerances and linear weight counts can be calibrated for specific industrial tenders.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="specs-table-wrapper">
          <table className="specs-data-table">
            <thead>
              <tr>
                <th>Nominal Diameter</th>
                <th>Construction</th>
                <th>Approx. Weight (kg/100m)</th>
                <th>Average Breaking Load</th>
                <th>Recommended Utility</th>
              </tr>
            </thead>
            <tbody>
              {specsComparison.map((row, idx) => (
                <tr key={idx}>
                  <td><strong>{row.diameter}</strong></td>
                  <td>{row.plies}</td>
                  <td>{row.approxWeight}</td>
                  <td className="text-amber"><strong>{row.breakingLoad}</strong></td>
                  <td>{row.primaryUse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Jute Advantages Grid */}
        <div className="jute-advantages-grid">
          <div className="adv-card">
            <div className="adv-icon">
              <IconShieldCheck size={24} />
            </div>
            <h4>Superior Knot Friction & Grip</h4>
            <p>
              Natural jute fibers possess high surface friction, ensuring knots remain securely locked under heavy load without synthetic slip or unraveling.
            </p>
          </div>

          <div className="adv-card">
            <div className="adv-icon">
              <IconLeaf size={24} />
            </div>
            <h4>Low Static & Heat Resistance</h4>
            <p>
              Unlike synthetic poly ropes, jute produces no static charge, resists moderate friction heating without melting, and is 100% compostable post-service.
            </p>
          </div>

          <div className="adv-card">
            <div className="adv-icon">
              <IconCheckCircle size={24} />
            </div>
            <h4>Controlled Elasticity</h4>
            <p>
              Low elongation under standard working tension provides firm structural stability for construction scaffolding and heavy container binding.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
