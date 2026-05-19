import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  AlertCircle,
  DollarSign,
  Plus,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockUsers, mockEvents, pendingValidations } from '@/data';
import { getModalityLabel, getPhaseLabel, formatCurrency } from '@/lib/utils';

export function AdminDashboard() {
  const totalAthletes = mockUsers.filter(u => u.role === 'athlete').length;
  const activeEvents = mockEvents.filter(e => e.status === 'active' || e.status === 'ongoing').length;
  const pendingCount = pendingValidations.length;
  const totalRevenue = mockEvents.reduce((sum, e) => sum + e.prizePool * 0.1, 0);

  const kpis = [
    {
      label: 'Total de Atletas',
      value: totalAthletes,
      change: '+23 esse mês',
      icon: <Users size={22} />,
      color: 'royal',
    },
    {
      label: 'Eventos Ativos',
      value: activeEvents,
      change: `${mockEvents.filter(e => e.status === 'ongoing').length} em andamento`,
      icon: <Calendar size={22} />,
      color: 'orange',
    },
    {
      label: 'Validações Pendentes',
      value: pendingCount,
      change: 'Ação necessária',
      icon: <AlertCircle size={22} />,
      color: pendingCount > 0 ? 'red' : 'royal',
    },
    {
      label: 'Taxa de Administração',
      value: formatCurrency(totalRevenue),
      change: '+12% vs. mês anterior',
      icon: <DollarSign size={22} />,
      color: 'royal',
    },
  ];

  const recentActivity = [
    { type: 'registration', text: 'Santos Sharks se inscreveu em Campeonato SP 2025', time: '5 min atrás', icon: '📋' },
    { type: 'result', text: 'Resultado enviado: Diego Nascimento — 400m 55.3s', time: '32 min atrás', icon: '⏱️' },
    { type: 'athlete', text: 'Nova atleta cadastrada: Vanessa Torres (Natal, RN)', time: '1h atrás', icon: '👤' },
    { type: 'validation', text: 'Resultado validado: João Silva — 100m 10.94s', time: '2h atrás', icon: '✅' },
    { type: 'event', text: 'Evento publicado: Desafio CrossFit Nordeste 2025', time: '3h atrás', icon: '📅' },
    { type: 'achievement', text: 'Conquista desbloqueada: Patricia Freitas — 100 Atividades', time: '4h atrás', icon: '🏆' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-manrope font-black text-3xl text-white mb-1">Painel Administrativo</h1>
          <p className="text-white/50 font-dm-sans">Visão geral da plataforma</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/events">
            <Button variant="secondary" size="sm">
              <Plus size={16} />
              Criar Evento
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="relative overflow-hidden">
            <div
              className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 ${
                kpi.color === 'royal' ? 'bg-extreme-royal' :
                kpi.color === 'orange' ? 'bg-extreme-orange' : 'bg-red-500'
              }`}
            />
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                kpi.color === 'royal' ? 'bg-extreme-royal/15 text-extreme-royal' :
                kpi.color === 'orange' ? 'bg-extreme-orange/15 text-extreme-orange' :
                'bg-red-500/15 text-red-400'
              }`}
            >
              {kpi.icon}
            </div>
            <p className="text-white/50 text-xs font-dm-sans mb-1">{kpi.label}</p>
            <p className="font-manrope font-black text-2xl text-white mb-1">{kpi.value}</p>
            <p className="text-xs text-white/40 font-dm-sans">{kpi.change}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending validations alert */}
        <div className="lg:col-span-2 space-y-5">
          {pendingCount > 0 && (
            <Card className="border border-yellow-500/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle size={18} className="text-yellow-400" />
                  <CardTitle>Validações Pendentes</CardTitle>
                  <Badge variant="yellow">{pendingCount}</Badge>
                </div>
                <Link to="/admin/scoring">
                  <Button variant="outline" size="sm">
                    Ver todas <ArrowRight size={14} />
                  </Button>
                </Link>
              </CardHeader>
              <div className="space-y-3">
                {pendingValidations.slice(0, 3).map(pv => (
                  <div key={pv.id} className="flex items-center gap-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/15">
                    <Clock size={16} className="text-yellow-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-manrope font-semibold text-white">
                        {pv.athleteName} — {pv.prova}: {pv.time}
                      </p>
                      <p className="text-xs text-white/40 font-dm-sans">{pv.team} · {pv.event}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {pv.hasVideo && (
                        <Badge variant="royal" size="sm">Vídeo</Badge>
                      )}
                      <Link to="/admin/scoring">
                        <Button variant="outline" size="sm">Validar</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Events overview */}
          <Card>
            <CardHeader>
              <CardTitle>Eventos</CardTitle>
              <Link to="/admin/events">
                <Button variant="ghost" size="sm">
                  Gerenciar <ArrowRight size={14} />
                </Button>
              </Link>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th>Modalidade</th>
                    <th>Fase</th>
                    <th>Times</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockEvents.slice(0, 6).map(event => (
                    <tr key={event.id}>
                      <td className="font-manrope font-semibold text-white max-w-[200px] truncate">
                        {event.name.split('—')[0].trim()}
                      </td>
                      <td>{getModalityLabel(event.modality)}</td>
                      <td>
                        <Badge
                          variant={event.phase === 'final' ? 'gradient' : event.phase === 'nacional' ? 'orange' : 'royal'}
                          size="sm"
                        >
                          {getPhaseLabel(event.phase)}
                        </Badge>
                      </td>
                      <td className="text-white/60">
                        {event.registeredTeams}/{event.maxTeams}
                      </td>
                      <td>
                        <Badge
                          variant={
                            event.status === 'active' ? 'green' :
                            event.status === 'ongoing' ? 'yellow' :
                            event.status === 'finished' ? 'gray' : 'gray'
                          }
                          size="sm"
                        >
                          {event.status === 'active' ? 'Ativo' :
                           event.status === 'ongoing' ? 'Em Andamento' :
                           event.status === 'finished' ? 'Finalizado' : 'Rascunho'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Activity feed */}
        <Card>
          <CardTitle className="mb-5">Atividade Recente</CardTitle>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex gap-3 p-2 rounded-xl hover:bg-white/3 transition-colors">
                <span className="text-lg mt-0.5 shrink-0">{item.icon}</span>
                <div>
                  <p className="text-xs font-dm-sans text-white/70 leading-relaxed">{item.text}</p>
                  <p className="text-[10px] text-white/30 font-dm-sans mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardTitle className="mb-4">Ações Rápidas</CardTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Criar Evento', href: '/admin/events', icon: <Plus size={20} />, color: 'orange' },
            { label: 'Validar Resultados', href: '/admin/scoring', icon: <CheckCircle size={20} />, color: 'royal' },
            { label: 'Gerenciar Atletas', href: '/admin/athletes', icon: <Users size={20} />, color: 'royal' },
            { label: 'Ver Rankings', href: '/app/scoring', icon: <TrendingUp size={20} />, color: 'orange' },
          ].map(action => (
            <Link key={action.label} to={action.href}>
              <div className={`p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col items-center gap-2.5 ${
                action.color === 'royal'
                  ? 'bg-extreme-royal/8 border-extreme-royal/20 hover:bg-extreme-royal/15'
                  : 'bg-extreme-orange/8 border-extreme-orange/20 hover:bg-extreme-orange/15'
              }`}>
                <span className={action.color === 'royal' ? 'text-extreme-royal' : 'text-extreme-orange'}>
                  {action.icon}
                </span>
                <span className="text-xs font-manrope font-semibold text-white text-center">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
