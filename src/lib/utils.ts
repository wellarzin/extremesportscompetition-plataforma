import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function getModalityLabel(modality: string): string {
  const labels: Record<string, string> = {
    atletismo: 'Atletismo',
    crossfit: 'CrossFit',
    'body-scan': 'Body Scan',
    natacao: 'Natação',
    ciclismo: 'Ciclismo',
    escalada: 'Escalada',
    surf: 'Surf',
    mma: 'MMA',
    gymnastics: 'Ginástica',
  }
  return labels[modality] || modality
}

export function getPhaseLabel(phase: string): string {
  const labels: Record<string, string> = {
    estadual: 'Estadual',
    nacional: 'Nacional',
    final: 'Final',
  }
  return labels[phase] || phase
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Rascunho',
    active: 'Ativo',
    ongoing: 'Em Andamento',
    finished: 'Finalizado',
    classificado: 'Classificado',
    'em-disputa': 'Em Disputa',
    desclassificado: 'Desclassificado',
  }
  return labels[status] || status
}

export function getActivityLabel(type: string): string {
  const labels: Record<string, string> = {
    burpees: 'Burpees',
    'pull-ups': 'Pull-ups',
    'push-ups': 'Flexões',
    'box-jumps': 'Box Jumps',
    'double-unders': 'Double-unders',
    rowing: 'Remo',
    running: 'Corrida',
    'air-squats': 'Air Squats',
    dips: 'Dips',
    'handstand-push-ups': 'HSPU',
    'toes-to-bar': 'Toes to Bar',
    'muscle-ups': 'Muscle-ups',
    'ring-dips': 'Ring Dips',
    'jump-rope': 'Pular Corda',
    'strava-run': 'Corrida (Strava)',
    'strava-ride': 'Ciclismo (Strava)',
    'strava-swim': 'Natação (Strava)',
  }
  return labels[type] || type
}

export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: 'text-gray-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-yellow-400',
  }
  return colors[rarity] || 'text-gray-400'
}

export function getRarityLabel(rarity: string): string {
  const labels: Record<string, string> = {
    common: 'Comum',
    rare: 'Raro',
    epic: 'Épico',
    legendary: 'Lendário',
  }
  return labels[rarity] || rarity
}

export function formatTimeDisplay(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`
  }
  const mins = Math.floor(seconds / 60)
  const secs = (seconds % 60).toFixed(1)
  return `${mins}:${secs.toString().padStart(4, '0')}`
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
