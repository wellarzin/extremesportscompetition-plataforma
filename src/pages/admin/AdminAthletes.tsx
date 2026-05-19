import { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Users,
  Activity,
  MapPin,
  CheckCircle,
  Link as LinkIcon,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { mockUsers } from '@/data';
import type { User } from '@/types';

const states = [...new Set(mockUsers.map(u => u.state))].sort();

export function AdminAthletes() {
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);
  const [viewingAthlete, setViewingAthlete] = useState<User | null>(null);

  const athletes = mockUsers.filter(u => u.role === 'athlete');

  const filtered = athletes.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase());
    const matchState = filterState === 'all' || u.state === filterState;
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchState && matchRole;
  });

  const toggleSelect = (id: string) => {
    setSelectedAthletes(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedAthletes.length === filtered.length) {
      setSelectedAthletes([]);
    } else {
      setSelectedAthletes(filtered.map(u => u.id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-manrope font-black text-3xl text-white mb-1">Atletas</h1>
          <p className="text-white/50 font-dm-sans">{athletes.length} atletas cadastrados</p>
        </div>
        {selectedAthletes.length > 0 && (
          <div className="flex items-center gap-3">
            <p className="text-sm text-white/60 font-dm-sans">{selectedAthletes.length} selecionados</p>
            <Button variant="outline" size="sm">Exportar</Button>
            <Button variant="danger" size="sm">Desativar</Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-white/50">
          <Filter size={16} />
          <span className="text-sm font-manrope font-semibold">Filtros</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <Input
            placeholder="Buscar atleta..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
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
          <Select
            placeholder="Status Strava"
            value={filterRole}
            onValueChange={setFilterRole}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'strava', label: 'Com Strava' },
              { value: 'bodyscan', label: 'Com Body Scan' },
            ]}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total de Atletas', value: athletes.length, icon: <Users size={20} /> },
          { label: 'Com Strava', value: athletes.filter(a => a.stravaConnected).length, icon: <Activity size={20} /> },
          { label: 'Com Body Scan', value: athletes.filter(a => a.bodyScanConnected).length, icon: <CheckCircle size={20} /> },
        ].map(stat => (
          <Card key={stat.label}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-extreme-royal/15 text-extreme-royal flex items-center justify-center">
                {stat.icon}
              </div>
              <div>
                <p className="font-manrope font-black text-2xl text-white">{stat.value}</p>
                <p className="text-xs text-white/40 font-dm-sans">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Athletes table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedAthletes.length === filtered.length && filtered.length > 0}
              onChange={selectAll}
              className="rounded border-white/20 bg-white/5 accent-extreme-royal"
            />
            <CardTitle>{filtered.length} atletas</CardTitle>
          </div>
          <Button variant="outline" size="sm">
            Exportar CSV
          </Button>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-10"></th>
                <th>Atleta</th>
                <th>Contato</th>
                <th>Localização</th>
                <th>Atividades</th>
                <th>Pontos</th>
                <th>Ranking</th>
                <th>Integrações</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(athlete => (
                <tr key={athlete.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedAthletes.includes(athlete.id)}
                      onChange={() => toggleSelect(athlete.id)}
                      className="rounded border-white/20 bg-white/5 accent-extreme-royal"
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar src={athlete.avatar} name={athlete.name} size="sm" />
                      <div>
                        <p className="font-manrope font-semibold text-white text-sm">{athlete.name}</p>
                        <p className="text-xs text-white/40 font-dm-sans">{athlete.age} anos</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-white/60 text-xs font-dm-sans">{athlete.email}</td>
                  <td>
                    <div className="flex items-center gap-1 text-white/60 text-xs font-dm-sans">
                      <MapPin size={11} />
                      {athlete.city}, {athlete.state}
                    </div>
                  </td>
                  <td>
                    <span className="font-manrope font-semibold text-white">{athlete.stats.totalActivities}</span>
                  </td>
                  <td>
                    <span className="text-extreme-orange font-manrope font-semibold">
                      {athlete.stats.totalPoints.toLocaleString('pt-BR')}
                    </span>
                  </td>
                  <td>
                    {athlete.stats.rankingPosition > 0 ? (
                      <span className="font-manrope font-bold text-white">#{athlete.stats.rankingPosition}</span>
                    ) : (
                      <span className="text-white/30">—</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-1.5">
                      {athlete.stravaConnected && (
                        <Badge variant="orange" size="sm">Strava</Badge>
                      )}
                      {athlete.bodyScanConnected && (
                        <Badge variant="royal" size="sm">Scan</Badge>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => setViewingAthlete(athlete)}
                      className="p-1.5 text-white/40 hover:text-extreme-royal transition-colors rounded-lg hover:bg-extreme-royal/10"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Users size={40} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/40 font-dm-sans">Nenhum atleta encontrado</p>
          </div>
        )}
      </Card>

      {/* Athlete detail modal */}
      <Modal
        open={!!viewingAthlete}
        onOpenChange={(open) => !open && setViewingAthlete(null)}
        title="Detalhes do Atleta"
        size="md"
      >
        {viewingAthlete && (
          <div className="space-y-5">
            {/* Profile */}
            <div className="flex items-center gap-4">
              <Avatar src={viewingAthlete.avatar} name={viewingAthlete.name} size="lg" />
              <div>
                <h3 className="font-manrope font-bold text-white text-lg">{viewingAthlete.name}</h3>
                <p className="text-white/50 text-sm font-dm-sans">{viewingAthlete.bio}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-white/40 font-dm-sans">
                  <MapPin size={11} />
                  {viewingAthlete.city}, {viewingAthlete.state} · {viewingAthlete.age} anos
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Atividades', value: viewingAthlete.stats.totalActivities },
                { label: 'Pontos', value: viewingAthlete.stats.totalPoints.toLocaleString('pt-BR') },
                { label: 'Eventos', value: viewingAthlete.stats.eventsParticipated },
                { label: 'Conquistas', value: viewingAthlete.stats.achievementsEarned },
                { label: 'Ranking', value: `#${viewingAthlete.stats.rankingPosition}` },
                { label: 'Horas', value: `${viewingAthlete.stats.hoursTraining}h` },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-white/4 text-center">
                  <p className="font-manrope font-bold text-lg text-white">{s.value}</p>
                  <p className="text-[10px] text-white/40 font-dm-sans">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Integrations */}
            <div>
              <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/40 mb-3">
                Integrações
              </p>
              <div className="flex gap-3">
                <div className={`flex items-center gap-2 p-3 rounded-xl flex-1 ${viewingAthlete.stravaConnected ? 'bg-[#FC4C02]/15 border border-[#FC4C02]/25' : 'bg-white/3 border border-white/8'}`}>
                  <Activity size={16} className={viewingAthlete.stravaConnected ? 'text-[#FC4C02]' : 'text-white/30'} />
                  <div>
                    <p className="text-xs font-manrope font-semibold text-white">Strava</p>
                    <p className="text-[10px] text-white/40 font-dm-sans">
                      {viewingAthlete.stravaConnected ? 'Conectado' : 'Não conectado'}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-xl flex-1 ${viewingAthlete.bodyScanConnected ? 'bg-extreme-royal/15 border border-extreme-royal/25' : 'bg-white/3 border border-white/8'}`}>
                  <LinkIcon size={16} className={viewingAthlete.bodyScanConnected ? 'text-extreme-royal' : 'text-white/30'} />
                  <div>
                    <p className="text-xs font-manrope font-semibold text-white">Body Scan</p>
                    <p className="text-[10px] text-white/40 font-dm-sans">
                      {viewingAthlete.bodyScanConnected ? 'Conectado' : 'Não conectado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => setViewingAthlete(null)}>
              Fechar
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
