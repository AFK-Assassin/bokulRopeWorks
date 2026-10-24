import Navbar from './Navbar';
import Footer from './Footer';
import { IconShieldCheck, IconMail, IconPhone, IconMapPin } from './Icons';

export default function PrivacyPolicy({ onNavigateHome, onOpenQuote }) {
  return (
    <div className="app-root">
      <Navbar onOpenQuote={onOpenQuote} onNavigateHome={onNavigateHome} />
      
      <main className="legal-page-container" style={{ padding: '120px 20px 60px', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <span style={{ color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
            Legal & Compliance
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginTop: '8px', marginBottom: '16px' }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Last updated: October 2026 • Bokul Rope Works, Howrah, West Bengal, India
          </p>
        </div>

        <div className="legal-content-card" style={{ background: 'var(--bg-card)', padding: '36px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-subtle)' }}>
          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>
              1. Overview
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '12px' }}>
              Bokul Rope Works (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy as a customer and user of our website. This Privacy Policy outlines how we collect, use, and safeguard personal and business information gathered through our public website and quotation request forms.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>
              2. Information We Collect
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '12px' }}>
              We collect information directly from you when you submit a quotation request or contact our sales department. This information includes:
            </p>
            <ul style={{ paddingLeft: '24px', color: 'var(--text-muted)', lineHeight: '1.7' }}>
              <li>Full Name and Contact Person details</li>
              <li>Business/Company Name and Industry Sector</li>
              <li>Email address and Phone/Mobile number</li>
              <li>Delivery Location/Port of Destination</li>
              <li>Product requirements (type, ply, strand, diameter, quantity)</li>
              <li>Additional order details or specifications provided in message fields</li>
            </ul>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>
              3. How We Use Your Information
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '12px' }}>
              The information collected is used exclusively for legitimate business purposes:
            </p>
            <ul style={{ paddingLeft: '24px', color: 'var(--text-muted)', lineHeight: '1.7' }}>
              <li>Generating commercial price quotations and estimates</li>
              <li>Responding to sales, manufacturing, and shipping inquiries</li>
              <li>Fulfilling sample requests and custom OEM manufacturing requirements</li>
              <li>Communicating order status and dispatch updates</li>
            </ul>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>
              4. Data Protection & Security
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '12px' }}>
              We implement appropriate technical and organizational measures to safeguard your information against unauthorized access, alteration, or disclosure. Submissions are processed through encrypted database channels and restricted to authorized company sales personnel.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>
              5. Cookies and Tracking Technologies
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '12px' }}>
              Our website does not use tracking cookies, advertising trackers, or third-party behavioral analytics. Local storage on your browser is utilized solely for maintaining session security for administrative users.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>
              6. Third-Party Sharing
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '12px' }}>
              We do not sell, rent, or trade your personal or business data to third parties. Information may only be shared with logistics/freight partners strictly to facilitate delivery of orders, or as required by law.
            </p>
          </section>

          <section style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>
              7. Contact Us
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
              If you have any questions or requests regarding your data, please contact our administrative office:
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
