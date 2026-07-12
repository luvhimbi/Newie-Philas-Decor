import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const defaultTransition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

interface FadeUpProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  animateOnView?: boolean;
}

export function FadeUp({ children, delay = 0, animateOnView = true, className, ...props }: FadeUpProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={animateOnView ? undefined : 'visible'}
      whileInView={animateOnView ? 'visible' : undefined}
      viewport={animateOnView ? { once: true, margin: '-60px' } : undefined}
      variants={fadeUp}
      transition={{ ...defaultTransition, delay }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  animateOnView?: boolean;
}

export function Stagger({ children, animateOnView = true, className, ...props }: StaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={animateOnView ? undefined : 'visible'}
      whileInView={animateOnView ? 'visible' : undefined}
      viewport={animateOnView ? { once: true, margin: '-60px' } : undefined}
      variants={stagger}
    >
      {children}
    </motion.div>
  );
}

type MotionItemProps = {
  as?: 'div' | 'a';
  children: ReactNode;
  className?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement> &
  HTMLAttributes<HTMLDivElement>;

export function MotionItem({ as = 'div', children, className, ...props }: MotionItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (as === 'a') {
    const { href, target, rel } = props;
    if (prefersReducedMotion) {
      return (
        <a className={className} href={href} target={target} rel={rel}>
          {children}
        </a>
      );
    }
    return (
      <motion.a
        className={className}
        href={href}
        target={target}
        rel={rel}
        variants={fadeUp}
        transition={defaultTransition}
        whileHover={{ y: -4 }}
      >
        {children}
      </motion.a>
    );
  }

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={fadeUp} transition={defaultTransition}>
      {children}
    </motion.div>
  );
}
