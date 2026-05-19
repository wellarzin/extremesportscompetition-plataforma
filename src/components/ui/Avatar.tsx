import * as RadixAvatar from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-xl',
  };

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <RadixAvatar.Root
      className={cn(
        'relative inline-flex shrink-0 overflow-hidden rounded-full ring-2 ring-white/10',
        sizes[size],
        className
      )}
    >
      <RadixAvatar.Image
        src={src}
        alt={name}
        className="aspect-square h-full w-full object-cover"
      />
      <RadixAvatar.Fallback
        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-extreme-royal to-extreme-orange text-white font-manrope font-bold"
        delayMs={600}
      >
        {initials}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
