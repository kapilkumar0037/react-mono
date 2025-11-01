import React from 'react';
import Button from '../Button/Button';
import type { ButtonProps } from '../Button/Button';

export type ButtonGroupSize = 'sm' | 'md' | 'lg';
export type ButtonGroupVariant = 'default' | 'outline' | 'ghost';
export type ButtonGroupOrientation = 'horizontal' | 'vertical';

export interface ButtonGroupContextValue {
  size?: ButtonGroupSize;
  variant?: ButtonGroupVariant;
  disabled?: boolean;
}

export const ButtonGroupContext = React.createContext<ButtonGroupContextValue>({});

export interface ButtonGroupItemProps extends Omit<ButtonProps, 'size' | 'variant'> {
  active?: boolean;
}

export const ButtonGroupItem: React.FC<ButtonGroupItemProps> = ({
  children,
  active,
  className = '',
  ...props
}) => {
  const context = React.useContext(ButtonGroupContext);

  return (
    <Button
      size={context.size}
      variant={context.variant}
      disabled={context.disabled || props.disabled}
      className={`
        rounded-none first:rounded-l-md last:rounded-r-md -ml-px first:ml-0
        relative hover:z-10 focus:z-10
        ${active ? 'z-10 ring-2 ring-primary ring-offset-2' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </Button>
  );
};

export interface ButtonGroupProps {
  children: React.ReactNode;
  size?: ButtonGroupSize;
  variant?: ButtonGroupVariant;
  disabled?: boolean;
  fullWidth?: boolean;
  orientation?: ButtonGroupOrientation;
  ariaLabel?: string;
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  size = 'md',
  variant = 'default',
  disabled = false,
  fullWidth = false,
  orientation = 'horizontal',
  ariaLabel,
  className = '',
}) => {
  const contextValue = React.useMemo(
    () => ({
      size,
      variant,
      disabled,
    }),
    [size, variant, disabled]
  );

  const isVertical = orientation === 'vertical';

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <div
        role="group"
        aria-label={ariaLabel}
        className={`
          inline-flex
          ${isVertical ? 'flex-col' : 'flex-row'}
          ${fullWidth ? 'w-full' : ''}
          shadow-sm
          ${className}
        `}
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;

          return React.cloneElement(child as React.ReactElement<ButtonGroupItemProps>, {
            className: `
              ${(child.props as ButtonGroupItemProps).className || ''}
              ${isVertical ? 'first:rounded-t-md first:rounded-b-none last:rounded-b-md last:rounded-t-none -mt-px first:mt-0' : ''}
            `,
          });
        })}
      </div>
    </ButtonGroupContext.Provider>
  );
};