import React from 'react';
import { IconMapPin, IconPhone, IconMail, IconShieldCheck } from './Icons';

export default function Footer({ onOpenQuote, onOpenAdmin }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <div className="brand-logo footer-logo">
              <div className="brand-badge">BRW</div>
              <div className="brand-text">
                Bokul Rope Works
                <span>Jute Rope Manufacturer</span>
              </div>
            </div>
            <p className="footer-brand-desc">
              Premier industrial jute rope and cordage manufacturer based in Howrah, West Bengal. Supplying 100% natural fiber solutions across India and global export ports.
            </p>
            <div className="footer-badge-item">
              <IconShieldCheck size={18} className="text-amber" />
              <span>Direct Mill Supply & Custom Specifications</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4>Quick Navigation</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#products">Product Catalogue</a></li>
              <li><a href="#process">Manufacturing Process</a></li>
              <li><a href="#applications">Applications & Sectors</a></li>
              <li><a href="#quality">Technical Specifications</a></li>
              <li><a href="#about">About Our Heritage</a></li>
              <li><a href="#contact">Contact Sales Desk</a></li>
              {onOpenAdmin && (
                <li><button onClick={onOpenAdmin} className="footer-admin-link">Owner Admin Dashboard</button></li>
              )}
            </ul>
          </div>

          {/* Products List */}
          <div className="footer-links-col">
            <h4>Product Categories</h4>
            <ul>
              <li><a href="#products">3-Strand Hawser Laid Ropes</a></li>
              <li><a href="#products">4-Ply Heavy Industrial Cordage</a></li>
              <li><a href="#products">Eco Packaging & Bundling Twines</a></li>
              <li><a href="#products">Treated Agricultural Ropes</a></li>
              <li><a href="#products">Polished & Colored Cordage</a></li>
              <li><a href="#products">Custom OEM Specifications</a></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="footer-contact-col">
            <h4>Factory & Sales Office</h4>
            <ul className="footer-contact-list">
              <li>
                <IconMapPin size={16} />
                <span>Howrah, West Bengal, India (PIN: 711101)</span>
              </li>
              <li>
                <IconPhone size={16} />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
              <li>
                <IconMail size={16} />
                <a href="mailto:info@bokulropeworks.com">info@bokulropeworks.com</a>
              </li>
            </ul>
            <div style={{ marginTop: '16px' }}>
              <button className="btn-primary btn-sm" onClick={() => onOpenQuote()}>
                Request a Bulk Quote →
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-copy">
            © {new Date().getFullYear()} <strong>Bokul Rope Works</strong>. All rights reserved. Registered in West Bengal, India.
          </div>
          <div className="footer-meta">
            <span>B2B Manufacturer • 100% Pure Bengal Jute</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
