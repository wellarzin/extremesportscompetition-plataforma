import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Calendar, Users, ArrowRight, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { mockEvents } from '@/data';
import {
  getModalityLabel,
  getPhaseLabel,
  getStatusLabel,
  formatCurrency,
  cn,
} from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Event, EventStatus, EventPhase } from '@/types';

const statusVariant: Record<EventStatus, 'green' | 'royal' | 'orange' | 'gray'> = {
  active: 'green',
  ongoing: 'orange',
  finished: 'gray',
  draft: 'gray',
};

const phaseVariant: Record<EventPhase, 'royal' | 'orange' | 'gradient'> = {
  estadual: 'royal',
  nacional: 'orange',
  final: 'gradient',
};

function EventCard({ event }: { event: Event }) {
  const slotsLeft = event.maxTeams - event.registeredTeams;
  const fillPercent = (event.registeredTeams / event.maxTeams) * 100;

  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      {/* Header */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={phaseVariant[event.phase]}>{getPhaseLabel(event.phase)}</Badge>
            <Badge variant="gray">{getModalityLabel(event.modality)}</Badge>
          </div>
          <Badge variant={statusVariant[event.status]}>
            {getStatusLabel(event.status)}
          </Badge>
        </div>

        <h3 className="font-manrope font-bold text-white text-base mb-3 group-hover:text-extreme-royal transition-colors line-clamp-2 leading-snug">
          {event.name}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-white/50 text-xs font-dm-sans">
            <Calendar size={13} className="shrink-0" />
            <span>
              {format(new Date(event.date), "d 'de' MMMM, yyyy", { locale: ptBR })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-white/50 text-xs font-dm-sans">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-white/50 text-xs font-dm-sans">
            <Users size={13} className="shrink-0" />
            <span>Min. {event.minAthletes} atletas ({event.minMale}M + {event.minFemale}F)</span>
          </div>
        </div>

        {/* Slots */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/40 font-dm-sans">{event.registeredTeams} times inscritos</span>
            <span className={cn(
              'font-manrope font-semibold',
              slotsLeft <= 2 ? 'text-red-400' : slotsLeft <= 5 ? 'text-yellow-400' : 'text-white/50'
            )}>
              {slotsLeft === 0 ? 'Esgotado' : `${slotsLeft} vagas`}
            </span>
          </div>
          <div className="h-1.5 bg-white/8 rounded-full">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                fillPercent >= 90 ? 'bg-red-500' : fillPercent >= 70 ? 'bg-yellow-500' : 'bg-extreme-royal'
              )}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        {/* Prize */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-manrope">Premiação</p>
            <p className="font-manrope font-bold text-extreme-orange text-sm">
              {formatCurrency(event.prizePool)}
            </p>
          </div>
          {event.provas.length > 0 && (
            <div className="flex gap-1 flex-wrap justify-end">
              {event.provas.slice(0, 3).map(p => (
                <span key={p} className="text-[10px] bg-white/5 text-white/40 px-1.5 py-0.5 rounded font-dm-sans">
                  {p}
                </span>
              ))}
              {event.provas.length > 3 && (
                <span className="text-[10px] text-white/30 font-dm-sans">+{event.provas.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="p-5 pt-0">
        <Link to={`/app/events/${event.id}`}>
          <Button
            variant={event.status === 'active' ? 'secondary' : 'outline'}
            size="sm"
            className="w-full"
            disabled={event.status === 'draft'}
          >
            {event.status === 'active' ? (
              <>Inscrever-se <ArrowRight size={14} /></>
            ) : event.status === 'finished' ? (
              <>Ver Resultados <Trophy size={14} /></>
            ) : event.status === 'ongoing' ? (
              <>Acompanhar <ArrowRight size={14} /></>
            ) : (
              'Em breve'
            )}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function Events() {
  const [search, setSearch] = useState('');
  const [filterModality, setFilterModality] = useState('all');
  const [filterPhase, setFilterPhase] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterState, setFilterState] = useState('all');

  const filtered = mockEvents.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.city.toLowerCase().includes(search.toLowerCase()) ||
      e.state.toLowerCase().includes(search.toLowerCase());
    const matchModality = filterModality === 'all' || e.modality === filterModality;
    const matchPhase = filterPhase === 'all' || e.phase === filterPhase;
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    const matchState = filterState === 'all' || e.state === filterState;
    return matchSearch && matchModality && matchPhase && matchStatus && matchState;
  });

  const states = [...new Set(mockEvents.map(e => e.state))].sort();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-manrope font-black text-3xl text-white mb-2">Eventos</h1>
        <p className="text-white/50 font-dm-sans">
          {mockEvents.filter(e => e.status === 'active').length} eventos ativos · {mockEvents.length} total
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-white/60">
          <Filter size={16} />
          <span className="text-sm font-manrope font-semibold">Filtros</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <Input
              placeholder="Buscar evento..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
          <Select
            placeholder="Modalidade"
            value={filterModality}
            onValueChange={setFilterModality}
            options={[
              { value: 'all', label: 'Todas modalidades' },
              { value: 'atletismo', label: 'Atletismo' },
              { value: 'crossfit', label: 'CrossFit' },
              { value: 'body-scan', label: 'Body Scan' },
            ]}
          />
          <Select
            placeholder="Fase"
            value={filterPhase}
            onValueChange={setFilterPhase}
            options={[
              { value: 'all', label: 'Todas fases' },
              { value: 'estadual', label: 'Estadual' },
              { value: 'nacional', label: 'Nacional' },
              { value: 'final', label: 'Final' },
            ]}
          />
          <Select
            placeholder="Status"
            value={filterStatus}
            onValueChange={setFilterStatus}
            options={[
              { value: 'all', label: 'Todos status' },
              { value: 'active', label: 'Ativo' },
              { value: 'ongoing', label: 'Em Andamento' },
              { value: 'finished', label: 'Finalizado' },
              { value: 'draft', label: 'Rascunho' },
            ]}
          />
          <Select
            placeholder="Estado"
            value={filterState}
            onValueChange={setFilterState}
            options={[
              { value: 'all', label: 'Todos estados' },
              ...states.map(s => ({ value: s, label: s })),
            ]}
          />
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/50 font-dm-sans">
          {filtered.length} evento{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Calendar size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/50 font-dm-sans">Nenhum evento encontrado com os filtros selecionados</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearch('');
              setFilterModality('all');
              setFilterPhase('all');
              setFilterStatus('all');
              setFilterState('all');
            }}
          >
            Limpar filtros
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
