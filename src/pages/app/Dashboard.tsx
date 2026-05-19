import { Link } from 'react-router-dom';
import {
  Activity,
  Trophy,
  BarChart3,
  Calendar,
  ArrowRight,
  TrendingUp,
  Zap,
  User,
  ChevronRight,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { mockActivities, mockEvents, mockWeeklyGoal } from '@/data';
import { getActivityLabel, getModalityLabel, getPhaseLabel, formatDuration } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Dashboard() {
  const { currentUser } = useAuth();
  const userActivities = mockActivities
    .filter(a => a.userId === currentUser.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const upcomingEvents = mockEvents
    .filter(e => e.status === 'active')
    .slice(0, 3);

  const stats = [
    {
      label: 'Total de Atividades',
      value: currentUser.stats.totalActivities,
      change: '+12 essa semana',
      icon: <Activity size={20} />,
      color: 'royal',
    },
    {
      label: 'Pontos',
      value: currentUser.stats.totalPoints.toLocaleString('pt-BR'),
      change: '+340 essa semana',
      icon: <Zap size={20} />,
      color: 'orange',
    },
    {
      label: 'Posição no Ranking',
      value: `#${currentUser.stats.rankingPosition}`,
      change: '↑ 2 posições',
      icon: <TrendingUp size={20} />,
      color: 'royal',
    },
    {
      label: 'Conquistas',
      value: currentUser.stats.achievementsEarned,
      change: '3 em progresso',
      icon: <Trophy size={20} />,
      color: 'orange',
    },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar src={currentUser.avatar} name={currentUser.name} size="lg" />
          <div>
            <p className="text-white/50 text-sm font-dm-sans">{greeting},</p>
            <h1 className="font-manrope font-black text-2xl text-white">{currentUser.name.split(' ')[0]} 👋</h1>
            <p className="text-white/40 text-xs font-dm-sans mt-0.5">
              {currentUser.city}, {currentUser.state} · {currentUser.team ? 'São Paulo Warriors' : 'Sem time'}
            </p>
          </div>
        </div>
        <div className="hidden md:flex gap-3">
          <Link to="/app/activity/log">
            <Button variant="secondary" size="sm">
              <Activity size={16} />
              Registrar Atividade
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <div
              className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 ${
                stat.color === 'royal' ? 'bg-extreme-royal' : 'bg-extreme-orange'
              }`}
            />
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                stat.color === 'royal'
                  ? 'bg-extreme-royal/15 text-extreme-royal'
                  : 'bg-extreme-orange/15 text-extreme-orange'
              }`}
            >
              {stat.icon}
            </div>
            <p className="text-white/50 text-xs font-dm-sans mb-1">{stat.label}</p>
            <p className="font-manrope font-black text-2xl text-white mb-1">{stat.value}</p>
            <p className="text-xs text-white/40 font-dm-sans">{stat.change}</p>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <Link to="/app/activity/log">
                <Button variant="ghost" size="sm">
                  Ver todas <ChevronRight size={14} />
                </Button>
              </Link>
            </CardHeader>
            <div className="space-y-3">
              {userActivities.length === 0 ? (
                <div className="text-center py-8">
                  <Activity size={32} className="text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm font-dm-sans">Nenhuma atividade registrada ainda</p>
                  <Link to="/app/activity/log">
                    <Button variant="outline" size="sm" className="mt-4">
                      Registrar primeira atividade
                    </Button>
                  </Link>
                </div>
              ) : (
                userActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <Activity size={16} className="text-extreme-royal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-manrope font-semibold text-white truncate">{activity.name}</p>
                      <p className="text-xs text-white/40 font-dm-sans mt-0.5">
                        {getActivityLabel(activity.type)} · {formatDuration(activity.duration)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-manrope font-bold text-extreme-orange">+{activity.points}pts</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock size={10} className="text-white/30" />
                        <p className="text-[10px] text-white/30 font-dm-sans">
                          {formatDistanceToNow(new Date(activity.date), { locale: ptBR, addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div>
                      {activity.verified ? (
                        <CheckCircle size={14} className="text-emerald-400" />
                      ) : (
                        <Clock size={14} className="text-yellow-400" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar cards */}
        <div className="space-y-5">
          {/* Weekly goal */}
          <Card>
            <CardHeader>
              <CardTitle>Meta da Semana</CardTitle>
              <Badge variant="royal">
                {mockWeeklyGoal.current}/{mockWeeklyGoal.target}
              </Badge>
            </CardHeader>
            <p className="text-white/60 text-sm font-dm-sans mb-4">{mockWeeklyGoal.label}</p>
            <Progress value={mockWeeklyGoal.percentage} color="gradient" size="lg" />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-white/40 font-dm-sans">{mockWeeklyGoal.current} {mockWeeklyGoal.unit}</span>
              <span className="text-xs text-extreme-royal font-manrope font-semibold">{mockWeeklyGoal.percentage}%</span>
            </div>
            <div className="mt-4 p-3 bg-white/3 rounded-xl">
              <p className="text-xs text-white/50 font-dm-sans">
                🏆 Complete 5 treinos e desbloqueie a conquista <span className="text-extreme-orange">Semana de Ferro</span>
              </p>
            </div>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardTitle className="mb-4">Ações Rápidas</CardTitle>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Registrar', href: '/app/activity/log', icon: <Activity size={18} />, color: 'orange' },
                { label: 'Rankings', href: '/app/scoring', icon: <BarChart3 size={18} />, color: 'royal' },
                { label: 'Eventos', href: '/app/events', icon: <Calendar size={18} />, color: 'royal' },
                { label: 'Perfil', href: '/app/profile', icon: <User size={18} />, color: 'orange' },
              ].map(action => (
                <Link key={action.label} to={action.href}>
                  <div className={`p-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col items-center gap-2 ${
                    action.color === 'royal'
                      ? 'bg-extreme-royal/8 border-extreme-royal/20 hover:bg-extreme-royal/15'
                      : 'bg-extreme-orange/8 border-extreme-orange/20 hover:bg-extreme-orange/15'
                  }`}>
                    <span className={action.color === 'royal' ? 'text-extreme-royal' : 'text-extreme-orange'}>
                      {action.icon}
                    </span>
                    <span className="text-xs font-manrope font-semibold text-white">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Upcoming events */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
          <Link to="/app/events">
            <Button variant="ghost" size="sm">
              Ver todos <ChevronRight size={14} />
            </Button>
          </Link>
        </CardHeader>
        <div className="grid md:grid-cols-3 gap-4">
          {upcomingEvents.map((event) => (
            <Link key={event.id} to={`/app/events/${event.id}`}>
              <div className="p-4 rounded-xl bg-white/3 hover:bg-white/6 border border-white/6 hover:border-white/12 transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex gap-2 mb-3">
                  <Badge variant="royal" size="sm">{getModalityLabel(event.modality)}</Badge>
                  <Badge variant="orange" size="sm">{getPhaseLabel(event.phase)}</Badge>
                </div>
                <p className="font-manrope font-semibold text-white text-sm mb-1 line-clamp-2">{event.name}</p>
                <p className="text-xs text-white/40 font-dm-sans mb-3">
                  {format(new Date(event.date), "d 'de' MMM", { locale: ptBR })} · {event.city}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/40 font-dm-sans">
                    {event.maxTeams - event.registeredTeams} vagas restantes
                  </p>
                  <ArrowRight size={14} className="text-extreme-royal" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
