import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Trophy,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useNotificationStore } from '@/stores/notificationStore';
import { mockEvents, mockScoringData, SCORING_TABLE } from '@/data';
import { getModalityLabel, getPhaseLabel, getStatusLabel, formatCurrency, formatTimeDisplay, cn as _cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToast } = useNotificationStore();
  const [registered, setRegistered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rulesExpanded, setRulesExpanded] = useState(false);

  const event = mockEvents.find(e => e.id === id);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle size={40} className="text-white/20 mb-4" />
        <p className="text-white/50 font-dm-sans">Evento não encontrado</p>
        <Link to="/app/events">
          <Button variant="ghost" size="sm" className="mt-4">
            <ArrowLeft size={16} /> Voltar aos eventos
          </Button>
        </Link>
      </div>
    );
  }

  const scoring = mockScoringData.find(s => s.eventId === event.id);
  const topTeams = scoring?.teamResults.slice(0, 5) ?? [];

  const handleRegister = () => {
    setShowModal(false);
    setRegistered(true);
    addToast({
      title: 'Inscrição realizada!',
      description: `Você se inscreveu no ${event.name}`,
      type: 'success',
    });
  };

  const statusColors: Record<string, string> = {
    active: 'text-emerald-400',
    ongoing: 'text-yellow-400',
    finished: 'text-white/50',
    draft: 'text-white/30',
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Back */}
      <Link to="/app/events">
        <Button variant="ghost" size="sm">
          <ArrowLeft size={16} /> Voltar aos eventos
        </Button>
      </Link>

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden h-64 md:h-80">
        <div className="absolute inset-0 bg-gradient-to-br from-extreme-royal/30 via-extreme-black/50 to-extreme-orange/20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Viewfinder */}
        <div className="absolute top-4 left-4 w-10 h-10 border-l-2 border-t-2 border-extreme-royal/60" />
        <div className="absolute top-4 right-4 w-10 h-10 border-r-2 border-t-2 border-extreme-royal/60" />
        <div className="absolute bottom-4 left-4 w-10 h-10 border-l-2 border-b-2 border-extreme-orange/60" />
        <div className="absolute bottom-4 right-4 w-10 h-10 border-r-2 border-b-2 border-extreme-orange/60" />

        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="royal">{getModalityLabel(event.modality)}</Badge>
            <Badge variant="orange">{getPhaseLabel(event.phase)}</Badge>
            <span className={`text-xs font-manrope font-semibold ${statusColors[event.status]}`}>
              ● {getStatusLabel(event.status)}
            </span>
          </div>
          <h1 className="font-manrope font-black text-2xl md:text-4xl text-white leading-tight mb-2">
            {event.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-white/60 font-dm-sans">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {format(new Date(event.date), "d 'de' MMMM 'a' ", { locale: ptBR })}
              {format(new Date(event.endDate), "d 'de' MMMM, yyyy", { locale: ptBR })}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              {event.location}
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardTitle className="mb-3">Sobre o Evento</CardTitle>
            <p className="text-white/60 text-sm font-dm-sans leading-relaxed">{event.description}</p>
          </Card>

          {/* Regulamento */}
          <Card>
            <CardHeader>
              <CardTitle>Regulamento</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRulesExpanded(!rulesExpanded)}
              >
                {rulesExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </CardHeader>

            {/* Team requirements */}
            <div className="mb-6">
              <h4 className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/40 mb-3">
                Formação do Time
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Mínimo de atletas', value: event.minAthletes },
                  { label: 'Atletas masculinos', value: `${event.minMale}M` },
                  { label: 'Atletas femininas', value: `${event.minFemale}F` },
                ].map(req => (
                  <div key={req.label} className="p-3 rounded-xl bg-white/3 text-center">
                    <p className="font-manrope font-black text-2xl text-white">{req.value}</p>
                    <p className="text-[10px] text-white/40 font-dm-sans mt-1">{req.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Provas */}
            <div className="mb-6">
              <h4 className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/40 mb-3">
                Provas
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.provas.map(prova => (
                  <span key={prova} className="px-3 py-1.5 rounded-xl bg-extreme-royal/10 border border-extreme-royal/20 text-extreme-royal text-xs font-manrope font-semibold">
                    {prova}
                  </span>
                ))}
              </div>
            </div>

            {/* Scoring table */}
            {event.modality === 'atletismo' && (
              <div className="mb-6">
                <h4 className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Sistema de Pontuação
                </h4>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Posição</th>
                        <th>Pontos</th>
                        <th>Critério</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SCORING_TABLE.map(row => (
                        <tr key={row.position}>
                          <td>
                            <span className="font-manrope font-bold">
                              {row.position === 1 ? '🥇' : row.position === 2 ? '🥈' : row.position === 3 ? '🥉' : `${row.position}º`}
                            </span>
                          </td>
                          <td>
                            <span className="text-extreme-orange font-manrope font-bold">{row.points} pts</span>
                          </td>
                          <td className="text-white/40">Menor tempo acumulado</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 p-3 bg-white/3 rounded-xl flex gap-2">
                  <Info size={14} className="text-extreme-royal shrink-0 mt-0.5" />
                  <p className="text-xs text-white/50 font-dm-sans leading-relaxed">
                    <strong className="text-white">Desempate:</strong> 3000m → 1500m → 800m → 400m → 200m → 100m.
                    Os 4 melhores tempos de cada prova são somados.
                  </p>
                </div>
              </div>
            )}

            {/* Rules list */}
            {(rulesExpanded || event.rules.length <= 4) && (
              <div>
                <h4 className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Regras
                </h4>
                <ul className="space-y-2">
                  {event.rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm font-dm-sans text-white/60">
                      <CheckCircle size={14} className="text-extreme-royal shrink-0 mt-0.5" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!rulesExpanded && event.rules.length > 4 && (
              <button
                onClick={() => setRulesExpanded(true)}
                className="text-sm text-extreme-royal hover:text-extreme-royal-light font-dm-sans transition-colors mt-2"
              >
                + Ver todas as {event.rules.length} regras
              </button>
            )}
          </Card>

          {/* Team standings (if event has results) */}
          {topTeams.length > 0 && (
            <Card>
              <CardTitle className="mb-4">Classificação Parcial</CardTitle>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Time</th>
                      <th>Estado</th>
                      <th>Tempo Total</th>
                      <th>Pontos</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTeams.map(team => (
                      <tr key={team.teamId}>
                        <td>
                          <span className="font-manrope font-bold text-white">#{team.position}</span>
                        </td>
                        <td>
                          <span className="font-manrope font-semibold text-white">{team.teamName}</span>
                        </td>
                        <td>{team.state}</td>
                        <td className="font-manrope font-mono">{formatTimeDisplay(team.totalTime)}</td>
                        <td>
                          <span className="text-extreme-orange font-manrope font-bold">{team.totalPoints}</span>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link to="/app/scoring" className="block mt-4">
                <Button variant="outline" size="sm">
                  Ver classificação completa <Trophy size={14} />
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* CTA Card */}
          <Card className="border border-extreme-orange/20">
            <div className="text-center mb-6">
              <p className="text-[10px] font-manrope uppercase tracking-widest text-white/40 mb-1">Premiação Total</p>
              <p className="font-manrope font-black text-4xl text-extreme-orange">
                {formatCurrency(event.prizePool)}
              </p>
            </div>

            {event.status === 'active' ? (
              <>
                <Button
                  variant={registered ? 'outline' : 'secondary'}
                  size="lg"
                  className="w-full mb-3"
                  onClick={() => !registered && setShowModal(true)}
                >
                  {registered ? (
                    <><CheckCircle size={18} /> Inscrito!</>
                  ) : (
                    'Inscrever-se Agora'
                  )}
                </Button>
                {!registered && (
                  <p className="text-xs text-white/40 text-center font-dm-sans">
                    {event.maxTeams - event.registeredTeams} vagas restantes de {event.maxTeams}
                  </p>
                )}
              </>
            ) : event.status === 'finished' ? (
              <Link to="/app/scoring">
                <Button variant="outline" size="lg" className="w-full">
                  <Trophy size={18} /> Ver Resultados
                </Button>
              </Link>
            ) : event.status === 'ongoing' ? (
              <div className="flex items-center justify-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <Clock size={16} className="text-yellow-400" />
                <p className="text-sm text-yellow-400 font-manrope font-semibold">Em Andamento</p>
              </div>
            ) : (
              <div className="text-center text-white/30 text-sm font-dm-sans">
                Inscrições em breve
              </div>
            )}
          </Card>

          {/* Info */}
          <Card>
            <h4 className="text-xs font-manrope font-semibold uppercase tracking-wider text-white/40 mb-4">
              Informações
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Times inscritos', value: `${event.registeredTeams}/${event.maxTeams}` },
                { label: 'Atletas por time', value: `Mín. ${event.minAthletes}` },
                { label: 'Fase', value: getPhaseLabel(event.phase) },
                { label: 'Modalidade', value: getModalityLabel(event.modality) },
                { label: 'Local', value: `${event.city}, ${event.state}` },
              ].map(info => (
                <div key={info.label} className="flex justify-between text-sm">
                  <span className="text-white/40 font-dm-sans">{info.label}</span>
                  <span className="font-manrope font-semibold text-white">{info.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Registration modal */}
      <Modal
        open={showModal}
        onOpenChange={setShowModal}
        title="Confirmar Inscrição"
        description={`Você está se inscrevendo no ${event.name}`}
      >
        <div className="space-y-4">
          <div className="p-4 bg-white/3 rounded-xl space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/50 font-dm-sans">Evento</span>
              <span className="text-white font-manrope font-semibold">{event.name.split('—')[0].trim()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50 font-dm-sans">Data</span>
              <span className="text-white font-dm-sans">
                {format(new Date(event.date), "d 'de' MMMM, yyyy", { locale: ptBR })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50 font-dm-sans">Local</span>
              <span className="text-white font-dm-sans">{event.city}, {event.state}</span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="secondary" className="flex-1" onClick={handleRegister}>
              Confirmar Inscrição
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
