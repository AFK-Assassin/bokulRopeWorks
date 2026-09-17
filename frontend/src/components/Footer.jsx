import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 style={{ color: '#ffffff' }}>Bokul Rope Works</h3>
            <p>
              Leading manufacturer, supplier, and exporter of natural jute cordage, industrial ropes, and agricultural packing solutions based in Howrah, West Bengal.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#products">Product Catalog</a></li>
              <li><a href="#about">About Company</a></li>
              <li><a href="#contact">Request Quotation</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Products</h4>
            <ul>
              <li><a href="#products">3-Ply Jute Ropes</a></li>
              <li><a href="#products">Industrial Cordage</a></li>
              <li><a href="#products">Packaging Twines</a></li>
              <li><a href="#products">Custom Specifications</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Factory & Office</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
              📍 Howrah, West Bengal, India
            </p>
            <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
              ✉️ info@bokulropeworks.com
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              🕒 Mon - Sat: 9:00 AM - 7:00 PM IST
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Bokul Rope Works. All rights reserved.
          </div>
          <div>
            Built with React & Vite
          </div>
        </div>
      </div>
    </footer>
  );
}
