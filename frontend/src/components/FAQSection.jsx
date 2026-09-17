import React, { useState } from 'react';
import { FAQS } from '../data/productsData';
import { IconChevronDown } from './Icons';

export default function FAQSection({ onOpenQuote }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="section faq-section">
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">Common Inquiries</div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-desc">
            Everything you need to know regarding commercial terms, minimum order quantities, custom diameters, and dispatch timelines.
          </p>
        </div>

        <div className="faq-list">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className={`faq-card ${isOpen ? 'active' : ''}`}>
                <button
                  className="faq-question-btn"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-q-text">{item.q}</span>
                  <span className={`faq-arrow ${isOpen ? 'rotated' : ''}`}>
                    <IconChevronDown size={20} />
                  </span>
                </button>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="faq-footer-callout">
          <span>Have a specific requirement not covered here?</span>
          <button className="btn-primary" onClick={() => onOpenQuote()}>
            Ask Our Sales Desk Directly →
          </button>
        </div>
      </div>
    </section>
  );
}
