import { useState } from 'react';
import { Bell, Menu, X, Search } from 'lucide-react';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Topbar() {
  const { currentUser } = useAuth();
  const { notifications, markAllRead } = useNotificationStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="h-16 bg-extreme-dark/80 backdrop-blur-xl border-b border-white/6 flex items-center px-6 gap-4 sticky top-0 z-40">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-white/60 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Page title placeholder */}
        <div className="flex-1" />

        {/* Search */}
        <button className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/8 border border-white/8 rounded-xl text-sm text-white/40 hover:text-white/60 transition-all duration-150 font-dm-sans">
          <Search size={14} />
          <span>Buscar...</span>
          <kbd className="text-[10px] bg-white/8 px-1.5 py-0.5 rounded font-manrope">⌘K</kbd>
        </button>

        {/* Notifications */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="relative p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-150">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-extreme-orange rounded-full flex items-center justify-center text-[9px] font-manrope font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="w-80 glass-card rounded-2xl border border-white/10 shadow-2xl z-50 mr-2"
              sideOffset={8}
              align="end"
            >
              <div className="p-4 border-b border-white/8 flex items-center justify-between">
                <h3 className="text-sm font-manrope font-semibold text-white">Notificações</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-extreme-royal hover:text-extreme-royal-light transition-colors font-dm-sans"
                  >
                    Marcar todas lidas
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-white/40 text-center py-8 font-dm-sans">Nenhuma notificação</p>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'p-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors',
                        !n.read && 'bg-extreme-royal/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {!n.read && (
                          <div className="w-1.5 h-1.5 rounded-full bg-extreme-royal mt-1.5 shrink-0" />
                        )}
                        <div className={cn(!n.read ? '' : 'ml-4')}>
                          <p className="text-xs font-manrope font-semibold text-white">{n.title}</p>
                          <p className="text-xs text-white/50 mt-0.5 font-dm-sans">{n.message}</p>
                          <p className="text-[10px] text-white/30 mt-1">
                            {format(new Date(n.createdAt), "d 'de' MMM", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* User avatar */}
        <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
      </header>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 h-full">
            <Sidebar mobile onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
