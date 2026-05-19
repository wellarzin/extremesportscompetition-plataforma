import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Search,
  Upload,
  ChevronDown,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useNotificationStore } from '@/stores/notificationStore';
import { mockEvents } from '@/data';
import { getModalityLabel, getPhaseLabel, formatCurrency, cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Event, EventStatus } from '@/types';

const eventSchema = z.object({
  name: z.string().min(5, 'Nome muito curto'),
  modality: z.string().min(1, 'Selecione a modalidade'),
  phase: z.string().min(1, 'Selecione a fase'),
  date: z.string().min(1, 'Data obrigatória'),
  endDate: z.string().min(1, 'Data fim obrigatória'),
  location: z.string().min(5, 'Local muito curto'),
  state: z.string().length(2, 'UF inválida'),
  city: z.string().min(2, 'Cidade obrigatória'),
  maxTeams: z.number().min(4, 'Mínimo 4 times').max(100),
  prizePool: z.number().min(0),
  description: z.string().min(20, 'Descrição muito curta'),
});

type EventFormData = z.infer<typeof eventSchema>;

const statusColors: Record<EventStatus, 'green' | 'yellow' | 'gray' | 'royal'> = {
  active: 'green',
  ongoing: 'yellow',
  finished: 'gray',
  draft: 'gray',
};

const statusLabels: Record<EventStatus, string> = {
  active: 'Ativo',
  ongoing: 'Em Andamento',
  finished: 'Finalizado',
  draft: 'Rascunho',
};

