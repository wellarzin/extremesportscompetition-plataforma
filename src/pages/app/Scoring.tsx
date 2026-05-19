import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import {
  BarChart3,
  Trophy,
  ChevronRight,
  Users,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { mockScoringData, SCORING_TABLE, mockEvents } from '@/data';
import { formatTimeDisplay, getPhaseLabel, cn } from '@/lib/utils';
import type { EventPhase, TeamResult } from '@/types';

const DESEMPATE_ORDER = ['3000m', '1500m', '800m', '400m', '200m', '100m'];

function TeamDetailModal({ team, onClose }: { team: TeamResult; onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-manrope font-bold text-white text-lg">{team.teamName}</h3>
          <p className="text-sm text-white/50 font-dm-sans">{team.state} · Posição #{team.position}</p>
        </div>
        <Badge variant={team.status === 'classificado' ? 'green' : team.status === 'em-disputa' ? 'yellow' : 'red'}>
          {team.status === 'classificado' ? 'Classificado' : team.status === 'em-disputa' ? 'Em Disputa' : 'Desclassificado'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <p className="font-manrope font-black text-2xl text-white">{formatTimeDisplay(team.totalTime)}</p>
          <p className="text-xs text-white/40 font-dm-sans">Tempo Total</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <p className="font-manrope font-black text-2xl text-extreme-orange">{team.totalPoints}</p>
          <p className="text-xs text-white/40 font-dm-sans">Pontos</p>
        </div>
      </div>

      {team.provaResults.length > 0 && (
        <div>
          <h4 className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/40 mb-3">
            Resultados por Prova
          </h4>
          {team.provaResults.map(prova => (
            <div key={prova.prova} className="mb-4">
              <p className="text-sm font-manrope font-semibold text-extreme-royal mb-2">{prova.prova}</p>
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>Atleta</th>
                    <th>Gênero</th>
                    <th>Tempo</th>
                    <th>Pos.</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {prova.results.map(r => (
                    <tr key={r.athleteId}>
                      <td className="font-manrope font-semibold text-white">{r.athleteName}</td>
                      <td>
                        <Badge variant={r.gender === 'M' ? 'royal' : 'orange'} size="sm">{r.gender}</Badge>
                      </td>
                      <td className="font-mono">{formatTimeDisplay(r.time)}</td>
                      <td>#{r.position}</td>
                      <td className="text-extreme-orange font-manrope font-bold">{r.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      <Button variant="outline" className="w-full" onClick={onClose}>
        Fechar
      </Button>
    </div>
  );
}

export function Scoring() {
  const [selectedEvent, setSelectedEvent] = useState(mockScoringData[0]?.eventId || '');
  const [selectedPhase, setSelectedPhase] = useState<EventPhase>('estadual');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState<TeamResult | null>(null);

  const eventData = mockScoringData.find(s => s.eventId === selectedEvent);
  const event = mockEvents.find(e => e.id === selectedEvent);

  const states = eventData
    ? [...new Set(eventData.teamResults.map(t => t.state))].sort()
    : [];

  const filteredTeams = (eventData?.teamResults || [])
    .filter(t => selectedState === 'all' || t.state === selectedState)
    .sort((a, b) => a.position - b.position);

  const positionStyle = (pos: number) => {
    if (pos === 1) return 'text-yellow-400 font-black';
    if (pos === 2) return 'text-gray-300 font-black';
    if (pos === 3) return 'text-amber-600 font-black';
    return 'text-white/60 font-semibold';
  };

  const positionLabel = (pos: number) => {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return `${pos}º`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-manrope font-black text-3xl text-white mb-2">Sistema de Apuração</h1>
        <p className="text-white/50 font-dm-sans">
          Rankings oficiais por fase, estado e modalidade
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-5">
        <div className="grid sm:grid-cols-3 gap-3">
          <Select
            label="Evento"
            value={selectedEvent}
            onValueChange={setSelectedEvent}
            options={mockScoringData.map(s => {
              const ev = mockEvents.find(e => e.id === s.eventId);
              return { value: s.eventId, label: ev?.name || s.eventId };
            })}
          />
          <Select
            label="Fase"
            value={selectedPhase}
            onValueChange={(v) => setSelectedPhase(v as EventPhase)}
            options={[
              { value: 'estadual', label: 'Estadual' },
              { value: 'nacional', label: 'Nacional' },
              { value: 'final', label: 'Final' },
            ]}
          />
          <Select
            label="Estado"
            value={selectedState}
            onValueChange={setSelectedState}
            options={[
              { value: 'all', label: 'Todos os estados' },
              ...states.map(s => ({ value: s, label: s })),
            ]}
          />
        </div>
      </div>

      <Tabs.Root defaultValue="standings">
        <Tabs.List className="flex gap-1 p-1 bg-white/5 rounded-xl mb-6 w-fit">
          {[
            { value: 'standings', label: 'Classificação Geral' },
            { value: 'results', label: 'Resultados por Prova' },
            { value: 'rules', label: 'Regras de Pontuação' },
          ].map(tab => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className="px-4 py-2 text-sm font-manrope font-semibold rounded-lg text-white/50 transition-all data-[state=active]:bg-extreme-royal data-[state=active]:text-white"
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Standings tab */}
        <Tabs.Content value="standings">
          {!eventData ? (
            <Card>
              <div className="text-center py-12">
                <BarChart3 size={40} className="text-white/20 mx-auto mb-4" />
                <p className="text-white/40 font-dm-sans">Nenhum dado de apuração disponível para este evento</p>
              </div>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>{event?.name}</CardTitle>
                  <p className="text-xs text-white/40 font-dm-sans mt-1">
                    {filteredTeams.length} times · {getPhaseLabel(selectedPhase)} · {selectedState === 'all' ? 'Todos estados' : selectedState}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="green">{filteredTeams.filter(t => t.status === 'classificado').length} Classificados</Badge>
                </div>
              </CardHeader>

              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="w-12">Pos</th>
                      <th>Time</th>
                      <th>Estado</th>
                      <th>Tempo Total</th>
                      <th>Pontos</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeams.map(team => (
                      <tr
                        key={team.teamId}
                        className="cursor-pointer"
                        onClick={() => setSelectedTeam(team)}
                      >
                        <td>
                          <span className={cn('font-manrope text-sm', positionStyle(team.position))}>
                            {positionLabel(team.position)}
                          </span>
                        </td>
                        <td>
                          <span className="font-manrope font-semibold text-white">{team.teamName}</span>
                        </td>
                        <td>
                          <span className="text-white/60">{team.state}</span>
                        </td>
                        <td>
                          <span className="font-mono text-white/80">{formatTimeDisplay(team.totalTime)}</span>
                        </td>
                        <td>
                          <span className="text-extreme-orange font-manrope font-bold">{team.totalPoints} pts</span>
                        </td>
                        <td>
                          <Badge
                            variant={
                              team.status === 'classificado' ? 'green' :
                              team.status === 'em-disputa' ? 'yellow' : 'red'
                            }
                            size="sm"
                          >
                            {team.status === 'classificado' ? 'Classificado' :
                              team.status === 'em-disputa' ? 'Em Disputa' : 'Desclassificado'}
                          </Badge>
                        </td>
                        <td>
                          <ChevronRight size={14} className="text-white/30" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </Tabs.Content>

        {/* Results per prova */}
        <Tabs.Content value="results">
          {!eventData ? (
            <Card>
              <div className="text-center py-12">
                <BarChart3 size={40} className="text-white/20 mx-auto mb-4" />
                <p className="text-white/40 font-dm-sans">Nenhum resultado disponível</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {eventData.teamResults[0]?.provaResults?.map(prova => (
                <Card key={prova.prova}>
                  <CardTitle className="mb-4">{prova.distance} — Resultados</CardTitle>
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Pos</th>
                          <th>Atleta</th>
                          <th>Time</th>
                          <th>Gênero</th>
                          <th>Tempo</th>
                          <th>Pontos</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prova.results
                          .sort((a, b) => (a.position || 99) - (b.position || 99))
                          .map(result => (
                          <tr key={result.athleteId}>
                            <td>
                              <span className={cn('font-manrope text-sm', positionStyle(result.position || 99))}>
                                {positionLabel(result.position || 99)}
                              </span>
                            </td>
                            <td className="font-manrope font-semibold text-white">{result.athleteName}</td>
                            <td className="text-white/60">
                              {eventData.teamResults.find(t =>
                                t.provaResults.some(p => p.results.some(r => r.athleteId === result.athleteId))
                              )?.teamName || '—'}
                            </td>
                            <td>
                              <Badge variant={result.gender === 'M' ? 'royal' : 'orange'} size="sm">
                                {result.gender}
                              </Badge>
                            </td>
                            <td className="font-mono text-white/80">{formatTimeDisplay(result.time)}</td>
                            <td className="text-extreme-orange font-manrope font-bold">{result.points} pts</td>
                            <td>
                              {result.validated ? (
                                <Badge variant="green" size="sm">Validado</Badge>
                              ) : (
                                <Badge variant="yellow" size="sm">Pendente</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ))}
              {(eventData.teamResults[0]?.provaResults?.length || 0) === 0 && (
                <Card>
                  <div className="text-center py-12">
                    <p className="text-white/40 font-dm-sans">Resultados detalhados não disponíveis para este evento</p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </Tabs.Content>

        {/* Scoring rules */}
        <Tabs.Content value="rules">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardTitle className="mb-5">Tabela de Pontuação</CardTitle>
              <div className="space-y-2">
                {SCORING_TABLE.map(row => (
                  <div
                    key={row.position}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-xl',
                      row.position <= 3 ? 'bg-white/5' : 'bg-white/2'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {row.position === 1 ? '🥇' : row.position === 2 ? '🥈' : row.position === 3 ? '🥉' : `${row.position}º`}
                      </span>
                      <span className="text-sm font-manrope font-semibold text-white">
                        {row.position}ª Posição
                      </span>
                    </div>
                    <span className="font-manrope font-black text-lg text-extreme-orange">
                      {row.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-5">
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Info size={16} className="text-extreme-royal" />
                  <CardTitle>Critério de Classificação</CardTitle>
                </div>
                <div className="space-y-3 text-sm text-white/60 font-dm-sans">
                  <p>A classificação é determinada pelo <strong className="text-white">menor tempo total acumulado</strong> nas seis provas.</p>
                  <p>Os <strong className="text-white">4 melhores tempos</strong> de cada prova por time são somados para o total.</p>
                  <p>Times que não completam uma prova recebem <strong className="text-white">penalidade de 999s</strong> naquela prova.</p>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Trophy size={16} className="text-extreme-orange" />
                  <CardTitle>Critério de Desempate</CardTitle>
                </div>
                <p className="text-sm text-white/60 font-dm-sans mb-4">
                  Em caso de empate no tempo total, o desempate é feito prova a prova, na seguinte ordem:
                </p>
                <div className="space-y-2">
                  {DESEMPATE_ORDER.map((prova, i) => (
                    <div key={prova} className="flex items-center gap-3 p-2 rounded-lg bg-white/3">
                      <span className="w-5 h-5 rounded-full bg-extreme-royal/20 flex items-center justify-center text-[10px] font-manrope font-bold text-extreme-royal shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm font-manrope font-semibold text-white">{prova}</span>
                      {i < DESEMPATE_ORDER.length - 1 && (
                        <ChevronRight size={12} className="text-white/20 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Users size={16} className="text-extreme-royal" />
                  <CardTitle>Requisitos do Time</CardTitle>
                </div>
                <div className="space-y-2 text-sm text-white/60 font-dm-sans">
                  <p>• Mínimo de <strong className="text-white">12 atletas</strong> por time</p>
                  <p>• Ao menos <strong className="text-white">6 atletas masculinos</strong></p>
                  <p>• Ao menos <strong className="text-white">6 atletas femininas</strong></p>
                  <p>• Cada atleta compete em <strong className="text-white">ao menos 1 prova</strong></p>
                  <p>• Validação por <strong className="text-white">vídeo obrigatória</strong></p>
                  <p>• Resultado enviado em <strong className="text-white">até 24h</strong> após a prova</p>
                </div>
              </Card>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Team detail modal */}
      <Modal
        open={!!selectedTeam}
        onOpenChange={(open) => !open && setSelectedTeam(null)}
        title="Detalhes do Time"
        size="lg"
      >
        {selectedTeam && (
          <TeamDetailModal
            team={selectedTeam}
            onClose={() => setSelectedTeam(null)}
          />
        )}
      </Modal>
    </div>
  );
}
