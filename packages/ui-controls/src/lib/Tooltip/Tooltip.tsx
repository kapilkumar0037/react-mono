import React, { useRef, useState } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: TooltipPlacement;
  className?: string;
  delay?: number; // ms
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  className = '',
  delay = 100,
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const id = useRef(`tooltip-${Math.random().toString(36).slice(2, 10)}`).current;

  const show = () => {
    if (disabled) return;
    timeoutRef.current = window.setTimeout(() => setVisible(true), delay);
  };
  const hide = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  // Placement classes
  const placementMap: Record<TooltipPlacement, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <span className="relative inline-block">
      {React.cloneElement(children, {
        onMouseEnter: (e: any) => {
          children.props.onMouseEnter?.(e);
          show();
        },
        onFocus: (e: any) => {
          children.props.onFocus?.(e);
          show();
        },
        onMouseLeave: (e: any) => {
          children.props.onMouseLeave?.(e);
          hide();
        },
        onBlur: (e: any) => {
          children.props.onBlur?.(e);
          hide();
        },
        'aria-describedby': visible ? id : undefined,
      })}
      <span
        id={id}
        role="tooltip"
        className={`
          pointer-events-none absolute z-50 px-2 py-1 rounded text-xs font-medium
          bg-gray-900 text-white shadow transition-opacity duration-150
          ${placementMap[placement]}
          ${visible ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
        style={{ whiteSpace: 'pre-line' }}
        aria-hidden={!visible}
      >
        {content}
      </span>
    </span>
  );
};

export default Tooltip;