export function AdminEvents() {
  const { addToast } = useNotificationStore();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [search, setSearch] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [_editingId, _setEditingId] = useState<string | null>(null);

  const filtered = events.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.city.toLowerCase().includes(search.toLowerCase()) ||
    e.state.toLowerCase().includes(search.toLowerCase())
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      maxTeams: 16,
      prizePool: 10000,
    },
  });

  const onSubmit = async (data: EventFormData) => {
    await new Promise(r => setTimeout(r, 1000));

    const newEvent: Event = {
      id: `ev${Date.now()}`,
      name: data.name,
      modality: data.modality as Event['modality'],
      phase: data.phase as Event['phase'],
      status: 'draft',
      date: data.date,
      endDate: data.endDate,
      location: data.location,
      state: data.state,
      city: data.city,
      description: data.description,
      maxTeams: data.maxTeams,
      registeredTeams: 0,
      maxAthletesPerTeam: 16,
      minAthletes: 12,
      minMale: 6,
      minFemale: 6,
      prizePool: data.prizePool,
      image: '',
      rules: [],
      provas: ['100m', '200m', '400m', '800m', '1500m', '3000m'],
    };

    setEvents(prev => [newEvent, ...prev]);
    setCreateModal(false);
    reset();
    addToast({
      title: 'Evento criado!',
      description: `${data.name} foi criado como rascunho.`,
      type: 'success',
    });
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setDeleteModal(null);
    addToast({ title: 'Evento excluído', type: 'info' });
  };

  const handleStatusChange = (id: string, status: EventStatus) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    addToast({
      title: 'Status atualizado!',
      description: `Evento marcado como "${statusLabels[status]}"`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-manrope font-black text-3xl text-white mb-1">Eventos</h1>
          <p className="text-white/50 font-dm-sans">{events.length} eventos cadastrados</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setCreateModal(true)}>
          <Plus size={16} /> Criar Evento
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4">
        <Input
          placeholder="Buscar por nome, cidade ou estado..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>{filtered.length} eventos</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Modalidade</th>
                <th>Fase</th>
                <th>Data</th>
                <th>Local</th>
                <th>Times</th>
                <th>Premiação</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(event => (
                <tr key={event.id}>
                  <td>
                    <p className="font-manrope font-semibold text-white max-w-[200px] truncate">
                      {event.name.split('—')[0].trim()}
                    </p>
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
                  <td className="whitespace-nowrap text-white/70">
                    {format(new Date(event.date), "d 'de' MMM yy", { locale: ptBR })}
                  </td>
                  <td className="text-white/60 whitespace-nowrap">{event.city}, {event.state}</td>
                  <td className="text-white/70">{event.registeredTeams}/{event.maxTeams}</td>
                  <td className="text-extreme-orange font-manrope font-semibold whitespace-nowrap">
                    {formatCurrency(event.prizePool)}
                  </td>
                  <td>
                    <div className="relative group">
                      <button className="flex items-center gap-1">
                        <Badge variant={statusColors[event.status]} size="sm">
                          {statusLabels[event.status]}
                        </Badge>
                        <ChevronDown size={12} className="text-white/30" />
                      </button>
                      <div className="absolute top-full left-0 mt-1 w-40 glass-card rounded-xl border border-white/10 shadow-xl z-10 hidden group-hover:block">
                        {(Object.entries(statusLabels) as [EventStatus, string][]).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => handleStatusChange(event.id, key)}
                            className={cn(
                              'w-full text-left px-3 py-2 text-xs font-dm-sans hover:bg-white/8 transition-colors first:rounded-t-xl last:rounded-b-xl',
                              event.status === key ? 'text-extreme-royal' : 'text-white/60'
                            )}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        className="p-1.5 text-white/40 hover:text-extreme-royal transition-colors rounded-lg hover:bg-extreme-royal/10"
                        onClick={() => _setEditingId(event.id)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="p-1.5 text-white/40 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                        onClick={() => setDeleteModal(event.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create modal */}
      <Modal
        open={createModal}
        onOpenChange={setCreateModal}
        title="Criar Novo Evento"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome do Evento"
            placeholder="Ex: Campeonato Estadual SP 2025"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Controller
              name="modality"
              control={control}
              render={({ field }) => (
                <Select
                  label="Modalidade"
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.modality?.message}
                  options={[
                    { value: 'atletismo', label: 'Atletismo' },
                    { value: 'crossfit', label: 'CrossFit' },
                    { value: 'body-scan', label: 'Body Scan' },
                    { value: 'natacao', label: 'Natação' },
                    { value: 'ciclismo', label: 'Ciclismo' },
                  ]}
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
                />
              )}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Data de início"
              type="date"
              error={errors.date?.message}
              {...register('date')}
            />
            <Input
              label="Data de fim"
              type="date"
              error={errors.endDate?.message}
              {...register('endDate')}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Local"
                placeholder="Arena Esportiva..."
                error={errors.location?.message}
                {...register('location')}
              />
            </div>
            <Input
              label="Estado (UF)"
              placeholder="SP"
              maxLength={2}
              error={errors.state?.message}
              {...register('state')}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Cidade"
              placeholder="São Paulo"
              error={errors.city?.message}
              {...register('city')}
            />
            <Controller
              name="maxTeams"
              control={control}
              render={({ field }) => (
                <Input
                  label="Máx. de times"
                  type="number"
                  error={errors.maxTeams?.message}
                  value={field.value}
                  onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                  leftIcon={<Users size={14} />}
                />
              )}
            />
          </div>

          <Controller
            name="prizePool"
            control={control}
            render={({ field }) => (
              <Input
                label="Premiação total (R$)"
                type="number"
                error={errors.prizePool?.message}
                value={field.value}
                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
              />
            )}
          />

          <div>
            <label className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/50 mb-2 block">
              Descrição
            </label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-extreme-royal/60 transition-all font-dm-sans resize-none"
              placeholder="Descreva o evento..."
              rows={3}
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-red-400 mt-0.5">{errors.description.message}</p>}
          </div>

          {/* PDF rules upload mock */}
          <div>
            <label className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/50 mb-2 block">
              Regulamento (PDF)
            </label>
            <button
              type="button"
              className="w-full border border-dashed border-white/15 rounded-xl p-4 flex items-center gap-3 hover:border-extreme-royal/40 hover:bg-extreme-royal/5 transition-all duration-200 text-left"
            >
              <Upload size={20} className="text-white/30" />
              <div>
                <p className="text-sm text-white/40 font-dm-sans">Upload do PDF de regulamento</p>
                <p className="text-xs text-white/25 font-dm-sans">PDF até 10MB</p>
              </div>
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" type="button" onClick={() => setCreateModal(false)}>
              Cancelar
            </Button>
            <Button variant="secondary" className="flex-1" type="submit" loading={isSubmitting}>
              Criar Evento
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleteModal}
        onOpenChange={(open) => !open && setDeleteModal(null)}
        title="Excluir Evento"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-white/60 font-dm-sans text-sm">
            Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteModal(null)}>
              Cancelar
            </Button>
            <Button variant="danger" className="flex-1" onClick={() => deleteModal && handleDelete(deleteModal)}>
              <Trash2 size={16} /> Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
