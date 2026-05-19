import { useState } from 'react';
import { Trophy, Share2, Lock, Star, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { useNotificationStore } from '@/stores/notificationStore';
import { mockAchievements } from '@/data';
import { getRarityColor, getRarityLabel, cn } from '@/lib/utils';
import type { AchievementCategory } from '@/types';

const categoryLabels: Record<AchievementCategory, string> = {
  consistencia: 'Consistência',
  competicao: 'Competição',
  forca: 'Força',
  velocidade: 'Velocidade',
  comunidade: 'Comunidade',
};

const categoryIcons: Record<AchievementCategory, string> = {
  consistencia: '🔥',
  competicao: '🏆',
  forca: '💪',
  velocidade: '⚡',
  comunidade: '👥',
};

export function Achievements() {
  const { addToast } = useNotificationStore();
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');
  const [sharedId, setSharedId] = useState<string | null>(null);

  const categories: Array<AchievementCategory | 'all'> = ['all', 'consistencia', 'competicao', 'forca', 'velocidade', 'comunidade'];

  const filtered = activeCategory === 'all'
    ? mockAchievements
    : mockAchievements.filter(a => a.category === activeCategory);

  const unlocked = mockAchievements.filter(a => a.unlocked);
  const inProgress = mockAchievements.filter(a => !a.unlocked && (a.progress || 0) > 0);
  const totalPoints = unlocked.reduce((sum, a) => sum + a.points, 0);

  // Achievement closest to completion
  const closestToComplete = inProgress.sort((a, b) => (b.progress || 0) - (a.progress || 0))[0];

  const handleShare = (id: string, name: string) => {
    setSharedId(id);
    addToast({
      title: 'Conquista compartilhada!',
      description: `"${name}" foi compartilhada nas redes sociais.`,
      type: 'success',
    });
    setTimeout(() => setSharedId(null), 2000);
  };

  const rarityGradient: Record<string, string> = {
    common: 'from-gray-600/20 to-gray-800/20 border-gray-600/20',
    rare: 'from-blue-600/20 to-blue-800/20 border-blue-600/30',
    epic: 'from-purple-600/20 to-purple-800/20 border-purple-600/30',
    legendary: 'from-yellow-600/20 to-yellow-800/20 border-yellow-500/40',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-manrope font-black text-3xl text-white mb-2">Conquistas</h1>
        <p className="text-white/50 font-dm-sans">{unlocked.length} de {mockAchievements.length} desbloqueadas</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Desbloqueadas', value: unlocked.length, icon: <Trophy size={20} />, color: 'royal' },
          { label: 'Pontos Ganhos', value: totalPoints.toLocaleString('pt-BR'), icon: <Star size={20} />, color: 'orange' },
          { label: 'Em Progresso', value: inProgress.length, icon: <Zap size={20} />, color: 'royal' },
        ].map(stat => (
          <Card key={stat.label}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color === 'royal' ? 'bg-extreme-royal/15 text-extreme-royal' : 'bg-extreme-orange/15 text-extreme-orange'}`}>
              {stat.icon}
            </div>
            <p className="font-manrope font-black text-2xl text-white">{stat.value}</p>
            <p className="text-xs text-white/40 font-dm-sans mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Meta atual — closest to complete */}
      {closestToComplete && (
        <Card className="border border-extreme-orange/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-extreme-orange/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="orange">
                <Zap size={10} /> Meta Atual
              </Badge>
              <p className="text-xs text-white/40 font-dm-sans">mais próxima de completar</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-4xl">{closestToComplete.icon}</div>
              <div className="flex-1">
                <h3 className="font-manrope font-bold text-white text-lg">{closestToComplete.name}</h3>
                <p className="text-sm text-white/50 font-dm-sans mb-3">{closestToComplete.description}</p>
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/40 font-dm-sans">{closestToComplete.requirement}</span>
                    <span className="font-manrope font-semibold text-extreme-orange">{closestToComplete.progress}%</span>
                  </div>
                  <Progress value={closestToComplete.progress || 0} color="orange" />
                </div>
                <p className="text-xs text-white/40 font-dm-sans">
                  Recompensa: <span className="text-extreme-orange font-manrope font-semibold">+{closestToComplete.points} pontos</span> · <span className={getRarityColor(closestToComplete.rarity)}>{getRarityLabel(closestToComplete.rarity)}</span>
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-manrope font-semibold transition-all duration-150',
              activeCategory === cat
                ? 'bg-extreme-royal text-white'
                : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/8'
            )}
          >
            {cat === 'all' ? 'Todas' : `${categoryIcons[cat]} ${categoryLabels[cat]}`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ach => (
          <div
            key={ach.id}
            className={cn(
              'rounded-2xl p-5 border transition-all duration-200',
              ach.unlocked
                ? `bg-gradient-to-br ${rarityGradient[ach.rarity]} hover:-translate-y-0.5`
                : 'bg-white/3 border-white/8 opacity-70 hover:opacity-90'
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="relative">
                <span className={cn('text-4xl', !ach.unlocked && 'grayscale opacity-40')}>{ach.icon}</span>
                {!ach.unlocked && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-extreme-dark rounded-full flex items-center justify-center border border-white/10">
                    <Lock size={10} className="text-white/40" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={cn('text-xs font-manrope font-semibold', getRarityColor(ach.rarity))}>
                  {getRarityLabel(ach.rarity)}
                </span>
                <span className="text-xs text-extreme-orange font-manrope font-bold">+{ach.points}pts</span>
              </div>
            </div>

            <h3 className="font-manrope font-bold text-white text-sm mb-1">{ach.name}</h3>
            <p className="text-xs text-white/50 font-dm-sans mb-3 leading-relaxed">{ach.description}</p>

            {ach.unlocked ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs text-emerald-400 font-manrope font-semibold">Desbloqueada</span>
                </div>
                <button
                  onClick={() => handleShare(ach.id, ach.name)}
                  className="p-1.5 text-white/30 hover:text-white/60 transition-colors rounded-lg hover:bg-white/5"
                  title="Compartilhar"
                >
                  {sharedId === ach.id ? (
                    <span className="text-xs text-emerald-400 font-dm-sans">✓</span>
                  ) : (
                    <Share2 size={13} />
                  )}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-[10px] mb-1.5">
                  <span className="text-white/30 font-dm-sans">{ach.requirement}</span>
                  {(ach.progress || 0) > 0 && (
                    <span className="font-manrope font-semibold text-white/50">{ach.progress}%</span>
                  )}
                </div>
                {(ach.progress || 0) > 0 ? (
                  <Progress value={ach.progress || 0} size="sm" color="royal" />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Lock size={10} className="text-white/30" />
                    <span className="text-[10px] text-white/30 font-dm-sans">Bloqueada</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
