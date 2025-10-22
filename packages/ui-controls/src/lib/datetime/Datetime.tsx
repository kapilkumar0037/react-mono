import React, { forwardRef, useCallback } from 'react';

export interface DatetimeProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  /** ISO datetime string (e.g., "2025-10-22T15:30") */
  value?: string;
  /** Called when either date or time changes */
  onChange?: (value: string) => void;
  /** Text or elements to display as label */
  children?: React.ReactNode;
}

const Datetime = forwardRef<HTMLInputElement, DatetimeProps>(
  ({ className = '', children, value = '', onChange, disabled, ...props }, ref) => {
    // Split datetime into date and time parts
    const [datePart, timePart] = value ? value.split('T') : ['', ''];

    const handleDateChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!onChange) return;
        const newDate = e.target.value;
        const newDateTime = newDate && timePart 
          ? `${newDate}T${timePart}`
          : newDate;
        onChange(newDateTime);
      },
      [onChange, timePart]
    );

    const handleTimeChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!onChange) return;
        const newTime = e.target.value;
        const newDateTime = datePart && newTime 
          ? `${datePart}T${newTime}`
          : '';
        onChange(newDateTime);
      },
      [onChange, datePart]
    );

    const baseInputClass = `
      px-3 py-2 rounded border border-primary/20
      bg-background text-text
      focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-colors
      ${className}
    `.trim();

    return (
      <label className="inline-flex flex-col gap-1">
        {children && (
          <span className="text-sm text-text select-none">
            {children}
          </span>
        )}
        <div className="flex gap-2">
          <input
            {...props}
            type="date"
            ref={ref}
            value={datePart}
            onChange={handleDateChange}
            disabled={disabled}
            className={baseInputClass}
          />
          <input
            type="time"
            value={timePart}
            onChange={handleTimeChange}
            disabled={disabled}
            className={baseInputClass}
          />
        </div>
      </label>
    );
  }
);

Datetime.displayName = 'Datetime';

export default Datetime;
