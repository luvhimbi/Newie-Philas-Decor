import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE } from '../data/site';

const SPLASH_DURATION_MS = 3000;

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), SPLASH_DURATION_MS - 700);
    const doneTimer = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, SPLASH_DURATION_MS);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="splash"
      role="presentation"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="splash-curtain splash-curtain-left"
        animate={{ x: exiting ? '-100%' : '0%' }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="splash-curtain splash-curtain-right"
        animate={{ x: exiting ? '100%' : '0%' }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
      />

      <div className="splash-content">
        <motion.img
          src={SITE.logo}
          alt={SITE.name}
          className="splash-logo"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.div
          className="splash-divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.55 }}
        />

        <motion.h1
          className="splash-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.55 }}
        >
          {SITE.name}
        </motion.h1>

        <motion.p
          className="splash-tagline"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.45 }}
        >
          {SITE.tagline}
        </motion.p>

        <motion.div
          className="splash-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.35 }}
        >
          <span className="splash-loader-bar" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function SplashGate({ children }: { children: ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  const handleComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showSplash ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showSplash]);

  return (
    <>
      {!showSplash && children}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen key="splash" onComplete={handleComplete} />
        )}
      </AnimatePresence>
    </>
  );
}
