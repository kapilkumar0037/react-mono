import { forwardRef, InputHTMLAttributes } from 'react';

export interface RangeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  label?: string;
  showValue?: boolean;
}

export const Range = forwardRef<HTMLInputElement, RangeProps>(
  (
    {
      min = 0,
      max = 100,
      step = 1,
      value,
      onChange,
      className = '',
      label,
      showValue = false,
      ...props
    },
    ref
  ) => (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium mb-1">
          {label}
          {showValue && value !== undefined && (
            <span className="ml-2 text-xs text-gray-500">{value}</span>
          )}
        </label>
      )}
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
        {...props}
      />
    </div>
  )
);
Range.displayName = 'Range';
