import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'royal' | 'orange' | 'green' | 'red' | 'yellow' | 'gray' | 'gradient';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'gray', size = 'md', className }: BadgeProps) {
  const variants = {
    royal: 'bg-extreme-royal/15 text-extreme-royal border border-extreme-royal/25',
    orange: 'bg-extreme-orange/15 text-extreme-orange border border-extreme-orange/25',
    green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    red: 'bg-red-500/15 text-red-400 border border-red-500/25',
    yellow: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25',
    gray: 'bg-white/8 text-white/60 border border-white/12',
    gradient: 'bg-gradient-to-r from-extreme-royal/20 to-extreme-orange/20 text-white border border-extreme-royal/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-manrope font-semibold tracking-wide',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
