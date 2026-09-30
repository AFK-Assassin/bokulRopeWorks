import React from 'react';
import { motion } from 'framer-motion';
import { IconArrowRight, IconFactory, IconCheckCircle } from './Icons';

export default function Hero({ onOpenQuote }) {
  return (
    <section id="home" className="hero-section">
      {/* Full-bleed background image */}
      <div className="hero-bg-image" />

      {/* Cinematic dual-gradient overlay — no shape, pure gradient */}
      <div className="hero-bg-overlay" />

      <div className="container hero-inner">
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        >
          <div className="hero-tag">
            <IconFactory size={15} /> Direct Mill Manufacturer • Howrah, WB
          </div>

          <h1 className="hero-title">
            Engineered for Strength.{' '}
            <span>Natural Fibre &amp; Jute Cordage.</span>
          </h1>

          <p className="hero-desc">
            Direct mill manufacturer of commercial{' '}
            <strong>Jute, Manila &amp; Sisal Ropes</strong>, precision{' '}
            <strong>Yarns &amp; Twines</strong>, traditional{' '}
            <strong>Baan &amp; Line Ropes</strong>, marine{' '}
            <strong>Spunyarn</strong>, woven <strong>Jute Carpets</strong>, and
            heavy <strong>Burlap Sacks</strong>.
          </p>

          <div className="hero-usp-chips">
            <span className="usp-chip">
              <IconCheckCircle size={15} /> Jute, Manila &amp; Sisal Cordage
            </span>
            <span className="usp-chip">
              <IconCheckCircle size={15} /> Spun Yarns, Twines &amp; Baan
            </span>
            <span className="usp-chip">
              <IconCheckCircle size={15} /> Marine Spunyarn &amp; Line Ropes
            </span>
            <span className="usp-chip">
              <IconCheckCircle size={15} /> Carpets &amp; Burlap Gunny Bags
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
            <a href="#products" className="btn-outline hero-outline-btn">
              Explore Products
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
