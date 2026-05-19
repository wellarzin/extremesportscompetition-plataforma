import * as RadixToast from '@radix-ui/react-toast';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useNotificationStore } from '@/stores/notificationStore';
import { cn } from '@/lib/utils';

export function ToastProvider() {
  const { toasts, removeToast } = useNotificationStore();

  const icons = {
    success: <CheckCircle size={18} className="text-emerald-400 shrink-0" />,
    error: <XCircle size={18} className="text-red-400 shrink-0" />,
    info: <Info size={18} className="text-extreme-royal shrink-0" />,
    warning: <AlertTriangle size={18} className="text-yellow-400 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-500/30',
    error: 'border-red-500/30',
    info: 'border-extreme-royal/30',
    warning: 'border-yellow-500/30',
  };

  return (
    <RadixToast.Provider swipeDirection="right">
      {toasts.map((toast) => (
        <RadixToast.Root
          key={toast.id}
          open={true}
          onOpenChange={(open) => {
            if (!open) removeToast(toast.id);
          }}
          className={cn(
            'glass-card rounded-xl p-4 flex items-start gap-3 max-w-sm w-full',
            'border',
            borderColors[toast.type],
            'data-[state=open]:animate-slide-up',
            'data-[state=closed]:animate-fade-in'
          )}
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <RadixToast.Title className="text-sm font-manrope font-semibold text-white">
              {toast.title}
            </RadixToast.Title>
            {toast.description && (
              <RadixToast.Description className="text-xs text-white/60 mt-0.5">
                {toast.description}
              </RadixToast.Description>
            )}
          </div>
          <RadixToast.Close
            onClick={() => removeToast(toast.id)}
            className="text-white/30 hover:text-white/60 transition-colors"
          >
            <X size={14} />
          </RadixToast.Close>
        </RadixToast.Root>
      ))}

      <RadixToast.Viewport className="fixed bottom-6 right-6 flex flex-col gap-2 z-[100] outline-none" />
    </RadixToast.Provider>
  );
}
