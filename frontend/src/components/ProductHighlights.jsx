import React from 'react';

export default function ProductHighlights() {
  const products = [
    {
      title: 'Commercial Jute Ropes',
      desc: '3-Strand and 4-Ply hawser laid golden jute cordage for marine mooring, scaffolding, and cargo lashing.',
      specs: 'Diameters: 6mm to 50mm+ | Coils / Hanks',
      icon: '➰'
    },
    {
      title: 'Manila & Sisal Ropes',
      desc: 'High-tensile natural abaca manila and stiff agave sisal cordage for heavy lifting, marine rigging, and oilfields.',
      specs: 'Diameters: 4mm to 48mm+ | Heavy Duty',
      icon: '⚓'
    },
    {
      title: 'Precision Yarns & Twines',
      desc: 'Single & multi-ply Bengal jute yarns and smooth knotless packaging strings for carpet backing and carton bundling.',
      specs: 'Count: 4.8 - 36 lbs | Spools & Cops',
      icon: '🧵'
    },
    {
      title: 'Baan & Line Ropes',
      desc: 'Traditional cot/charpai high-twist baan ropes, masonry plumb lines, chalk lines, and marine sounding cordage.',
      specs: 'Diameters: 2mm to 8mm | Bundles & Spools',
      icon: '🪵'
    },
    {
      title: 'Marine & Industrial Spunyarn',
      desc: 'Tarred and natural long-fiber spunyarn for ship rigging seizing, pipe joint caulking, and naval protection.',
      specs: '2-Ply to 4-Ply | Tarred & Natural',
      icon: '🚢'
    },
    {
      title: 'Jute Carpets & Gunny Bags',
      desc: 'Handwoven natural jute rugs, runners, geotextile mats, and heavy A/B-Twill burlap sacks for grain storage & export.',
      specs: 'Custom Rug Dimensions | 50kg / 100kg Sacks',
      icon: '📦'
    }
  ];

  return (
    <section id="products" className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">Core Manufacturing Capabilities</div>
          <h2 className="section-title">Natural Fibre Products & Cordage</h2>
          <p className="section-desc">
            Direct mill manufacturing across Jute, Manila, Sisal, Yarns, Twines, Baan, Line Ropes, Spunyarn, Carpets, and Burlap Bags.
          </p>
        </div>

        <div className="product-grid">
          {products.map((item, index) => (
            <div key={index} className="product-card">
              <div className="product-icon-wrap">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <div className="product-specs">{item.specs}</div>
              <a href="#contact" className="product-link">
                Inquire Specs & Price →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
