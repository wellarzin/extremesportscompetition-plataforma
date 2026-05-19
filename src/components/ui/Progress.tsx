import * as RadixProgress from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number; // 0-100
  className?: string;
  indicatorClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'royal' | 'orange' | 'gradient' | 'green';
}

export function Progress({ value, className, indicatorClassName, size = 'md', color = 'royal' }: ProgressProps) {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colors = {
    royal: 'bg-extreme-royal',
    orange: 'bg-extreme-orange',
    gradient: 'bg-gradient-to-r from-extreme-royal to-extreme-orange',
    green: 'bg-emerald-500',
  };

  return (
    <RadixProgress.Root
      className={cn(
        'relative overflow-hidden rounded-full bg-white/8',
        sizes[size],
        className
      )}
      value={value}
    >
      <RadixProgress.Indicator
        className={cn(
          'h-full rounded-full transition-all duration-700 ease-out',
          colors[color],
          indicatorClassName
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </RadixProgress.Root>
  );
}
