import { IconWhatsApp, IconRope } from './Icons';

export default function FloatingCTA({ onOpenQuote }) {
  return (
    <div className="floating-cta-container">
      <a
        href="https://wa.me/917044620790?text=Hello%2C%20I%E2%80%99m%20interested%20in%20commercial-grade%20jute%20rope.%20Please%20share%20your%20quotation."
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn floating-wa"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <IconWhatsApp size={24} />
        <span className="floating-tooltip">WhatsApp Quick Chat</span>
      </a>

      <button
        onClick={() => onOpenQuote()}
        className="floating-btn floating-quote"
        aria-label="Request Quote"
        title="Quick Quote"
      >
        <IconRope size={22} />
        <span className="floating-tooltip">Instant Quote</span>
      </button>
    </div>
  );
}
