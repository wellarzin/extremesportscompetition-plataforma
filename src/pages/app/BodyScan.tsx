import { useState, useRef } from 'react';
import {
  Scan,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  X,
  Camera,
  Loader2,
  RefreshCw,
  User,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useNotificationStore } from '@/stores/notificationStore';
import { mockBodyScans } from '@/data';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type PhotoSlot = 'frente' | 'perfil' | 'costas';

interface UploadedPhoto {
  file: File;
  preview: string;
}

type ScanState = 'idle' | 'uploading' | 'processing' | 'complete';

const PHOTO_SLOTS: { key: PhotoSlot; label: string; description: string; icon: string }[] = [
  { key: 'frente', label: 'Frente', description: 'Vista frontal, braços ao lado do corpo', icon: '🧍' },
  { key: 'perfil', label: 'Perfil', description: 'Vista lateral direita, postura ereta', icon: '🚶' },
  { key: 'costas', label: 'Costas', description: 'Vista posterior, braços ao lado do corpo', icon: '🚶' },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-3 border border-white/10">
        <p className="text-xs text-white/60 font-dm-sans mb-2">{label}</p>
        {payload.map(entry => (
          <div key={entry.name} className="flex items-center gap-2 text-xs mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-white/60 font-dm-sans capitalize">{entry.name}:</span>
            <span className="font-manrope font-bold text-white">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function BodyScan() {
  const { addToast } = useNotificationStore();
  const [photos, setPhotos] = useState<Partial<Record<PhotoSlot, UploadedPhoto>>>({});
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [processingStep, setProcessingStep] = useState(0);
  const [scanResults, setScanResults] = useState<typeof mockBodyScans[0] | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const fileRefs = useRef<Partial<Record<PhotoSlot, HTMLInputElement>>>({});

  const historyScans = mockBodyScans
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const chartData = [...historyScans]
    .reverse()
    .map(s => ({
      date: format(new Date(s.date), 'MMM', { locale: ptBR }),
      gordura: s.fatPercentage,
      hidratacao: s.hydration,
    }));

  const allPhotosUploaded = PHOTO_SLOTS.every(slot => photos[slot.key]);

  const handleFileChange = (slot: PhotoSlot, file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast({ title: 'Formato inválido', description: 'Envie apenas imagens (JPG, PNG, HEIC).', type: 'error' });
      return;
    }
    const preview = URL.createObjectURL(file);
    setPhotos(prev => ({ ...prev, [slot]: { file, preview } }));
  };

  const removePhoto = (slot: PhotoSlot) => {
    setPhotos(prev => {
      const next = { ...prev };
      if (next[slot]) URL.revokeObjectURL(next[slot]!.preview);
      delete next[slot];
      return next;
    });
  };

  const handleEvaluate = async () => {
    if (!allPhotosUploaded) return;
    setScanState('uploading');

    // Step 1: uploading
    await new Promise(r => setTimeout(r, 1200));
    setScanState('processing');

    // Simulate processing steps
    const steps = [
      'Detectando pontos corporais...',
      'Calculando composição corporal...',
      'Estimando massa muscular...',
      'Gerando relatório...',
    ];
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise(r => setTimeout(r, 900));
    }

    // Mock API result — in production, replace with real fetch()
    const mockResult = historyScans[0];
    setScanResults(mockResult);
    setScanState('complete');
    addToast({
      title: 'Avaliação concluída!',
      description: 'Sua composição corporal foi analisada com sucesso.',
      type: 'success',
    });
  };

  const handleReset = () => {
    Object.values(photos).forEach(p => p && URL.revokeObjectURL(p.preview));
    setPhotos({});
    setScanState('idle');
    setProcessingStep(0);
    setScanResults(null);
  };

  const getDelta = (current: number, previous: number, lowerIsBetter = false) => {
    const delta = current - previous;
    const isPositive = lowerIsBetter ? delta < 0 : delta > 0;
    return { delta: Math.abs(delta).toFixed(1), isPositive };
  };

  const prevScan = historyScans[1];

  const PROCESSING_STEPS = [
    'Detectando pontos corporais...',
    'Calculando composição corporal...',
    'Estimando massa muscular...',
    'Gerando relatório...',
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-manrope font-black text-3xl text-white mb-2">Body Scan</h1>
          <p className="text-white/50 font-dm-sans">Avalie sua composição corporal com inteligência artificial</p>
        </div>
        {scanResults && (
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw size={14} />
            Nova Avaliação
          </Button>
        )}
      </div>

      {/* STATE: idle — photo upload */}
      {scanState === 'idle' && !scanResults && (
        <>
          {/* How it works */}
          <Card className="border border-extreme-royal/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-extreme-royal/8 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-extreme-royal/15 flex items-center justify-center">
                  <Scan size={20} className="text-extreme-royal" />
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-white text-lg">Como funciona</h3>
                  <p className="text-xs text-white/40 font-dm-sans">3 fotos • análise em segundos • resultados precisos</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { step: '01', title: 'Envie 3 fotos', desc: 'Frente, perfil e costas. Roupas de treino, fundo neutro.' },
                  { step: '02', title: 'IA analisa', desc: 'Nossa API detecta pontos corporais e calcula composição.' },
                  { step: '03', title: 'Receba o resultado', desc: 'IMC, % gordura, massa muscular e hidratação em segundos.' },
                ].map(item => (
                  <div key={item.step} className="p-4 bg-white/3 rounded-xl">
                    <span className="font-manrope font-black text-2xl gradient-text">{item.step}</span>
                    <h4 className="font-manrope font-semibold text-white mt-2 mb-1">{item.title}</h4>
                    <p className="text-xs text-white/50 font-dm-sans leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Photo upload slots */}
          <Card>
            <CardTitle className="mb-2">Enviar Fotos para Avaliação</CardTitle>
            <p className="text-sm text-white/40 font-dm-sans mb-6">
              Use roupas de treino, fique em pé em fundo neutro com boa iluminação.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {PHOTO_SLOTS.map(slot => {
                const uploaded = photos[slot.key];
                return (
                  <div key={slot.key} className="space-y-2">
                    <p className="text-xs font-manrope font-semibold text-white/70 uppercase tracking-wider">
                      {slot.label}
                    </p>
                    <p className="text-xs text-white/30 font-dm-sans">{slot.description}</p>

                    {uploaded ? (
                      // Preview
                      <div className="relative group aspect-[3/4] rounded-2xl overflow-hidden border border-emerald-500/30">
                        <img
                          src={uploaded.preview}
                          alt={slot.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => removePhoto(slot.key)}
                            className="w-10 h-10 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
                          >
                            <X size={16} className="text-white" />
                          </button>
                        </div>
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      // Upload zone
                      <button
                        onClick={() => fileRefs.current[slot.key]?.click()}
                        className="w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-white/15 hover:border-extreme-royal/50 bg-white/2 hover:bg-extreme-royal/5 transition-all flex flex-col items-center justify-center gap-3 group"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-extreme-royal/10 flex items-center justify-center transition-colors">
                          <span className="text-2xl">{slot.icon}</span>
                        </div>
                        <div className="text-center">
                          <Camera size={14} className="text-white/30 group-hover:text-extreme-royal mx-auto mb-1 transition-colors" />
                          <p className="text-xs text-white/30 group-hover:text-white/60 font-dm-sans transition-colors">
                            Clique para enviar
                          </p>
                        </div>
                      </button>
                    )}

                    <input
                      ref={el => { if (el) fileRefs.current[slot.key] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFileChange(slot.key, e.target.files?.[0] ?? null)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-6">
              {PHOTO_SLOTS.map(slot => (
                <div
                  key={slot.key}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    photos[slot.key] ? 'bg-emerald-500' : 'bg-white/10'
                  }`}
                />
              ))}
              <span className="text-xs text-white/40 font-dm-sans ml-1 shrink-0">
                {Object.keys(photos).length}/3 fotos
              </span>
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={handleEvaluate}
              disabled={!allPhotosUploaded}
            >
              <Scan size={18} />
              {allPhotosUploaded ? 'Avaliar Composição Corporal' : `Aguardando ${3 - Object.keys(photos).length} foto(s)`}
            </Button>
          </Card>

          {/* History teaser */}
          {historyScans.length > 0 && (
            <button
              onClick={() => setShowHistory(v => !v)}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 font-dm-sans transition-colors"
            >
              <ChevronRight
                size={16}
                className={`transition-transform ${showHistory ? 'rotate-90' : ''}`}
              />
              {showHistory ? 'Ocultar' : 'Ver'} histórico de avaliações ({historyScans.length})
            </button>
          )}

          {showHistory && (
            <Card>
              <CardTitle className="mb-5">Histórico de Avaliações</CardTitle>
              <div className="space-y-3">
                {historyScans.map((scan, i) => (
                  <div
                    key={scan.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/3 hover:bg-white/5 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-extreme-royal/15 flex items-center justify-center shrink-0">
                      <User size={18} className="text-extreme-royal" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-manrope font-semibold text-white">
                        Avaliação #{historyScans.length - i}
                        {i === 0 && <Badge variant="royal" size="sm" className="ml-2">Mais recente</Badge>}
                      </p>
                      <p className="text-xs text-white/40 font-dm-sans">
                        {format(new Date(scan.date), "d 'de' MMMM, yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-right">
                      <div>
                        <p className="text-[10px] text-white/30 font-dm-sans">Gordura</p>
                        <p className="text-sm font-manrope font-bold text-white">{scan.fatPercentage}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 font-dm-sans">Muscular</p>
                        <p className="text-sm font-manrope font-bold text-white">{scan.muscleMass}kg</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 font-dm-sans">IMC</p>
                        <p className="text-sm font-manrope font-bold text-white">{scan.imc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* STATE: uploading / processing */}
      {(scanState === 'uploading' || scanState === 'processing') && (
        <Card className="border border-extreme-royal/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-extreme-royal/5 to-transparent pointer-events-none" />
          <div className="relative py-12 flex flex-col items-center gap-8">
            {/* Animated scan visual */}
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full border-2 border-extreme-royal/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-extreme-royal/40 animate-ping [animation-delay:150ms]" />
              <div className="absolute inset-4 rounded-full border border-extreme-royal/60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-extreme-royal/10 flex items-center justify-center">
                  <Scan size={28} className="text-extreme-royal animate-pulse" />
                </div>
              </div>
              {/* Scan line */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-extreme-royal to-transparent opacity-80"
                  style={{
                    top: `${(processingStep / (PROCESSING_STEPS.length - 1)) * 100}%`,
                    transition: 'top 0.9s ease-in-out',
                  }}
                />
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center gap-2 justify-center">
                <Loader2 size={16} className="text-extreme-royal animate-spin" />
                <p className="font-manrope font-semibold text-white text-lg">
                  {scanState === 'uploading' ? 'Enviando fotos...' : PROCESSING_STEPS[processingStep]}
                </p>
              </div>
              <p className="text-sm text-white/40 font-dm-sans">
                {scanState === 'uploading'
                  ? 'Transmitindo imagens para a API com segurança'
                  : 'Nossa IA está analisando sua composição corporal'}
              </p>
            </div>

            {/* Photos preview strip */}
            <div className="flex gap-3">
              {PHOTO_SLOTS.map(slot => (
                <div key={slot.key} className="relative">
                  <div className="w-16 h-20 rounded-xl overflow-hidden border border-white/10">
                    <img
                      src={photos[slot.key]?.preview}
                      alt={slot.label}
                      className="w-full h-full object-cover opacity-60"
                    />
                  </div>
                  <p className="text-[10px] text-white/30 font-dm-sans text-center mt-1">{slot.label}</p>
                </div>
              ))}
            </div>

            {/* Progress steps */}
            {scanState === 'processing' && (
              <div className="w-full max-w-sm space-y-2">
                {PROCESSING_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      i < processingStep
                        ? 'bg-emerald-500'
                        : i === processingStep
                        ? 'bg-extreme-royal animate-pulse'
                        : 'bg-white/10'
                    }`}>
                      {i < processingStep && <CheckCircle size={10} className="text-white" />}
                    </div>
                    <p className={`text-xs font-dm-sans transition-all ${
                      i <= processingStep ? 'text-white/70' : 'text-white/20'
                    }`}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* STATE: complete — results */}
      {scanState === 'complete' && scanResults && (
        <>
          {/* Success banner */}
          <div className="flex items-center gap-3 p-4 glass-card rounded-2xl border border-emerald-500/20">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
              <CheckCircle size={20} className="text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-manrope font-semibold text-white">Avaliação concluída</p>
              <p className="text-xs text-white/40 font-dm-sans">
                Analisado em {format(new Date(), "d 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
            <div className="flex gap-2">
              {PHOTO_SLOTS.map(slot => (
                <div key={slot.key} className="w-8 h-10 rounded-lg overflow-hidden border border-white/10 opacity-60">
                  <img src={photos[slot.key]?.preview} alt={slot.label} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'IMC',
                value: scanResults.imc.toFixed(1),
                unit: 'kg/m²',
                status: scanResults.imc < 25 ? 'Normal' : 'Sobrepeso',
                statusColor: scanResults.imc < 25 ? 'green' : 'yellow',
                delta: prevScan ? getDelta(scanResults.imc, prevScan.imc, true) : null,
              },
              {
                label: '% Gordura',
                value: scanResults.fatPercentage.toFixed(1),
                unit: '%',
                status: scanResults.fatPercentage < 15 ? 'Atlético' : 'Moderado',
                statusColor: scanResults.fatPercentage < 15 ? 'green' : 'royal',
                delta: prevScan ? getDelta(scanResults.fatPercentage, prevScan.fatPercentage, true) : null,
              },
              {
                label: 'Massa Muscular',
                value: scanResults.muscleMass.toFixed(1),
                unit: 'kg',
                status: 'Excelente',
                statusColor: 'green',
                delta: prevScan ? getDelta(scanResults.muscleMass, prevScan.muscleMass) : null,
              },
              {
                label: 'Hidratação',
                value: scanResults.hydration.toFixed(1),
                unit: '%',
                status: scanResults.hydration > 60 ? 'Ótimo' : 'Atenção',
                statusColor: scanResults.hydration > 60 ? 'green' : 'yellow',
                delta: prevScan ? getDelta(scanResults.hydration, prevScan.hydration) : null,
              },
            ].map(metric => (
              <Card key={metric.label}>
                <p className="text-xs text-white/40 font-dm-sans uppercase tracking-wider mb-2">{metric.label}</p>
                <div className="flex items-end gap-2 mb-2">
                  <p className="font-manrope font-black text-3xl text-white">{metric.value}</p>
                  <p className="text-sm text-white/40 font-dm-sans mb-1">{metric.unit}</p>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={metric.statusColor as 'green' | 'yellow' | 'royal'} size="sm">
                    {metric.status}
                  </Badge>
                  {metric.delta && (
                    <div className={`flex items-center gap-1 text-xs font-manrope font-semibold ${metric.delta.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {metric.delta.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {metric.delta.delta}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Chart + extra metrics */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução da Composição Corporal</CardTitle>
                  <Badge variant="royal">{historyScans.length + 1} avaliações</Badge>
                </CardHeader>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Sans' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'DM Sans' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'DM Sans', color: 'rgba(255,255,255,0.5)' }} />
                    <Line type="monotone" dataKey="gordura" stroke="#FF6B00" strokeWidth={2} dot={{ fill: '#FF6B00', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="hidratacao" stroke="#4169E1" strokeWidth={2} dot={{ fill: '#4169E1', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card>
              <CardTitle className="mb-4">Métricas Adicionais</CardTitle>
              <div className="space-y-4">
                {[
                  { label: 'Idade Metabólica', value: `${scanResults.metabolicAge} anos`, note: scanResults.metabolicAge < 30 ? '↓ Abaixo da sua idade' : '→ Equivalente' },
                  { label: 'Gordura Visceral', value: `Nível ${scanResults.visceralFat}`, note: scanResults.visceralFat <= 5 ? 'Normal' : 'Atenção' },
                  { label: 'Massa Óssea', value: `${scanResults.boneMass}kg`, note: 'Normal para o peso' },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/50 font-dm-sans">{m.label}</span>
                      <span className="font-manrope font-semibold text-white">{m.value}</span>
                    </div>
                    <p className="text-xs text-emerald-400 font-dm-sans">{m.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-white/5">
                <p className="text-xs text-white/30 font-dm-sans mb-3">Fotos enviadas</p>
                <div className="flex gap-2">
                  {PHOTO_SLOTS.map(slot => (
                    <div key={slot.key} className="flex-1">
                      <div className="aspect-[3/4] rounded-lg overflow-hidden border border-white/8">
                        <img src={photos[slot.key]?.preview} alt={slot.label} className="w-full h-full object-cover opacity-70" />
                      </div>
                      <p className="text-[10px] text-white/30 font-dm-sans text-center mt-1">{slot.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Upload */}
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RefreshCw size={16} />
              Fazer nova avaliação
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
