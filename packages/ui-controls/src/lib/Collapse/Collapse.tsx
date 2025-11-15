import React, { useRef, useEffect, useState } from 'react';

export interface CollapseProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  duration?: number; // ms
  id?: string;
  'aria-labelledby'?: string;
}

/**
 * Collapse component for show/hide content with smooth height animation.
 *
 * Usage:
 * <Collapse isOpen={open}>
 *   <div>Content</div>
 * </Collapse>
 */
export const Collapse: React.FC<CollapseProps> = ({
  isOpen,
  children,
  className = '',
  duration = 250,
  id,
  'aria-labelledby': ariaLabelledby,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string | undefined>(isOpen ? 'auto' : '0px');
  const [overflow, setOverflow] = useState('hidden');

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (isOpen) {
      setHeight(`${el.scrollHeight}px`);
      setOverflow('hidden');
      const timeout = setTimeout(() => {
        setHeight('auto');
        setOverflow('visible');
      }, duration);
      return () => clearTimeout(timeout);
    } else {
      if (el.scrollHeight !== 0) {
        setHeight(`${el.scrollHeight}px`);
        setOverflow('hidden');
        // Force reflow for transition
        void el.offsetHeight;
      }
      setTimeout(() => setHeight('0px'), 10);
      return undefined;
    }
  }, [isOpen, duration]);

  return (
    <div
      ref={ref}
      id={id}
      aria-labelledby={ariaLabelledby}
      aria-hidden={!isOpen}
      style={{
        height,
        overflow,
        transition: `height ${duration}ms cubic-bezier(0.4,0,0.2,1)`,
      }}
      className={className}
    >
      <div className="w-full">{children}</div>
    </div>
  );
};
