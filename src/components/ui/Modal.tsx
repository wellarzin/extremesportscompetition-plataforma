import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Modal({ open, onOpenChange, title, description, children, size = 'md', className }: ModalProps) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full mx-4',
            'glass-card rounded-2xl shadow-2xl',
            'data-[state=open]:animate-slide-up',
            'focus:outline-none',
            sizes[size],
            className
          )}
        >
          {(title || description) && (
            <div className="flex items-start justify-between p-6 border-b border-white/8">
              <div>
                {title && (
                  <Dialog.Title className="font-manrope font-bold text-lg text-white">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="text-sm text-white/50 mt-1">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close className="text-white/40 hover:text-white transition-colors ml-4 mt-0.5">
                <X size={20} />
              </Dialog.Close>
            </div>
          )}
          <div className="p-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
