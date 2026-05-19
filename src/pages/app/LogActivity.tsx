import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Activity,
  Link as LinkIcon,
  CheckCircle,
  Upload,
  Clock,
  Repeat,
  Zap,
  ChevronRight,
  Star,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/hooks/useAuth';
import { useActivityStore } from '@/stores/activityStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { movements } from '@/data';
import { getActivityLabel, formatDuration } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ActivityType } from '@/types';

const schema = z.object({
  type: z.string().min(1, 'Selecione o tipo de movimento'),
  name: z.string().min(3, 'Nome muito curto').max(60, 'Nome muito longo'),
  duration: z.number().min(1, 'Duração mínima de 1 minuto').max(600, 'Máximo de 600 minutos'),
  reps: z.number().optional(),
  sets: z.number().optional(),
  distance: z.number().optional(),
  notes: z.string().max(500).optional(),
});

type FormData = z.infer<typeof schema>;

// Mocked Strava activities
const stravaActivities = [
  {
    id: 's1',
    name: 'Corrida Matinal',
    type: 'Run',
    distance: 9.8,
    duration: 55,
    pace: '5:37/km',
    date: '2025-05-18',
    heart_rate: 148,
  },
  {
    id: 's2',
    name: 'Treino de Velocidade',
    type: 'Run',
    distance: 5.2,
    duration: 28,
    pace: '5:23/km',
    date: '2025-05-16',
    heart_rate: 165,
  },
  {
    id: 's3',
    name: 'Recovery Ride',
    type: 'Ride',
    distance: 25.4,
    duration: 62,
    pace: '24.6km/h',
    date: '2025-05-14',
    heart_rate: 132,
  },
];

