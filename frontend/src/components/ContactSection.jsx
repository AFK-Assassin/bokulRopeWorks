import React, { useState } from 'react';
import { IconPhone, IconMail, IconMapPin, IconWhatsApp, IconCheckCircle } from './Icons';
import { submitInquiry } from '../services/api';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    productInterest: '3-Strand Hawser Laid Jute Rope',
    requiredQuantity: '',
    deliveryLocation: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [estimateData, setEstimateData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.message) {
      setErrorMsg('Please fill in all required fields (Name, Email, Phone, and Message).');
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
      setErrorMsg(res.message || 'Submission failed. Please try again or reach us by phone.');
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">Get in Touch</div>
          <h2 className="section-title">Request a Commercial Quotation</h2>
          <p className="section-desc">
            Directly reach our manufacturing plant sales desk for quotation rate sheets, sample coils, and delivery schedules.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left: Contact Info & Direct Links */}
          <div className="contact-info-panel">
            <h3>Bokul Rope Works</h3>
            <p className="contact-panel-desc">
              Dedicated jute rope manufacturer supplying wholesale distributors, shipping lines, and construction contractors.
            </p>

            <div className="contact-items">
              <div className="contact-item">
                <div className="c-icon-wrap">
                  <IconMapPin size={20} />
                </div>
                <div>
                  <strong>Factory & Head Office</strong>
                  <p>Howrah, West Bengal, India</p>
                  <span className="c-sub">Proximity to Kolkata & Haldia Ports</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="c-icon-wrap">
                  <IconPhone size={20} />
                </div>
                <div>
                  <strong>Commercial Sales Desk</strong>
                  <p><a href="tel:+919876543210">+91 98765 43210</a></p>
                  <span className="c-sub">Mon - Sat: 9:00 AM - 7:00 PM IST</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="c-icon-wrap">
                  <IconMail size={20} />
                </div>
                <div>
                  <strong>Email Inquiries</strong>
                  <p><a href="mailto:info@bokulropeworks.com">info@bokulropeworks.com</a></p>
                  <span className="c-sub">Guaranteed response within 24 hours</span>
                </div>
              </div>
            </div>

            <div className="whatsapp-quick-box">
              <div className="wa-icon-box">
                <IconWhatsApp size={24} />
              </div>
              <div className="wa-text">
                <strong>Need Instant WhatsApp Assistance?</strong>
                <p>Chat directly with our dispatch manager for urgent quotes.</p>
              </div>
              <a
                href="https://wa.me/919876543210?text=Hello%20Bokul%20Rope%20Works,%20I%20am%20interested%20in%20a%20commercial%20jute%20rope%20quotation."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                Chat on WhatsApp →
              </a>
            </div>
          </div>

          {/* Right: Interactive Quotation Form */}
          <div className="contact-form-panel">
            {submitted ? (
              <div className="contact-success-state">
                <div className="success-icon-wrap">
                  <IconCheckCircle size={52} />
                </div>
                <h3>Quotation & Estimation Generated</h3>
                <p>
                  Thank you, <strong>{formData.fullName}</strong>. We have processed your requirement for <strong>{formData.productInterest}</strong>.
                </p>

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
                        <strong>{estimateData.recommendedSpecs?.plies || '3-Strand Hawser Laid'}</strong>
                      </div>
                      <div className="ai-spec-row">
                        <span>Est. Breaking Strength:</span>
                        <strong>{estimateData.recommendedSpecs?.estimatedBreakingLoad || '1,900 - 2,400 kgf'}</strong>
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
                    <div><span>Indicative Rate:</span> <strong>₹115 – ₹140 / kg</strong></div>
                    <div><span>Contact Email:</span> {formData.email}</div>
                    <div><span>Contact Phone:</span> {formData.phone}</div>
                  </div>
                )}

                <p className="success-timeline">
                  ⚡ Our commercial sales team is reviewing your specifications and will issue a formal quote sheet within <strong>24 business hours</strong>.
                </p>
                <button
                  className="btn-outline"
                  onClick={() => {
                    setSubmitted(false);
                    setEstimateData(null);
                    setFormData({
                      fullName: '',
                      companyName: '',
                      email: '',
                      phone: '',
                      productInterest: '3-Strand Hawser Laid Jute Rope',
                      requiredQuantity: '',
                      deliveryLocation: '',
                      message: ''
                    });
                  }}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="c-form">
                <h4>Submit Your Specification</h4>
                <p className="c-form-subtitle">Fill in the parameters below for instant estimated rates.</p>

                {errorMsg && <div className="form-error-banner">{errorMsg}</div>}

                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name <span className="req">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Alok Ghosh"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Company / Enterprise Name</label>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="e.g. Bengal Logistics Ltd."
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
                    <label>Phone / WhatsApp Number <span className="req">*</span></label>
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
                    <label>Product Category</label>
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
                    <label>Estimated Quantity / Weight</label>
                    <input
                      type="text"
                      name="requiredQuantity"
                      placeholder="e.g. 1,000 kg, 20 coils, 1 Container"
                      value={formData.requiredQuantity}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Delivery Destination / Port</label>
                  <input
                    type="text"
                    name="deliveryLocation"
                    placeholder="e.g. Kolkata, Nhava Sheva, Delhi, Chennai"
                    value={formData.deliveryLocation}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Specifications & Custom Notes <span className="req">*</span></label>
                  <textarea
                    name="message"
                    required
                    rows="3"
                    placeholder="Mention target diameter (e.g. 16mm), cut lengths, oiled/unoiled requirement, or delivery schedule..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
                >
                  {loading ? 'Calculating Estimate & Submitting...' : 'Calculate Price Range & Submit →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
