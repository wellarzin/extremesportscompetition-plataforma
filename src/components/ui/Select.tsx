import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({ value, onValueChange, options, placeholder = 'Selecionar...', label, error, disabled, className }: SelectProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/50">
          {label}
        </label>
      )}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          className={cn(
            'flex w-full items-center justify-between gap-2',
            'bg-white/5 border border-white/10 rounded-xl px-4 py-3',
            'text-sm font-dm-sans text-white',
            'focus:outline-none focus:border-extreme-royal/60',
            'data-[placeholder]:text-white/30',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500/60'
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown size={16} className="text-white/40" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-50 min-w-[160px] overflow-hidden rounded-xl bg-extreme-gray border border-white/10 shadow-2xl"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    'relative flex items-center gap-2 px-3 py-2.5 text-sm text-white/80 rounded-lg',
                    'cursor-pointer select-none outline-none',
                    'data-[highlighted]:bg-white/8 data-[highlighted]:text-white',
                    'data-[state=checked]:text-extreme-royal'
                  )}
                >
                  <RadixSelect.ItemIndicator>
                    <Check size={14} />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}
