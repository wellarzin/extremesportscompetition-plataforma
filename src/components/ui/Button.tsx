import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-manrope font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-extreme-royal focus-visible:ring-offset-2 focus-visible:ring-offset-extreme-black disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
      primary: 'bg-extreme-royal hover:bg-extreme-royal-light text-white shadow-royal hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
      secondary: 'bg-extreme-orange hover:bg-extreme-orange-light text-white shadow-orange hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
      ghost: 'bg-transparent hover:bg-white/5 text-white/70 hover:text-white border border-transparent hover:border-white/10',
      outline: 'bg-transparent border border-white/15 text-white hover:bg-white/5 hover:border-white/25',
      danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 hover:border-red-600/50',
      gradient: 'bg-gradient-to-r from-extreme-royal to-extreme-orange text-white hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 shadow-lg',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3.5 text-base',
      xl: 'px-10 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Carregando...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
