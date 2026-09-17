import React from 'react';

export default function WhyChooseUs() {
  const advantages = [
    {
      title: 'Direct Factory Sourcing',
      desc: 'No middleman markups. Direct manufacturer rates with scalable production capacity for large ongoing tenders.',
      icon: '🏭'
    },
    {
      title: 'Strict Quality Control',
      desc: 'Uniform gauge, consistent twist pitch, and rigorous tensile batch testing to prevent sudden breakage.',
      icon: '🛡️'
    },
    {
      title: '100% Biodegradable & Eco-Friendly',
      desc: 'Pure, sustainably sourced natural fiber offering an environmentally conscious alternative to synthetic ropes.',
      icon: '🌱'
    },
    {
      title: 'Reliable Pan-India Logistics',
      desc: 'Seamless dispatch from Howrah transport hubs ensuring prompt freight delivery across all major commercial ports & cities.',
      icon: '🚚'
    }
  ];

  return (
    <section id="about" className="section why-us">
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle" style={{ color: '#d97706' }}>Why Partner With Us</div>
          <h2 className="section-title">The Bokul Rope Works Advantage</h2>
          <p className="section-desc">
            Decades of craftsmanship rooted in the historic jute manufacturing hub of Howrah, West Bengal.
          </p>
        </div>

        <div className="features-grid">
          {advantages.map((adv, idx) => (
            <div key={idx} className="feature-box">
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{adv.icon}</div>
              <h4>{adv.title}</h4>
              <p>{adv.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
