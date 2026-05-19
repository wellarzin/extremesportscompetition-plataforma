import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CheckCircle,
  XCircle,
  Upload,
  Play,
  Download,
  Plus,
  Trash2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { useNotificationStore } from '@/stores/notificationStore';
import { pendingValidations, mockEvents, mockScoringData, SCORING_TABLE } from '@/data';
import { formatTimeDisplay, cn } from '@/lib/utils';

const resultSchema = z.object({
  eventId: z.string().min(1, 'Selecione o evento'),
  phase: z.string().min(1, 'Selecione a fase'),
  prova: z.string().min(1, 'Selecione a prova'),
});

type ResultFormData = z.infer<typeof resultSchema>;

interface AthleteEntry {
  id: string;
  name: string;
  gender: 'M' | 'F';
  time: string;
}

export function AdminScoring() {
  const { addToast } = useNotificationStore();
  const [validations, setValidations] = useState(pendingValidations);
  const [athleteEntries, setAthleteEntries] = useState<AthleteEntry[]>([
    { id: '1', name: '', gender: 'M', time: '' },
    { id: '2', name: '', gender: 'F', time: '' },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<ResultFormData>({
    resolver: zodResolver(resultSchema),
  });

  const watchedEvent = watch('eventId');
  const selectedEvent = mockEvents.find(e => e.id === watchedEvent);

  const handleValidate = (id: string, approved: boolean) => {
    setValidations(prev => prev.filter(v => v.id !== id));
    addToast({
      title: approved ? 'Resultado validado!' : 'Resultado rejeitado',
      description: approved
        ? 'O resultado foi aprovado e adicionado ao ranking.'
        : 'O resultado foi rejeitado. O atleta será notificado.',
      type: approved ? 'success' : 'error',
    });
  };

  const addAthleteEntry = () => {
    setAthleteEntries(prev => [
      ...prev,
      { id: Date.now().toString(), name: '', gender: 'M', time: '' },
    ]);
  };

  const removeEntry = (id: string) => {
    setAthleteEntries(prev => prev.filter(e => e.id !== id));
  };

  const updateEntry = (id: string, field: keyof AthleteEntry, value: string) => {
    setAthleteEntries(prev =>
      prev.map(e => e.id === id ? { ...e, [field]: value } : e)
    );
  };

  const onSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
    addToast({
      title: 'Resultados enviados!',
      description: 'Os resultados foram salvos e estão aguardando validação.',
      type: 'success',
    });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const exportResults = () => {
    addToast({
      title: 'Exportando resultados...',
      description: 'O arquivo CSV será baixado em breve.',
      type: 'info',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-manrope font-black text-3xl text-white mb-1">Sistema de Apuração</h1>
          <p className="text-white/50 font-dm-sans">Insira e valide resultados de provas</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportResults}>
          <Download size={16} /> Exportar Resultados
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Result entry form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selection */}
          <Card>
            <CardTitle className="mb-5">Inserir Resultados</CardTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-3 gap-4">
                <Controller
                  name="eventId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Evento"
                      value={field.value}
                      onValueChange={field.onChange}
                      error={errors.eventId?.message}
                      options={mockEvents
                        .filter(e => e.status !== 'draft')
                        .map(e => ({ value: e.id, label: e.name.split('—')[0].trim() }))}
                      placeholder="Selecionar evento..."
                    />
                  )}
                />
                <Controller
                  name="phase"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Fase"
                      value={field.value}
                      onValueChange={field.onChange}
                      error={errors.phase?.message}
                      options={[
                        { value: 'estadual', label: 'Estadual' },
                        { value: 'nacional', label: 'Nacional' },
                        { value: 'final', label: 'Final' },
                      ]}
                      placeholder="Selecionar fase..."
                    />
                  )}
                />
                <Controller
                  name="prova"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Prova"
                      value={field.value}
                      onValueChange={field.onChange}
                      error={errors.prova?.message}
                      disabled={!watchedEvent}
                      options={(selectedEvent?.provas || ['100m', '200m', '400m', '800m', '1500m', '3000m']).map(p => ({
                        value: p,
                        label: p,
                      }))}
                      placeholder="Selecionar prova..."
                    />
                  )}
                />
              </div>

              {/* Athlete times */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/40">
                    Tempos dos Atletas
                  </p>
                  <Button type="button" variant="ghost" size="sm" onClick={addAthleteEntry}>
                    <Plus size={14} /> Adicionar atleta
                  </Button>
                </div>

                <div className="space-y-2">
                  {athleteEntries.map((entry, i) => (
                    <div key={entry.id} className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-5">
                        <input
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-extreme-royal/60 transition-all font-dm-sans"
                          placeholder={`Atleta ${i + 1}`}
                          value={entry.name}
                          onChange={e => updateEntry(entry.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-extreme-royal/60 transition-all font-dm-sans"
                          value={entry.gender}
                          onChange={e => updateEntry(entry.id, 'gender', e.target.value)}
                        >
                          <option value="M">M</option>
                          <option value="F">F</option>
                        </select>
                      </div>
                      <div className="col-span-4">
                        <input
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-extreme-royal/60 transition-all font-mono"
                          placeholder="MM:SS.ms"
                          value={entry.time}
                          onChange={e => updateEntry(entry.id, 'time', e.target.value)}
                        />
                      </div>
                      <div className="col-span-1 flex justify-center pt-2.5">
                        {athleteEntries.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEntry(entry.id)}
                            className="text-white/30 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proof upload mock */}
              <div>
                <label className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/40 mb-2 block">
                  Prova (Vídeo/Foto)
                </label>
                <button
                  type="button"
                  className="w-full border border-dashed border-white/15 rounded-xl p-4 flex items-center gap-3 hover:border-extreme-royal/40 hover:bg-extreme-royal/5 transition-all duration-200 text-left"
                >
                  <Upload size={20} className="text-white/30" />
                  <div>
                    <p className="text-sm text-white/40 font-dm-sans">Upload de vídeo ou foto como prova</p>
                    <p className="text-xs text-white/25 font-dm-sans">MP4, MOV, JPG, PNG</p>
                  </div>
                </button>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant={submitted ? 'outline' : 'primary'}
                  className="flex-1"
                  loading={submitting}
                >
                  {submitted ? (
                    <><CheckCircle size={16} /> Enviado!</>
                  ) : (
                    'Salvar Resultados'
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* Scoring table reference */}
          <Card>
            <CardTitle className="mb-4">Tabela de Pontuação</CardTitle>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {SCORING_TABLE.map(row => (
                <div key={row.position} className="p-3 rounded-xl bg-white/3 text-center">
                  <p className="text-lg mb-1">
                    {row.position === 1 ? '🥇' : row.position === 2 ? '🥈' : row.position === 3 ? '🥉' : `${row.position}º`}
                  </p>
                  <p className="font-manrope font-black text-extreme-orange text-sm">{row.points}pts</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pending validations queue */}
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Fila de Validação</CardTitle>
              {validations.length > 0 && (
                <Badge variant="yellow">{validations.length}</Badge>
              )}
            </CardHeader>

            {validations.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle size={32} className="text-emerald-400 mx-auto mb-3" />
                <p className="text-sm text-white/50 font-dm-sans">Tudo validado! 🎉</p>
              </div>
            ) : (
              <div className="space-y-4">
                {validations.map(pv => (
                  <div key={pv.id} className="p-4 rounded-xl bg-white/3 border border-white/8 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-manrope font-semibold text-white">{pv.athleteName}</p>
                        {pv.hasVideo && (
                          <button className="flex items-center gap-1 text-xs text-extreme-royal hover:text-extreme-royal-light font-dm-sans transition-colors">
                            <Play size={11} /> Vídeo
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-white/50 font-dm-sans">{pv.team}</p>
                      <div className="flex gap-3 mt-2 text-xs font-dm-sans text-white/40">
                        <span>{pv.prova}</span>
                        <span>·</span>
                        <span className="font-mono text-white font-semibold">{pv.time}</span>
                        <span>·</span>
                        <span>{format(new Date(pv.submittedAt), "d MMM, HH:mm", { locale: ptBR })}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => handleValidate(pv.id, true)}
                      >
                        <CheckCircle size={13} /> Validar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleValidate(pv.id, false)}
                      >
                        <XCircle size={13} /> Rejeitar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Auto-calculation preview */}
          <Card>
            <CardTitle className="mb-4">Classificação Auto-calculada</CardTitle>
            <p className="text-xs text-white/40 font-dm-sans mb-4">
              Campeonato Estadual SP 2025 — Atualizada ao vivo
            </p>
            <div className="space-y-2">
              {mockScoringData[1]?.teamResults.slice(0, 5).map(team => (
                <div key={team.teamId} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/3 transition-colors">
                  <span className={cn(
                    'text-sm font-manrope w-6',
                    team.position === 1 ? 'text-yellow-400 font-black' :
                    team.position === 2 ? 'text-gray-300 font-black' :
                    team.position === 3 ? 'text-amber-600 font-black' : 'text-white/50'
                  )}>
                    {team.position === 1 ? '🥇' : team.position === 2 ? '🥈' : team.position === 3 ? '🥉' : `${team.position}º`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-manrope font-semibold text-white truncate">{team.teamName}</p>
                    <p className="text-[10px] text-white/40 font-dm-sans">{formatTimeDisplay(team.totalTime)}</p>
                  </div>
                  <span className="text-xs text-extreme-orange font-manrope font-bold shrink-0">
                    {team.totalPoints}pts
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
