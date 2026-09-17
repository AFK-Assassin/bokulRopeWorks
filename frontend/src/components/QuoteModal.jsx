import React, { useState, useEffect } from 'react';
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
    message: ''
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

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.message) {
      setErrorMsg('Please fill in all required fields (Name, Email, Phone, and Requirement).');
      return;
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
                <h2>Request a Commercial Quote</h2>
                <p>
                  Receive an instant indicative price range and technical specification breakdown calibrated for your requirement.
                </p>
              </div>

              {errorMsg && <div className="form-error-banner">{errorMsg}</div>}

              <form onSubmit={handleSubmit} className="quote-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name <span className="req">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Company / Enterprise Name</label>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="e.g. Bengal Shipping Corp"
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Business Email <span className="req">*</span></label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone / WhatsApp <span className="req">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Product Interest</label>
                    <select
                      name="productInterest"
                      value={formData.productInterest}
                      onChange={handleChange}
                    >
                      <option value="3-Strand Hawser Laid Jute Rope">3-Strand Hawser Laid Jute Rope (6mm - 40mm)</option>
                      <option value="Heavy-Duty 4-Ply Industrial Cordage">Heavy-Duty 4-Ply Industrial Cordage (12mm - 50mm+)</option>
                      <option value="Eco-Friendly Packaging & Bundling Twines">Eco-Friendly Packaging & Bundling Twines</option>
                      <option value="Treated Agricultural & Nursery Ropes">Treated Agricultural & Nursery Ropes</option>
                      <option value="Polished & Colored Jute Cordage">Polished & Colored Jute Cordage</option>
                      <option value="Custom Engineered OEM Jute Ropes">Custom Engineered OEM / Tender Specification</option>
                      <option value="General Jute Requirement">Other / General Requirement</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Target Diameter / Gauge</label>
                    <input
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
                    <label>Estimated Quantity / Volume</label>
                    <input
                      type="text"
                      name="requiredQuantity"
                      placeholder="e.g. 1000 kg, 50 coils, 1 Container"
                      value={formData.requiredQuantity}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Delivery City / Port Destination</label>
                    <input
                      type="text"
                      name="deliveryLocation"
                      placeholder="e.g. Kolkata, Mumbai, Mundra Port"
                      value={formData.deliveryLocation}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Specific Application & Custom Requirements <span className="req">*</span></label>
                  <textarea
                    name="message"
                    required
                    rows="3"
                    placeholder="Describe your intended application (e.g. scaffolding, marine lashing, export bundling), cut lengths, oiled/unoiled preference..."
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
