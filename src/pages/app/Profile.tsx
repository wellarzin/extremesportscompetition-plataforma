import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Edit3,
  Save,
  Activity,
  Trophy,
  Calendar,
  Clock,
  Link as LinkIcon,
  CheckCircle,
  User,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useNotificationStore } from '@/stores/notificationStore';
import { mockAchievements, generateDailyActivityData } from '@/data';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const schema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  bio: z.string().max(200, 'Bio muito longa'),
  city: z.string().min(2, 'Cidade inválida'),
  age: z.number().min(14, 'Mínimo 14 anos').max(80, 'Máximo 80 anos'),
});

type FormData = z.infer<typeof schema>;

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-3 border border-white/10">
        <p className="text-xs text-white/60 font-dm-sans mb-1">{label}</p>
        <p className="text-sm font-manrope font-bold text-extreme-royal">{payload[0].value} atividades</p>
      </div>
    );
  }
  return null;
};

export function Profile() {
  const { currentUser, updateUser } = useAuth();
  const { addToast } = useNotificationStore();
  const [editing, setEditing] = useState(false);

  const activityData = generateDailyActivityData(currentUser.id);
  const unlockedAchievements = mockAchievements.filter(a => a.unlocked).slice(0, 6);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: currentUser.name,
      bio: currentUser.bio,
      city: currentUser.city,
      age: currentUser.age,
    },
  });

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 800));
    updateUser(data);
    setEditing(false);
    addToast({
      title: 'Perfil atualizado!',
      description: 'Suas informações foram salvas.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="font-manrope font-black text-3xl text-white mb-2">Perfil</h1>
        <p className="text-white/50 font-dm-sans">Gerencie suas informações e veja seu progresso</p>
      </div>

      {/* Profile hero */}
      <Card className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-extreme-royal/20 to-extreme-orange/20" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-extreme-royal/10 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
            <Avatar src={currentUser.avatar} name={currentUser.name} size="xl" />
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="font-manrope font-black text-2xl text-white">{currentUser.name}</h2>
                <Badge variant={currentUser.role === 'admin' ? 'orange' : 'royal'}>
                  {currentUser.role === 'admin' ? 'Admin' : 'Atleta'}
                </Badge>
              </div>
              <p className="text-white/50 text-sm font-dm-sans">{currentUser.bio}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-white/40 font-dm-sans">
                <span>{currentUser.city}, {currentUser.state}</span>
                <span>·</span>
                <span>{currentUser.age} anos</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(!editing)}
            >
              <Edit3 size={14} />
              {editing ? 'Cancelar' : 'Editar Perfil'}
            </Button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Atividades', value: currentUser.stats.totalActivities, icon: <Activity size={16} /> },
              { label: 'Horas', value: `${currentUser.stats.hoursTraining}h`, icon: <Clock size={16} /> },
              { label: 'Eventos', value: currentUser.stats.eventsParticipated, icon: <Calendar size={16} /> },
              { label: 'Pontos', value: currentUser.stats.totalPoints.toLocaleString('pt-BR'), icon: <Trophy size={16} /> },
              { label: 'Ranking', value: `#${currentUser.stats.rankingPosition}`, icon: <User size={16} /> },
              { label: 'Conquistas', value: currentUser.stats.achievementsEarned, icon: <Trophy size={16} /> },
            ].map((stat) => (
              <div key={stat.label} className="p-3 rounded-xl bg-white/4 text-center">
                <div className="flex justify-center mb-1 text-white/40">{stat.icon}</div>
                <p className="font-manrope font-bold text-lg text-white">{stat.value}</p>
                <p className="text-[10px] text-white/40 font-dm-sans">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Edit form */}
      {editing && (
        <Card>
          <CardTitle className="mb-5">Editar Perfil</CardTitle>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Nome completo"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Cidade"
                error={errors.city?.message}
                {...register('city')}
              />
            </div>
            <Input
              label="Idade"
              type="number"
              error={errors.age?.message}
              {...register('age', { valueAsNumber: true })}
            />
            <Textarea
              label="Bio"
              placeholder="Conte sobre você, sua modalidade e objetivos..."
              rows={3}
              error={errors.bio?.message}
              {...register('bio')}
            />
            <div className="flex gap-3">
              <Button type="submit" variant="primary" size="md">
                <Save size={16} /> Salvar Alterações
              </Button>
              <Button type="button" variant="ghost" size="md" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity chart */}
        <Card>
          <CardTitle className="mb-5">Atividade (30 dias)</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'DM Sans' }}
                interval={6}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'DM Sans' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="activities"
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={20}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4169E1" />
                  <stop offset="100%" stopColor="#FF6B00" stopOpacity={0.6} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Connected apps */}
        <Card>
          <CardTitle className="mb-5">Aplicativos Conectados</CardTitle>
          <div className="space-y-3">
            {[
              {
                name: 'Strava',
                description: 'Sincronize corridas, rides e nados',
                connected: currentUser.stravaConnected,
                color: '#FC4C02',
              },
              {
                name: 'Body Scan',
                description: 'Monitor de composição corporal',
                connected: currentUser.bodyScanConnected,
                color: '#4169E1',
              },
            ].map(app => (
              <div key={app.name} className="flex items-center gap-4 p-4 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${app.color}20` }}
                >
                  <LinkIcon size={18} style={{ color: app.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-manrope font-semibold text-white">{app.name}</p>
                  <p className="text-xs text-white/40 font-dm-sans">{app.description}</p>
                </div>
                {app.connected ? (
                  <Badge variant="green">
                    <CheckCircle size={10} /> Conectado
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm">
                    Conectar
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Conquistas Recentes</CardTitle>
          <Badge variant="royal">{currentUser.stats.achievementsEarned} desbloqueadas</Badge>
        </CardHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {unlockedAchievements.map(ach => (
            <div key={ach.id} className="p-3 rounded-xl bg-white/4 border border-white/6 text-center hover:border-extreme-royal/30 transition-colors">
              <p className="text-3xl mb-2">{ach.icon}</p>
              <p className="text-xs font-manrope font-semibold text-white leading-tight">{ach.name}</p>
              <p className="text-[10px] text-extreme-orange font-manrope mt-1">+{ach.points}pts</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
