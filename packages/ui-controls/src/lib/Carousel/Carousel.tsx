import React, { useState, useRef, useEffect, ReactNode } from 'react';

export interface CarouselProps {
  children: ReactNode[];
  className?: string;
  autoPlay?: boolean;
  interval?: number; // ms
  showIndicators?: boolean;
  showControls?: boolean;
  ariaLabel?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  className = '',
  autoPlay = false,
  interval = 4000,
  showIndicators = true,
  showControls = true,
  ariaLabel = 'carousel',
}) => {
  const [active, setActive] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const count = React.Children.count(children);

  useEffect(() => {
    if (!autoPlay || count < 2) return;
    timer.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % count);
    }, interval);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [active, autoPlay, interval, count]);

  const goTo = (idx: number) => setActive(idx);
  const prev = () => setActive((prev) => (prev - 1 + count) % count);
  const next = () => setActive((prev) => (prev + 1) % count);

  return (
    <div className={`relative w-full overflow-hidden ${className}`} aria-label={ariaLabel}>
      <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${active * 100}%)` }}>
        {React.Children.map(children, (child, idx) => (
          <div className="w-full flex-shrink-0" aria-hidden={active !== idx} key={idx}>
            {child}
          </div>
        ))}
      </div>
      {showControls && count > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
            onClick={prev}
            aria-label="Previous slide"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
            onClick={next}
            aria-label="Next slide"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}
      {showIndicators && count > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({ length: count }).map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full border-2 border-white bg-white/70 ${active === idx ? 'bg-blue-500' : ''}`}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={active === idx}
              onClick={() => goTo(idx)}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
};