export function LogActivity() {
  const { currentUser } = useAuth();
  const { addActivity, getActivitiesForUser, isLoading } = useActivityStore();
  const { addToast } = useNotificationStore();
  const [stravaConnected, setStravaConnected] = useState(currentUser.stravaConnected);
  const [stravaLoading, setStravaLoading] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<typeof movements[0] | null>(null);
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [importedStrava, setImportedStrava] = useState<string[]>([]);

  const userActivities = getActivitiesForUser(currentUser.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { duration: 30 },
  });

  const watchedType = watch('type');

  const onMovementSelect = (type: string) => {
    const mov = movements.find(m => m.type === type);
    setSelectedMovement(mov || null);
  };

  const onSubmit = async (data: FormData) => {
    const mov = movements.find(m => m.type === data.type);
    const points = Math.round((data.reps || data.distance || data.duration) * (mov?.pointsPerUnit || 1));

    await addActivity({
      userId: currentUser.id,
      type: data.type as ActivityType,
      name: data.name,
      duration: data.duration,
      reps: data.reps,
      sets: data.sets,
      distance: data.distance,
      notes: data.notes,
      date: new Date().toISOString().split('T')[0],
      points,
      source: 'manual',
      videoUrl: videoFile || undefined,
    });

    addToast({
      title: 'Atividade registrada!',
      description: `${data.name} adicionada com sucesso. +${points} pontos`,
      type: 'success',
    });

    reset();
    setSelectedMovement(null);
    setVideoFile(null);
  };

  const connectStrava = async () => {
    setStravaLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setStravaConnected(true);
    setStravaLoading(false);
    addToast({
      title: 'Strava conectado!',
      description: 'Suas atividades serão sincronizadas automaticamente.',
      type: 'success',
    });
  };

  const importStravaActivity = (id: string) => {
    setImportedStrava(prev => [...prev, id]);
    addToast({
      title: 'Atividade importada!',
      description: 'Atividade do Strava adicionada ao seu perfil.',
      type: 'success',
    });
  };

  const difficultyStars = (level: number) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={10}
          className={i < level ? 'text-extreme-orange fill-extreme-orange' : 'text-white/20'}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="font-manrope font-black text-3xl text-white mb-2">Registrar Atividade</h1>
        <p className="text-white/50 font-dm-sans">Registre seus treinos manualmente ou importe do Strava.</p>
      </div>

      {/* Strava section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FC4C02]/15 flex items-center justify-center">
              <Activity size={20} className="text-[#FC4C02]" />
            </div>
            <div>
              <CardTitle>Strava Integration</CardTitle>
              <p className="text-xs text-white/40 font-dm-sans mt-0.5">
                {stravaConnected ? 'Conectado e sincronizando' : 'Conecte para sincronizar automaticamente'}
              </p>
            </div>
          </div>
          {stravaConnected ? (
            <Badge variant="green">
              <CheckCircle size={12} /> Conectado
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={connectStrava}
              loading={stravaLoading}
            >
              <LinkIcon size={14} />
              Conectar Strava
            </Button>
          )}
        </CardHeader>

        {stravaConnected && (
          <div>
            <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/40 mb-3">
              Atividades Recentes do Strava
            </p>
            <div className="space-y-3">
              {stravaActivities.map(act => (
                <div
                  key={act.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FC4C02]/15 flex items-center justify-center shrink-0">
                    <Activity size={18} className="text-[#FC4C02]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-manrope font-semibold text-white">{act.name}</p>
                    <p className="text-xs text-white/40 font-dm-sans">
                      {act.type} · {act.distance}km · {act.duration}min · {act.pace}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-white/40 font-dm-sans mb-1">
                      {format(new Date(act.date), "d 'de' MMM", { locale: ptBR })}
                    </p>
                    {importedStrava.includes(act.id) ? (
                      <Badge variant="green" size="sm">
                        <CheckCircle size={10} /> Importado
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => importStravaActivity(act.id)}
                      >
                        Importar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardTitle className="mb-6">Registro Manual</CardTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Movement type */}
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Tipo de Movimento"
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      onMovementSelect(v);
                    }}
                    options={movements.map(m => ({ value: m.type, label: m.name }))}
                    error={errors.type?.message}
                    placeholder="Selecionar movimento..."
                  />
                )}
              />

              {/* Selected movement info */}
              {selectedMovement && (
                <div className="p-4 rounded-xl bg-extreme-royal/8 border border-extreme-royal/20">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-manrope font-semibold text-extreme-royal">{selectedMovement.name}</p>
                    {difficultyStars(selectedMovement.difficulty)}
                  </div>
                  <p className="text-xs text-white/50 font-dm-sans">{selectedMovement.description}</p>
                  <div className="flex gap-4 mt-3 text-xs text-white/40 font-dm-sans">
                    <span>Categoria: {selectedMovement.category}</span>
                    <span>Pontos/{selectedMovement.unitLabel}: {selectedMovement.pointsPerUnit}</span>
                  </div>
                </div>
              )}

              {/* Name */}
              <Input
                label="Nome da Atividade"
                placeholder="Ex: Treino de 800m / AMRAP 20min Burpees"
                error={errors.name?.message}
                {...register('name')}
              />

              <div className="grid grid-cols-3 gap-4">
                {/* Duration */}
                <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Duração (min)"
                      type="number"
                      leftIcon={<Clock size={14} />}
                      placeholder="30"
                      error={errors.duration?.message}
                      value={field.value}
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  )}
                />

                {/* Reps */}
                {selectedMovement?.unit === 'reps' && (
                  <Controller
                    name="reps"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Repetições"
                        type="number"
                        leftIcon={<Repeat size={14} />}
                        placeholder={String(selectedMovement.tipicalReps || 10)}
                        value={field.value ?? ''}
                        onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                      />
                    )}
                  />
                )}

                {/* Sets */}
                {selectedMovement?.unit === 'reps' && (
                  <Controller
                    name="sets"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Séries"
                        type="number"
                        placeholder="5"
                        value={field.value ?? ''}
                        onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                      />
                    )}
                  />
                )}

                {/* Distance */}
                {selectedMovement?.unit === 'distance' && (
                  <Controller
                    name="distance"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Distância (m)"
                        type="number"
                        placeholder="5000"
                        value={field.value ?? ''}
                        onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                      />
                    )}
                  />
                )}
              </div>

              {/* Notes */}
              <Textarea
                label="Observações"
                placeholder="Descreva o treino, tempos, sensações..."
                rows={3}
                {...register('notes')}
              />

              {/* Video upload mock */}
              <div>
                <label className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/50 mb-2 block">
                  Vídeo de Prova (opcional)
                </label>
                {videoFile ? (
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <CheckCircle size={18} className="text-emerald-400" />
                    <div>
                      <p className="text-sm font-manrope font-semibold text-emerald-400">Video.mp4</p>
                      <p className="text-xs text-white/40 font-dm-sans">Prova de atividade anexada</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVideoFile(null)}
                      className="ml-auto text-white/30 hover:text-white/60 text-xs font-dm-sans"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setVideoFile('mock-video-url')}
                    className="w-full border border-dashed border-white/15 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-extreme-royal/40 hover:bg-extreme-royal/5 transition-all duration-200"
                  >
                    <Upload size={24} className="text-white/30" />
                    <p className="text-sm text-white/40 font-dm-sans">Arraste o vídeo ou clique para selecionar</p>
                    <p className="text-xs text-white/25 font-dm-sans">MP4, MOV até 500MB</p>
                  </button>
                )}
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full"
                loading={isLoading}
                disabled={!watchedType}
              >
                <Zap size={18} />
                Registrar Atividade
              </Button>
            </form>
          </Card>
        </div>

        {/* Movement library */}
        <div className="space-y-5">
          <Card>
            <CardTitle className="mb-4">Biblioteca de Movimentos</CardTitle>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {movements.map(mov => (
                <button
                  key={mov.type}
                  onClick={() => {
                    onMovementSelect(mov.type);
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-manrope font-semibold text-white group-hover:text-extreme-royal transition-colors">
                      {mov.name}
                    </p>
                    {difficultyStars(mov.difficulty)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/30 font-dm-sans capitalize">{mov.category}</span>
                    <ChevronRight size={10} className="text-white/20" />
                    <span className="text-[10px] text-white/30 font-dm-sans">{mov.unitLabel}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent activities */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico Recente</CardTitle>
          <Badge variant="gray">{userActivities.length} registradas</Badge>
        </CardHeader>
        <div className="space-y-3">
          {userActivities.map(activity => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Activity size={16} className={activity.source === 'strava' ? 'text-[#FC4C02]' : 'text-extreme-royal'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-manrope font-semibold text-white truncate">{activity.name}</p>
                  {activity.source === 'strava' && <Badge variant="orange" size="sm">Strava</Badge>}
                </div>
                <p className="text-xs text-white/40 font-dm-sans mt-0.5">
                  {getActivityLabel(activity.type)} · {formatDuration(activity.duration)}
                  {activity.reps && ` · ${activity.reps} reps`}
                  {activity.sets && ` × ${activity.sets}`}
                </p>
              </div>
              <div className="text-right shrink-0 space-y-1">
                <p className="text-sm font-manrope font-bold text-extreme-orange">+{activity.points}pts</p>
                <p className="text-[10px] text-white/30 font-dm-sans">
                  {format(new Date(activity.date), "d 'de' MMM", { locale: ptBR })}
                </p>
              </div>
              <div>
                {activity.verified ? (
                  <CheckCircle size={14} className="text-emerald-400" />
                ) : (
                  <Clock size={14} className="text-yellow-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
