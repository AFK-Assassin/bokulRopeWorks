import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconCheckCircle } from './Icons';
import { submitInquiry } from '../services/api';

export default function QuoteModal({ isOpen, onClose, prefilledProduct }) {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    productInterest: '3-Strand Hawser Laid Jute Rope',
    requiredQuantity: '',
    deliveryLocation: '',
    diameter: '',
    message: '',
    website: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [estimateData, setEstimateData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (prefilledProduct) {
      setFormData((prev) => ({
        ...prev,
        productInterest: prefilledProduct.name || prefilledProduct,
        diameter: prefilledProduct.diameterRange || ''
      }));
    }
  }, [prefilledProduct]);

  // Accessibility: Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleResetAndClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot spam protection
    if (formData.website) {
      setSubmitted(true);
      setEstimateData({
        priceRangePerKg: '₹110 - ₹140 / kg',
        leadTime: '3-5 Business Days',
        estimatedTotalRange: 'Calculated based on specifications'
      });
      return;
    }

    // Input Validation
    const nameTrim = (formData.fullName || '').trim();
    if (!nameTrim || nameTrim.length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }

    const phoneTrim = (formData.phone || '').trim();
    const phoneRegex = /^[+\d\s\-().]{7,20}$/;
    if (!phoneTrim || !phoneRegex.test(phoneTrim)) {
      setErrorMsg('Please enter a valid phone or WhatsApp number (7-20 digits/symbols).');
      return;
    }

    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setErrorMsg('Please enter a valid email address (or leave it blank).');
        return;
      }
    }

    setLoading(true);
    setErrorMsg('');

    const res = await submitInquiry(formData);
    setLoading(false);

    if (res.success) {
      setSubmitted(true);
      if (res.estimate) {
        setEstimateData(res.estimate);
      } else if (res.data && res.data.estimate) {
        setEstimateData(res.data.estimate);
      }
    } else {
      setErrorMsg(res.message || 'Something went wrong. Please try again or contact us directly.');
    }
  };

  const handleResetAndClose = () => {
    if (submitted) {
      setFormData({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        productInterest: prefilledProduct?.name || '3-Strand Hawser Laid Jute Rope',
        requiredQuantity: '',
        deliveryLocation: '',
        diameter: prefilledProduct?.diameterRange || '',
        message: '',
        website: ''
      });
    }
    setSubmitted(false);
    setEstimateData(null);
    setErrorMsg('');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay" 
        onClick={handleResetAndClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="modal-content" 
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="qm-title"
        >
          <button className="modal-close" onClick={handleResetAndClose} aria-label="Close modal">
            <IconX size={18} />
          </button>

          {submitted ? (
            <div className="quote-success-state">
              <div className="success-icon-wrap">
                <IconCheckCircle size={52} />
              </div>
              <h2>Quotation & Technical Estimate Generated</h2>
              <p>
                Thank you, <strong>{formData.fullName}</strong> ({formData.companyName || 'Direct Buyer'}). We have evaluated your requirement for <strong>{formData.productInterest}</strong>.
              </p>

              {/* Instant AI Price Range & Technical Estimation Card */}
              {estimateData ? (
                <div className="ai-estimate-box">
                  <div className="ai-estimate-header">
                    <span className="ai-badge">⚡ Instant Factory Estimate</span>
                    <span className="ai-lead-time">Lead Time: {estimateData.leadTime}</span>
                  </div>

                  <div className="ai-price-highlight">
                    <div className="price-item">
                      <span className="price-sub">Indicative Rate:</span>
                      <span className="price-main text-amber">{estimateData.priceRangePerKg}</span>
                    </div>
                    {estimateData.estimatedTotalRange && (
                      <div className="price-item">
                        <span className="price-sub">Estimated Batch Total:</span>
                        <span className="price-main">{estimateData.estimatedTotalRange}</span>
                      </div>
                    )}
                  </div>

                  <div className="ai-spec-breakdown">
                    <div className="ai-spec-row">
                      <span>Recommended Spec:</span>
                      <strong>{estimateData.recommendedSpecs?.plies || '3-Strand Hawser Laid'} ({formData.diameter || estimateData.recommendedSpecs?.recommendedDiameter || 'Standard Gauge'})</strong>
                    </div>
                    <div className="ai-spec-row">
                      <span>Est. Breaking Load:</span>
                      <strong>{estimateData.recommendedSpecs?.estimatedBreakingLoad || '1,900 - 2,400 kgf'}</strong>
                    </div>
                    <div className="ai-spec-row">
                      <span>Packaging:</span>
                      <strong>{estimateData.packagingAdvice}</strong>
                    </div>
                  </div>

                  {estimateData.advisorNotes && (
                    <p className="ai-advisor-note">
                      💡 <em>{estimateData.advisorNotes}</em>
                    </p>
                  )}
                </div>
              ) : (
                <div className="success-details-card">
                  <div><span>Indicative Rate:</span> <strong>₹110 – ₹135 / kg</strong></div>
                  <div><span>Contact Logged:</span> {formData.email} | {formData.phone}</div>
                </div>
              )}

              <p className="success-timeline">
                📞 Our Howrah sales desk is preparing your certified proforma sheet and will contact you directly within <strong>24 business hours</strong>.
              </p>

              <button className="btn-primary" onClick={handleResetAndClose} style={{ width: '100%', justifyContent: 'center' }}>
                Done & Return to Catalogue
              </button>
            </div>
          ) : (
            <div>
              <div className="modal-header">
                <div className="modal-tag">Direct Mill Estimation</div>
                <h2 id="qm-title">Request a Commercial Quote</h2>
                <p>
                  Receive an instant indicative price range and technical specification breakdown calibrated for your requirement.
                </p>
              </div>

              {errorMsg && <div className="form-error-banner">{errorMsg}</div>}

              <form onSubmit={handleSubmit} className="quote-form">
                {/* Honeypot Spam Protection (Hidden from humans, traps bots) */}
                <div style={{ display: 'none', opacity: 0, position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="qm-fullName">Full Name <span className="req">*</span></label>
                    <input
                      id="qm-fullName"
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="qm-companyName">Company / Enterprise Name</label>
                    <input
                      id="qm-companyName"
                      type="text"
                      name="companyName"
                      placeholder="e.g. Bengal Shipping Corp"
                      value={formData.companyName}
                      onChange={handleChange}
                      autoComplete="organization"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="qm-email">Business Email <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span></label>
                    <input
                      id="qm-email"
                      type="email"
                      name="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="qm-phone">Phone / WhatsApp <span className="req">*</span></label>
                    <input
                      id="qm-phone"
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 70446 20790"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="qm-productInterest">Product Interest</label>
                    <select
                      id="qm-productInterest"
                      name="productInterest"
                      value={formData.productInterest}
                      onChange={handleChange}
                    >
                      <option value="3-Strand Hawser Laid Jute Rope">3-Strand Hawser Laid Jute Rope (6mm - 40mm)</option>
                      <option value="Heavy-Duty 4-Ply Industrial Cordage">Heavy-Duty 4-Ply Industrial Cordage (12mm - 50mm+)</option>
                      <option value="Pure Manila Ropes (Abaca Fibre)">Pure Manila Ropes - Abaca Fibre (6mm - 48mm+)</option>
                      <option value="Industrial Sisal Ropes & Cordage">Industrial Sisal Ropes & Cordage (4mm - 36mm)</option>
                      <option value="Precision-Spun Jute Yarn">Precision-Spun Jute Yarn (Single / Multi-End)</option>
                      <option value="Eco-Friendly Jute Packaging Twines">Eco-Friendly Jute Packaging & Bundling Twines</option>
                      <option value="Traditional Jute Baan Ropes">Traditional Jute Baan Ropes (Charpai Cordage)</option>
                      <option value="Precision Line Ropes">Precision Line Ropes (Masonry, Marine & Chalk)</option>
                      <option value="Marine & Industrial Spunyarn">Marine & Industrial Spunyarn (Tarred / Natural)</option>
                      <option value="Natural Jute Carpets, Rugs & Mats">Natural Jute Carpets, Rugs & Geotextile Mats</option>
                      <option value="Burlap Jute Bags & Heavy Gunny Sacks">Burlap Jute Bags & Heavy Gunny Sacks (50kg/100kg)</option>
                      <option value="Custom Engineered OEM Specifications">Custom Engineered OEM / Tender Specification</option>
                      <option value="General Cordage Requirement">Other / General Requirement</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="qm-diameter">Target Diameter / Gauge</label>
                    <input
                      id="qm-diameter"
                      type="text"
                      name="diameter"
                      placeholder="e.g. 16mm, 24mm, or 1/2 inch"
                      value={formData.diameter}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="qm-requiredQuantity">Estimated Quantity / Volume</label>
                    <input
                      id="qm-requiredQuantity"
                      type="text"
                      name="requiredQuantity"
                      placeholder="e.g. 1000 kg, 50 coils, 1 Container"
                      value={formData.requiredQuantity}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="qm-deliveryLocation">Delivery City / Port Destination</label>
                    <input
                      id="qm-deliveryLocation"
                      type="text"
                      name="deliveryLocation"
                      placeholder="e.g. Kolkata, Mumbai, Mundra Port"
                      value={formData.deliveryLocation}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="qm-message">Specific Application & Custom Notes <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span></label>
                  <textarea
                    id="qm-message"
                    name="message"
                    rows="3"
                    placeholder="Describe intended application (scaffolding, marine lashing, export bundling), cut lengths, oiled/unoiled..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Calculating Rate & Registering...' : 'Get Instant Price Range & Submit →'}
                </motion.button>
              </form>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
