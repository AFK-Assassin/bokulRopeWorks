import React from 'react';

export default function QuoteBanner() {
  return (
    <section id="contact" className="section" style={{ padding: '40px 0 80px' }}>
      <div className="container">
        <div className="quote-banner">
          <div>
            <h2>Need Custom Diameters or Bulk Export Quantities?</h2>
            <p>
              Connect directly with our sales desk for certified test certificates, sample spools, and custom quotation sheets.
            </p>
          </div>
          <div>
            <a href="mailto:info@bokulropeworks.com" className="btn-white">
              Contact Sales Desk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
