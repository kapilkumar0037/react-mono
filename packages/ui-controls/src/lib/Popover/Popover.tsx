import React, { useEffect, useRef, useState } from 'react';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';
export type PopoverTrigger = 'click' | 'hover' | 'focus';

export interface PopoverProps {
  children: React.ReactElement; // the trigger element
  content: React.ReactNode; // content of the popover
  placement?: PopoverPlacement;
  trigger?: PopoverTrigger;
  open?: boolean; // controlled
  defaultOpen?: boolean; // uncontrolled
  onOpenChange?: (open: boolean) => void;
  className?: string;
  arrow?: boolean;
}

// simple utility to detect clicks outside element
function useClickOutside(refs: React.RefObject<HTMLElement>[], handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      const target = e.target as Node;
      if (refs.some(r => r.current && r.current.contains(target))) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [refs, handler]);
}

export const Popover: React.FC<PopoverProps> = ({
  children,
  content,
  placement = 'bottom',
  trigger = 'click',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className = '',
  arrow = true,
}) => {
  const [open, setOpen] = useState<boolean>(controlledOpen ?? defaultOpen);
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof controlledOpen === 'boolean') setOpen(controlledOpen);
  }, [controlledOpen]);

  const setOpenState = (next: boolean) => {
    if (controlledOpen === undefined) setOpen(next);
    onOpenChange?.(next);
  };

  useClickOutside([triggerRef as any, panelRef], () => setOpenState(false));

  // keyboard close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenState(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // cloning trigger to attach handlers
  const attachTriggerProps = (child: React.ReactElement<any>) => {
    const childElem = child as React.ReactElement<any>;
    const props: any = {};

    // attach ref without returning a value (avoid TS ref type mismatch)
    props.ref = (el: HTMLElement | null) => {
      triggerRef.current = el;
      const { ref } = childElem as any;
      if (typeof ref === 'function') ref(el);
      else if (ref && typeof ref === 'object') (ref as any).current = el;
    };

    if (trigger === 'click') {
      props.onClick = (e: any) => {
        childElem.props?.onClick?.(e);
        setOpenState(!open);
      };
    } else if (trigger === 'hover') {
      props.onMouseEnter = (e: any) => {
        childElem.props?.onMouseEnter?.(e);
        setOpenState(true);
      };
      props.onMouseLeave = (e: any) => {
        childElem.props?.onMouseLeave?.(e);
        setOpenState(false);
      };
    } else if (trigger === 'focus') {
      props.onFocus = (e: any) => {
        childElem.props?.onFocus?.(e);
        setOpenState(true);
      };
      props.onBlur = (e: any) => {
        childElem.props?.onBlur?.(e);
        setOpenState(false);
      };
    }

    return React.cloneElement(childElem, props);
  };

  // simple placement mapping to tailwind
  const placementMap: Record<PopoverPlacement, string> = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <span className="relative inline-block">
      {attachTriggerProps(children)}

      <div
        ref={el => { panelRef.current = el; }}
        role="dialog"
        aria-hidden={!open}
        className={`absolute z-50 ${placementMap[placement]} ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} transform transition-all duration-150 ${className}`}
      >
        {arrow && (
          <div className={`absolute ${placement === 'top' ? 'bottom-0 translate-y-full' : ''}`}>
            {/* simple CSS arrow using borders */}
            <div className="w-3 h-3 bg-white rotate-45 shadow-sm" />
          </div>
        )}

        <div className="bg-white shadow-md rounded p-3 text-sm text-gray-700">
          {content}
        </div>
      </div>
    </span>
  );
};

export default Popover;