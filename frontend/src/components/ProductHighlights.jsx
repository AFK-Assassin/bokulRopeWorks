import React from 'react';

export default function ProductHighlights() {
  const products = [
    {
      title: '3-Strand Hawser Laid Jute Rope',
      desc: 'Standard commercial grade 3-ply twisted jute rope with high tensile strength and flexible grip.',
      specs: 'Diameters: 6mm to 40mm | Coils / Hanks',
      icon: '➰'
    },
    {
      title: 'Heavy-Duty Industrial Cordage',
      desc: 'High-density construction tailored for marine, construction scaffolding, and heavy transport lashing.',
      specs: 'Diameters: 12mm to 50mm+ | High Load',
      icon: '⚓'
    },
    {
      title: 'Eco Packaging & Bundling Twines',
      desc: 'Smooth finished fine jute yarn & strings ideal for agricultural binding, retail packaging, and handicrafts.',
      specs: 'Plies: 2-ply, 3-ply, 4-ply | Spools & Balls',
      icon: '🌿'
    },
    {
      title: 'Custom Diameter & Colored Jute Rope',
      desc: 'Customized rope specifications treated for moisture resistance or specialized decorative/industrial utility.',
      specs: 'Custom Order | Bulk MOQ Applies',
      icon: '⚙️'
    }
  ];

  return (
    <section id="products" className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">Our Core Offerings</div>
          <h2 className="section-title">Industrial Jute Products</h2>
          <p className="section-desc">
            Manufactured from selected Bengal golden fiber, precision-twisted to ensure minimal elongation and maximum durability.
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
