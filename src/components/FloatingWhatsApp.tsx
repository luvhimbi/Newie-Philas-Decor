import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const WHATSAPP_NUMBER = '27814170801';
const WHATSAPP_MESSAGE = encodeURIComponent("Hi, I'd like to book decor services.");
const ATTENTION_INTERVAL_MS = 14000;
const FIRST_ATTENTION_DELAY_MS = 6000;

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function playNotificationSound() {
  try {
    const ctx = new AudioContext();
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };
    playTone(880, 0, 0.09);
    playTone(1174, 0.11, 0.09);
    setTimeout(() => ctx.close(), 400);
  } catch {
    // Audio not supported or blocked
  }
}

export default function FloatingWhatsApp() {
  const prefersReducedMotion = useReducedMotion();
  const [attention, setAttention] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const canPlaySound = useRef(false);

  const triggerAttention = useCallback(() => {
    if (dismissed || prefersReducedMotion) return;

    setAttention(true);
    setShowPreview(true);

    if (canPlaySound.current) {
      playNotificationSound();
    }

    setTimeout(() => setAttention(false), 900);
    setTimeout(() => setShowPreview(false), 4500);
  }, [dismissed, prefersReducedMotion]);

  useEffect(() => {
    const enableSound = () => {
      canPlaySound.current = true;
    };
    document.addEventListener('click', enableSound, { once: true });
    document.addEventListener('touchstart', enableSound, { once: true });
    document.addEventListener('keydown', enableSound, { once: true });

    return () => {
      document.removeEventListener('click', enableSound);
      document.removeEventListener('touchstart', enableSound);
      document.removeEventListener('keydown', enableSound);
    };
  }, []);

  useEffect(() => {
    if (dismissed || prefersReducedMotion) return;

    const first = setTimeout(triggerAttention, FIRST_ATTENTION_DELAY_MS);
    const interval = setInterval(triggerAttention, ATTENTION_INTERVAL_MS);

    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [dismissed, prefersReducedMotion, triggerAttention]);

  const handleClick = () => {
    setDismissed(true);
    setShowPreview(false);
    setAttention(false);
  };

  return (
    <div className="whatsapp-wrap">
      <AnimatePresence>
        {showPreview && !dismissed && (
          <motion.div
            className="whatsapp-preview"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <span className="whatsapp-preview-label">Phila&apos;s Decor</span>
            <p>Hi! Ready to book your event decor? Message us now 👋</p>
            <span className="whatsapp-preview-time">Just now</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
        className={`whatsapp-float ${attention ? 'whatsapp-attention' : ''}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp — new message"
        onClick={handleClick}
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <WhatsAppIcon />
        {!dismissed && <span className="whatsapp-badge" aria-hidden="true">1</span>}
        <span className="whatsapp-tooltip">Chat on WhatsApp</span>
        {!prefersReducedMotion && (
          <motion.span
            className="whatsapp-pulse"
            animate={{ scale: [1, 1.5, 1], opacity: [0.45, 0, 0.45] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.a>
    </div>
  );
}
