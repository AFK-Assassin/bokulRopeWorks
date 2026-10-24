import Navbar from './Navbar';
import Footer from './Footer';

export default function TermsConditions({ onNavigateHome, onOpenQuote }) {
  return (
    <div className="app-root">
      <Navbar onOpenQuote={onOpenQuote} onNavigateHome={onNavigateHome} />
      
      <main className="legal-page-container" style={{ padding: '120px 20px 60px', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <span style={{ color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
            Legal & Compliance
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginTop: '8px', marginBottom: '16px' }}>
            Terms & Conditions
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Last updated: October 2026 • Bokul Rope Works, Howrah, West Bengal, India
          </p>
        </div>

        <div className="legal-content-card" style={{ background: 'var(--bg-card)', padding: '36px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-subtle)' }}>
          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>
              1. Website Usage
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '12px' }}>
              By accessing and using this website, you agree to comply with and be bound by these Terms and Conditions. This website is intended for business-to-business (B2B) procurement inquiries, technical specifications review, and commercial quotation requests for jute and natural fiber cordage products.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>
              2. Product Specifications & Tolerances
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '12px' }}>
              All product specifications, dimensions, diameters, breaking strengths, and weights displayed on this website are nominal values based on standard manufacturing metrics. Due to the inherent natural characteristics of natural fibers (jute, manila, sisal), minor variations within standard industrial manufacturing tolerances may occur.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>
              3. Quotation Requests & Indicative Estimates
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '12px' }}>
              Submission of a quote request or receipt of an automated cost estimate does not constitute a legally binding sales contract. Official binding commercial quotes, including GST, freight, minimum order quantities (MOQ), and delivery timelines, will be issued directly by our sales department following formal inquiry review.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>
              4. Accuracy of Information
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '12px' }}>
              While Bokul Rope Works endeavors to ensure that all information on this website is accurate and up to date, product availability, raw material pricing, and manufacturing schedules are subject to change without prior notice.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>
              5. Limitation of Liability
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '12px' }}>
              Bokul Rope Works shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use of, or inability to use, this website or the information contained herein. Industrial rope applications must be designed in accordance with recommended safety factors and working load limits (WLL).
            </p>
          </section>

          <section style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>
              6. Contact Information
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
              For formal contract negotiations, trade inquiries, or specification verification, please contact:
            </p>
            <div style={{ background: 'var(--bg-muted)', padding: '16px 20px', borderRadius: 'var(--radius-md)', fontSize: '0.95rem' }}>
              <p style={{ margin: '4px 0' }}><strong>Bokul Rope Works</strong></p>
              <p style={{ margin: '4px 0' }}>Howrah, West Bengal, India — PIN 711114</p>
              <p style={{ margin: '4px 0' }}>Email: <a href="mailto:bokul.rope@gmail.com" style={{ color: 'var(--primary)' }}>bokul.rope@gmail.com</a></p>
              <p style={{ margin: '4px 0' }}>Phone: <a href="tel:+917044620790" style={{ color: 'var(--primary)' }}>+91 70446 20790</a></p>
            </div>
          </section>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button className="btn-secondary" onClick={onNavigateHome} style={{ cursor: 'pointer' }}>
            ← Return to Homepage
          </button>
        </div>
      </main>

      <Footer onOpenQuote={onOpenQuote} />
    </div>
  );
}
