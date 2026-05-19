import type { ActivityType } from '@/types';

export interface Movement {
  type: ActivityType;
  name: string;
  category: 'cardio' | 'gymnastics' | 'mono-structural';
  description: string;
  unit: 'reps' | 'distance' | 'time';
  unitLabel: string;
  tipicalReps?: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  pointsPerUnit: number;
}

export const movements: Movement[] = [
  {
    type: 'burpees',
    name: 'Burpees',
    category: 'cardio',
    description: 'Agachamento, prancha, flexão, salto e palma. O movimento funcional mais completo.',
    unit: 'reps',
    unitLabel: 'repetições',
    tipicalReps: 100,
    difficulty: 3,
    pointsPerUnit: 0.5,
  },
  {
    type: 'pull-ups',
    name: 'Pull-ups',
    category: 'gymnastics',
    description: 'Barra fixa, pronação. Puxar o queixo acima da barra. Strict ou kipping.',
    unit: 'reps',
    unitLabel: 'repetições',
    tipicalReps: 15,
    difficulty: 4,
    pointsPerUnit: 2,
  },
  {
    type: 'push-ups',
    name: 'Flexões (Push-ups)',
    category: 'gymnastics',
    description: 'Posição de prancha, descer o peito até o chão e empurrar de volta.',
    unit: 'reps',
    unitLabel: 'repetições',
    tipicalReps: 30,
    difficulty: 2,
    pointsPerUnit: 0.8,
  },
  {
    type: 'box-jumps',
    name: 'Box Jumps',
    category: 'cardio',
    description: 'Salto para cima do box com os dois pés, estendendo completamente os quadris no topo.',
    unit: 'reps',
    unitLabel: 'repetições',
    tipicalReps: 20,
    difficulty: 3,
    pointsPerUnit: 1.5,
  },
  {
    type: 'double-unders',
    name: 'Double-unders',
    category: 'cardio',
    description: 'Pular corda com a corda passando duas vezes por salto. Alta demanda de coordenação.',
    unit: 'reps',
    unitLabel: 'repetições',
    tipicalReps: 100,
    difficulty: 3,
    pointsPerUnit: 0.3,
  },
  {
    type: 'rowing',
    name: 'Remo (Ergômetro)',
    category: 'mono-structural',
    description: 'Remo em ergômetro. Trabalho combinado de corpo inteiro, excelente para cardio.',
    unit: 'distance',
    unitLabel: 'metros',
    tipicalReps: 1000,
    difficulty: 3,
    pointsPerUnit: 0.05,
  },
  {
    type: 'running',
    name: 'Corrida',
    category: 'mono-structural',
    description: 'Corrida a pé. Pode ser tiro curto ou distância. Registre em metros.',
    unit: 'distance',
    unitLabel: 'metros',
    tipicalReps: 5000,
    difficulty: 2,
    pointsPerUnit: 0.02,
  },
  {
    type: 'air-squats',
    name: 'Air Squats',
    category: 'gymnastics',
    description: 'Agachamento livre sem peso. Full depth: dobras da coxa abaixo dos joelhos.',
    unit: 'reps',
    unitLabel: 'repetições',
    tipicalReps: 50,
    difficulty: 1,
    pointsPerUnit: 0.4,
  },
  {
    type: 'dips',
    name: 'Dips (Paralelas)',
    category: 'gymnastics',
    description: 'Em barras paralelas ou box, descer até o ângulo de 90° nos cotovelos e empurrar.',
    unit: 'reps',
    unitLabel: 'repetições',
    tipicalReps: 15,
    difficulty: 3,
    pointsPerUnit: 1.2,
  },
  {
    type: 'handstand-push-ups',
    name: 'Handstand Push-ups',
    category: 'gymnastics',
    description: 'Parada de mão na parede. Descer a cabeça ao chão e empurrar de volta. Strict.',
    unit: 'reps',
    unitLabel: 'repetições',
    tipicalReps: 10,
    difficulty: 5,
    pointsPerUnit: 3,
  },
  {
    type: 'toes-to-bar',
    name: 'Toes to Bar',
    category: 'gymnastics',
    description: 'Pendurado na barra, elevar os pés até tocar a barra. Core e flexores de quadril.',
    unit: 'reps',
    unitLabel: 'repetições',
    tipicalReps: 15,
    difficulty: 4,
    pointsPerUnit: 2.5,
  },
  {
    type: 'muscle-ups',
    name: 'Muscle-ups',
    category: 'gymnastics',
    description: 'Pull-up explosivo seguido de dip na barra. Um dos movimentos mais técnicos da ginástica funcional.',
    unit: 'reps',
    unitLabel: 'repetições',
    tipicalReps: 5,
    difficulty: 5,
    pointsPerUnit: 5,
  },
  {
    type: 'ring-dips',
    name: 'Ring Dips',
    category: 'gymnastics',
    description: 'Dips nas argolas. Requer muito mais estabilidade que nas paralelas fixas.',
    unit: 'reps',
    unitLabel: 'repetições',
    tipicalReps: 10,
    difficulty: 4,
    pointsPerUnit: 2.8,
  },
  {
    type: 'jump-rope',
    name: 'Pular Corda',
    category: 'cardio',
    description: 'Pular corda simples. Base para progressão ao double-under.',
    unit: 'reps',
    unitLabel: 'pulos',
    tipicalReps: 500,
    difficulty: 1,
    pointsPerUnit: 0.1,
  },
];

export const getMovementByType = (type: ActivityType): Movement | undefined => {
  return movements.find(m => m.type === type);
};
