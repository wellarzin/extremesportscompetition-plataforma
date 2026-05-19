import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Activity,
  User,
  Trophy,
  BarChart3,
  Scan,
  ChevronRight,
  Shield,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const athleteNav: NavItem[] = [
  { label: 'Dashboard', href: '/app/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Eventos', href: '/app/events', icon: <Calendar size={18} /> },
  { label: 'Registrar', href: '/app/activity/log', icon: <Activity size={18} /> },
  { label: 'Pontuação', href: '/app/scoring', icon: <BarChart3 size={18} /> },
  { label: 'Conquistas', href: '/app/achievements', icon: <Trophy size={18} /> },
  { label: 'Body Scan', href: '/app/body-scan', icon: <Scan size={18} /> },
  { label: 'Perfil', href: '/app/profile', icon: <User size={18} /> },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: 'Eventos', href: '/admin/events', icon: <Calendar size={18} /> },
  { label: 'Atletas', href: '/admin/athletes', icon: <Users size={18} /> },
  { label: 'Apuração', href: '/admin/scoring', icon: <BarChart3 size={18} /> },
];

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobile = false, onClose }: SidebarProps) {
  const { currentUser, isAdmin, switchRole } = useAuth();
  const navigate = useNavigate();
  const navItems = isAdmin ? adminNav : athleteNav;

  const handleRoleSwitch = () => {
    const newRole = isAdmin ? 'athlete' : 'admin';
    switchRole(newRole);
    navigate(newRole === 'admin' ? '/admin' : '/app/dashboard');
    onClose?.();
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-extreme-dark border-r border-white/6',
        mobile ? 'w-full' : 'w-64'
      )}
    >
      {/* Brand */}
      <div className="p-6 border-b border-white/6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-extreme-royal to-extreme-orange flex items-center justify-center">
            <span className="text-white font-manrope font-black text-sm">X</span>
          </div>
          <div>
            <p className="font-manrope font-bold text-white text-sm leading-tight">Extreme Sports</p>
            <p className="text-[10px] text-white/40 font-dm-sans uppercase tracking-wider">Plataforma</p>
          </div>
        </div>
      </div>

      {/* Role badge */}
      {isAdmin && (
        <div className="mx-4 mt-4 px-3 py-2 rounded-lg bg-extreme-orange/10 border border-extreme-orange/20 flex items-center gap-2">
          <Shield size={14} className="text-extreme-orange" />
          <span className="text-xs font-manrope font-semibold text-extreme-orange">Modo Admin</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/admin'}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-dm-sans transition-all duration-150',
                isActive
                  ? 'bg-extreme-royal/15 text-extreme-royal border border-extreme-royal/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-extreme-royal' : 'text-white/40'}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={14} className="text-extreme-royal/60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/6 space-y-2">
        {/* Role switcher */}
        <button
          onClick={handleRoleSwitch}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all duration-150 font-dm-sans"
        >
          <Settings size={16} />
          <span>{isAdmin ? 'Ver como Atleta' : 'Painel Admin'}</span>
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-manrope font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-white/40 truncate">{currentUser.email}</p>
          </div>
          <LogOut size={14} className="text-white/30 cursor-pointer hover:text-white/60 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
