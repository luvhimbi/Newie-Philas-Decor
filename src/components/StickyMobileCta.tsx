import { Phone } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';

const WHATSAPP_URL = "https://wa.me/27814170801?text=Hi%2C%20I'd%20like%20to%20book%20decor%20services.";

export default function StickyMobileCta() {
  return (
    <div className="mobile-cta-bar" role="navigation" aria-label="Quick contact">
      <a href="tel:0814170801" className="mobile-cta-btn mobile-cta-phone">
        <Phone size={18} />
        <span>Call Us</span>
      </a>
      <a
        href={WHATSAPP_URL}
        className="mobile-cta-btn mobile-cta-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon size={18} />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
