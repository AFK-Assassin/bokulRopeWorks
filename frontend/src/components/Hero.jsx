import React from 'react';
import { motion } from 'framer-motion';
import { IconArrowRight, IconFactory, IconCheckCircle, IconShieldCheck } from './Icons';

export default function Hero({ onOpenQuote }) {
  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="hero-grid">
          <motion.div 
            className="hero-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="hero-tag">
              <IconFactory size={15} /> Direct Mill Manufacturer • Howrah, WB
            </div>
            
            <h1 className="hero-title">
              Engineered for Strength. <span>Pure Bengal Jute.</span>
            </h1>
            
            <p className="hero-desc">
              Premier manufacturer of 3-ply & 4-ply natural jute ropes, heavy-duty industrial cables, and eco-packaging twines. Built for high-tensile load applications with certified uniform pitch.
            </p>

            <div className="hero-usp-chips">
              <span className="usp-chip">
                <IconCheckCircle size={15} /> 100% Pure Natural Jute
              </span>
              <span className="usp-chip">
                <IconCheckCircle size={15} /> Diameters 4mm - 50mm+
              </span>
              <span className="usp-chip">
                <IconCheckCircle size={15} /> Custom Coils & Cut Lengths
              </span>
              <span className="usp-chip">
                <IconCheckCircle size={15} /> Direct Factory Rates
              </span>
            </div>

            <div className="hero-actions">
              <motion.button 
                className="btn-primary" 
                onClick={() => onOpenQuote()}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Request Bulk Quotation <IconArrowRight size={18} />
              </motion.button>
              <a href="#products" className="btn-outline">
                Explore Products
              </a>
            </div>
          </motion.div>

          <motion.div 
            className="hero-right"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="hero-stat-card">
              <div className="hero-card-badge">
                <span>B2B Manufacturer</span>
              </div>
              
              <div className="hero-card-header">
                <h3>Bokul Rope Works</h3>
                <p>Manufacturing Facility in Howrah, West Bengal</p>
              </div>

              <div className="hero-stats-grid">
                <div className="hero-stat-box">
                  <div className="stat-number">100%</div>
                  <div className="stat-name">Natural & Biodegradable</div>
                </div>
                <div className="hero-stat-box">
                  <div className="stat-number">4mm - 50mm+</div>
                  <div className="stat-name">Available Diameters</div>
                </div>
                <div className="hero-stat-box">
                  <div className="stat-number">3 & 4 Ply</div>
                  <div className="stat-name">Hawser & Cable Laid</div>
                </div>
                <div className="hero-stat-box">
                  <div className="stat-number">Pan-India</div>
                  <div className="stat-name">Bulk & Export Supply</div>
                </div>
              </div>

              <div className="hero-card-footer">
                <div className="qc-tag">
                  <IconShieldCheck size={16} />
                  <span>Tensile & Weight Batch Verified</span>
                </div>
                <button className="btn-card-quote" onClick={() => onOpenQuote()}>
                  Inquire Factory Pricing →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
