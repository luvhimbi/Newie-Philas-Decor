import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { WhatsAppIcon } from './SocialIcons';

const WHATSAPP_NUMBER = '27814170801';
const WHATSAPP_MESSAGE = encodeURIComponent("Hi, I'd like to book decor services.");
const TEN_MINUTES_MS = 10 * 60 * 1000;
const ATTENTION_INTERVAL_MS = TEN_MINUTES_MS;
const FIRST_ATTENTION_DELAY_MS = TEN_MINUTES_MS;

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
        <WhatsAppIcon size={28} />
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
