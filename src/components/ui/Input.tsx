import React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, placeholder, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-3">
        {label && (
          <label className="text-xl font-normal text-black">
            {label}
          </label>
        )}
        <input
          ref={ref}
          placeholder={placeholder}
          className={cn(
            // Layout
            'w-[722px] h-[82px]',
            // Styling
            'rounded-[29px]',
            'bg-transparent',
            'border border-black/34',
            'px-5',
            // Typography
            'text-base font-normal text-black',
            // Placeholder
            'placeholder-[#ADA2A2] placeholder-opacity-100',
            // Spacing and focus
            'focus:outline-none focus:ring-2 focus:ring-[#3783EC] focus:ring-opacity-58',
            // Transition
            'transition-all duration-200',
            error && 'border-red-500 border-2',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
