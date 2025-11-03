import React, { useEffect } from 'react';

export type OffCanvasPlacement = 'left' | 'right' | 'top' | 'bottom';
export type OffCanvasSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface OffCanvasProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  placement?: OffCanvasPlacement;
  size?: OffCanvasSize;
  backdrop?: boolean;
  className?: string;
  /** Optional header text or component */
  header?: React.ReactNode;
  /** If true, pressing Escape will not close the offcanvas */
  disableEscapeKey?: boolean;
  /** If true, clicking the backdrop will not close the offcanvas */
  disableBackdropClick?: boolean;
}

const placementStyles: Record<OffCanvasPlacement, string> = {
  left: '-translate-x-full',
  right: 'translate-x-full',
  top: '-translate-y-full',
  bottom: 'translate-y-full'
};

const placementClasses: Record<OffCanvasPlacement, string> = {
  left: 'left-0 top-0 h-full border-r',
  right: 'right-0 top-0 h-full border-l',
  top: 'top-0 left-0 w-full border-b',
  bottom: 'bottom-0 left-0 w-full border-t'
};

const sizeClasses: Record<OffCanvasPlacement, Record<OffCanvasSize, string>> = {
  left: {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
    xl: 'w-[32rem]',
    full: 'w-screen'
  },
  right: {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
    xl: 'w-[32rem]',
    full: 'w-screen'
  },
  top: {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
    xl: 'h-96',
    full: 'h-screen'
  },
  bottom: {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
    xl: 'h-96',
    full: 'h-screen'
  }
};

export const OffCanvas: React.FC<OffCanvasProps> = ({
  children,
  isOpen,
  onClose,
  placement = 'right',
  size = 'md',
  backdrop = true,
  className = '',
  header,
  disableEscapeKey = false,
  disableBackdropClick = false,
}) => {
  // Handle escape key
  useEffect(() => {
    if (disableEscapeKey) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, disableEscapeKey]);

  // Handle body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!disableBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && backdrop && (
        <div
          className={`
            fixed inset-0 bg-black/50 z-40
            transition-opacity duration-300 ease
            ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Off-canvas panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={`
          fixed z-50 bg-white shadow-xl
          transition-transform duration-300 ease-in-out
          ${placementClasses[placement]}
          ${sizeClasses[placement][size]}
          ${isOpen ? 'translate-x-0 translate-y-0' : placementStyles[placement]}
          ${className}
        `}
      >
        {/* Header */}
        {header && (
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="text-lg font-semibold">{header}</div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Close panel"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export default OffCanvas;