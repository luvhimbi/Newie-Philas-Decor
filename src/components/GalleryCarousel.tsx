import { useState, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryCarouselProps {
  images: string[];
}

export default function GalleryCarousel({ images }: GalleryCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const total = images.length;
  const prefersReducedMotion = useReducedMotion();

  const changeSlide = useCallback((newIndex: number) => {
    setCurrent((prev) => {
      const next = (newIndex + total) % total;
      if (next === prev) return prev;
      const forward = next > prev ? next - prev : prev - next;
      const backward = total - forward;
      setDirection(forward <= backward ? 1 : -1);
      return next;
    });
  }, [total]);

  const prev = () => changeSlide(current - 1);
  const next = () => changeSlide(current + 1);

  const visibleThumbs = 7;
  const thumbStart = Math.max(0, Math.min(current - Math.floor(visibleThumbs / 2), total - visibleThumbs));
  const thumbEnd = Math.min(thumbStart + visibleThumbs, total);

  const slideVariants = {
    enter: (dir: number) => ({
      x: prefersReducedMotion ? 0 : dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: prefersReducedMotion ? 0 : dir > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  return (
    <div className="carousel">
      <div className="carousel-main">
        <motion.button
          className="carousel-btn carousel-btn-prev"
          onClick={prev}
          aria-label="Previous image"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={24} />
        </motion.button>

        <div className="carousel-frame">
          <div className="carousel-mat">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={current}
                src={images[current]}
                alt={`Decor setup ${current + 1}`}
                className="carousel-image"
                loading="lazy"
                decoding="async"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>
          </div>
        </div>

        <motion.button
          className="carousel-btn carousel-btn-next"
          onClick={next}
          aria-label="Next image"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>

      <div className="carousel-thumbs">
        {images.slice(thumbStart, thumbEnd).map((src, i) => {
          const index = thumbStart + i;
          return (
            <motion.button
              key={index}
              className={`carousel-thumb ${index === current ? 'active' : ''}`}
              onClick={() => changeSlide(index)}
              aria-label={`View image ${index + 1}`}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              layout
            >
              <img src={src} alt="" loading="lazy" decoding="async" />
            </motion.button>
          );
        })}
      </div>

      <div className="carousel-footer">
        <motion.span
          key={current}
          className="carousel-counter"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {current + 1} / {total}
        </motion.span>
      </div>
    </div>
  );
}
