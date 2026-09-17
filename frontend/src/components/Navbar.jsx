import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconPhone, IconMail } from './Icons';

export default function Navbar({ onOpenQuote, onOpenAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Minimal Top Contact Strip */}
      <div className="topbar">
        <div className="container topbar-container">
          <div className="topbar-left">
            <span>🏭 Direct Jute Rope Mill</span>
            <span className="divider">•</span>
            <span>Howrah, West Bengal</span>
          </div>
          <div className="topbar-right">
            <a href="tel:+919876543210" className="topbar-link">
              <IconPhone size={13} /> +91 98765 43210
            </a>
            <span className="divider">•</span>
            <a href="mailto:info@bokulropeworks.com" className="topbar-link">
              <IconMail size={13} /> info@bokulropeworks.com
            </a>
          </div>
        </div>
      </div>

      {/* Floating Glass Header */}
      <header className="navbar-wrapper">
        <motion.div 
          className="container nav-container"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <a href="#home" className="brand-logo">
            <div className="brand-badge">BRW</div>
            <div className="brand-text">
              Bokul Rope Works
              <span>Industrial Jute Cordage</span>
            </div>
          </a>

          <nav className="desktop-nav">
            <ul className="nav-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#process">Process</a></li>
              <li><a href="#applications">Applications</a></li>
              <li><a href="#quality">Standards</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>

          <div className="nav-actions">
            <button 
              className="btn-outline btn-sm nav-admin-btn" 
              onClick={() => onOpenAdmin && onOpenAdmin()}
              title="Owner Dashboard"
            >
              Owner Admin
            </button>
            <motion.button 
              className="btn-primary nav-quote-btn" 
              onClick={() => onOpenQuote()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Request Quote
            </motion.button>
            <button 
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
              <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
              <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            </button>
          </div>
        </motion.div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="mobile-menu-drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="mobile-nav-links">
                <li><a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
                <li><a href="#products" onClick={() => setMobileMenuOpen(false)}>Products</a></li>
                <li><a href="#process" onClick={() => setMobileMenuOpen(false)}>Manufacturing Process</a></li>
                <li><a href="#applications" onClick={() => setMobileMenuOpen(false)}>Applications</a></li>
                <li><a href="#quality" onClick={() => setMobileMenuOpen(false)}>Quality Standards</a></li>
                <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>About Us</a></li>
                <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact Desk</a></li>
              </ul>
              <div style={{ marginTop: '20px' }}>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuote();
                  }}
                >
                  Request a Quote
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
