import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const GalleryCarousel = lazy(() => import('./GalleryCarousel'));

interface LazyGalleryCarouselProps {
  images: string[];
}

export default function LazyGalleryCarousel({ images }: LazyGalleryCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="carousel-placeholder-wrap">
      {visible ? (
        <Suspense fallback={<div className="carousel-placeholder" aria-hidden="true" />}>
          <GalleryCarousel images={images} />
        </Suspense>
      ) : (
        <div className="carousel-placeholder" aria-hidden="true" />
      )}
    </div>
  );
}
