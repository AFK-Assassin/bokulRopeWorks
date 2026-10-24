import Navbar from './Navbar';
import Footer from './Footer';

export default function NotFound({ onNavigateHome, onOpenQuote }) {
  return (
    <div className="app-root">
      <Navbar onOpenQuote={onOpenQuote} onNavigateHome={onNavigateHome} />
      
      <main style={{ padding: '140px 20px 80px', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '6rem', fontWeight: '800', color: 'var(--primary)', lineHeight: '1', marginBottom: '12px' }}>
            404
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '16px' }}>
            Page Not Found
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '32px' }}>
            The page or route you requested does not exist or has been moved. Please return to our main catalog to view our industrial natural fiber ropes and cordage.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={onNavigateHome} style={{ cursor: 'pointer' }}>
              Return to Homepage
            </button>
            <button className="btn-secondary" onClick={() => onOpenQuote()} style={{ cursor: 'pointer' }}>
              Request Bulk Quote
            </button>
          </div>
        </div>
      </main>

      <Footer onOpenQuote={onOpenQuote} />
    </div>
  );
}
