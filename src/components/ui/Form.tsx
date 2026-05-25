import React from 'react';
import type { ReactNode } from 'react';
import { LAYOUT } from '@/constants/designTokens';
import { cn } from '@/utils/cn';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
  children: ReactNode;
}

/**
 * Form Component
 * 
 * Wrapper component that applies design system spacing and layout rules
 * Automatically applies:
 * - 75px margin below title (TITLE_TO_CONTENT)
 * - 47px gap between form elements (ELEMENT_SPACING)
 * - 1440px max width (LAYOUT.FRAME_WIDTH)
 */
export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ title, description, children, className, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn(
          'w-full flex flex-col',
          'mx-auto',
          className
        )}
        style={{
          maxWidth: `${LAYOUT.FRAME_WIDTH}px`,
        }}
        {...props}
      >
        {title && (
          <div className="mb-[75px]">
            <h1 className="text-4xl font-bold text-black mb-2">
              {title}
            </h1>
            {description && (
              <p className="text-xl font-normal text-gray-600">
                {description}
              </p>
            )}
          </div>
        )}
        
        <div className="flex flex-col gap-[47px]">
          {children}
        </div>
      </form>
    );
  }
);

Form.displayName = 'Form';

// ========================================
// Form Group Component
// ========================================
interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

export const FormGroup = ({ children, className }: FormGroupProps) => {
  return (
    <div className={cn('flex flex-col', className)}>
      {children}
    </div>
  );
};

// ========================================
// Form Row Component
// ========================================
interface FormRowProps {
  children: ReactNode;
  className?: string;
}

export const FormRow = ({ children, className }: FormRowProps) => {
  return (
    <div className={cn('flex gap-6 flex-wrap', className)}>
      {children}
    </div>
  );
};

// ========================================
// Form Actions Component (For Buttons)
// ========================================
interface FormActionsProps {
  children: ReactNode;
  className?: string;
  justify?: 'start' | 'center' | 'end' | 'between';
}

export const FormActions = ({
  children,
  className,
  justify = 'center',
}: FormActionsProps) => {
  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={cn(
        'flex gap-4',
        justifyMap[justify],
        className
      )}
    >
      {children}
    </div>
  );
};
