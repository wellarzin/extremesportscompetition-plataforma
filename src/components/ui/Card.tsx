import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'royal' | 'orange' | 'none';
  onClick?: () => void;
}

export function Card({ children, className, hover = false, glow = 'none', onClick }: CardProps) {
  const glowClasses = {
    royal: 'hover:shadow-royal',
    orange: 'hover:shadow-orange',
    none: '',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card rounded-2xl p-6',
        hover && 'transition-all duration-300 hover:-translate-y-1 cursor-pointer',
        glowClasses[glow],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-5', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('font-manrope font-semibold text-white text-base', className)}>
      {children}
    </h3>
  );
}
