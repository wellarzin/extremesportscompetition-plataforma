import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/50"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30',
              'focus:outline-none focus:border-extreme-royal/60 focus:bg-white/8 transition-all duration-200',
              'font-dm-sans',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500/60 focus:border-red-500/80',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
        {hint && !error && <p className="text-xs text-white/40 mt-0.5">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/50"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30',
            'focus:outline-none focus:border-extreme-royal/60 focus:bg-white/8 transition-all duration-200',
            'font-dm-sans resize-none',
            error && 'border-red-500/60',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
        {hint && !error && <p className="text-xs text-white/40 mt-0.5">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
