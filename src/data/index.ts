export * from './users';
export * from './events';
export * from './activities';
export * from './achievements';
export * from './scoring';
export * from './movements';

// Body scan mock data
import type { BodyScan } from '@/types';

export const mockBodyScans: BodyScan[] = [
  {
    id: 'bs1',
    userId: 'u1',
    date: '2025-05-01',
    imc: 22.4,
    fatPercentage: 12.8,
    muscleMass: 72.4,
    hydration: 63.2,
    boneMass: 3.4,
    metabolicAge: 24,
    visceralFat: 4,
  },
  {
    id: 'bs2',
    userId: 'u1',
    date: '2025-04-01',
    imc: 22.8,
    fatPercentage: 13.9,
    muscleMass: 71.1,
    hydration: 62.1,
    boneMass: 3.4,
    metabolicAge: 25,
    visceralFat: 5,
  },
  {
    id: 'bs3',
    userId: 'u1',
    date: '2025-03-01',
    imc: 23.1,
    fatPercentage: 15.2,
    muscleMass: 69.8,
    hydration: 60.8,
    boneMass: 3.3,
    metabolicAge: 26,
    visceralFat: 6,
  },
  {
    id: 'bs4',
    userId: 'u1',
    date: '2025-02-01',
    imc: 23.4,
    fatPercentage: 16.1,
    muscleMass: 68.5,
    hydration: 59.9,
    boneMass: 3.3,
    metabolicAge: 27,
    visceralFat: 6,
  },
  {
    id: 'bs5',
    userId: 'u1',
    date: '2025-01-01',
    imc: 23.8,
    fatPercentage: 17.4,
    muscleMass: 67.2,
    hydration: 58.7,
    boneMass: 3.2,
    metabolicAge: 28,
    visceralFat: 7,
  },
];

// Teams mock data
export interface TeamData {
  id: string;
  name: string;
  state: string;
  city: string;
  athletes: Array<{ name: string; gender: 'M' | 'F'; age: number }>;
  eventsCount: number;
  totalPoints: number;
}

export const mockTeams: TeamData[] = [
  {
    id: 'team1',
    name: 'São Paulo Warriors',
    state: 'SP',
    city: 'São Paulo',
    athletes: [
      { name: 'Rafael Monteiro', gender: 'M', age: 28 },
      { name: 'Juliana Mendes', gender: 'F', age: 26 },
      { name: 'Caio Rodrigues', gender: 'M', age: 30 },
      { name: 'Ana Beatriz', gender: 'F', age: 24 },
      { name: 'Vinícius Porto', gender: 'M', age: 27 },
      { name: 'Larissa Fonseca', gender: 'F', age: 25 },
      { name: 'Leonardo Cruz', gender: 'M', age: 32 },
      { name: 'Patrícia Neves', gender: 'F', age: 29 },
      { name: 'Henrique Lima', gender: 'M', age: 26 },
      { name: 'Gabriela Santos', gender: 'F', age: 23 },
      { name: 'Felipe Moura', gender: 'M', age: 31 },
      { name: 'Sabrina Rocha', gender: 'F', age: 27 },
    ],
    eventsCount: 8,
    totalPoints: 384,
  },
  {
    id: 'team2',
    name: 'Santos Sharks',
    state: 'SP',
    city: 'Santos',
    athletes: [
      { name: 'Carla Souza', gender: 'F', age: 25 },
      { name: 'Vanessa Torres', gender: 'F', age: 24 },
      { name: 'Marco Antônio', gender: 'M', age: 29 },
      { name: 'Igor Cavalcante', gender: 'M', age: 27 },
      { name: 'Fernanda Dias', gender: 'F', age: 26 },
      { name: 'Rodrigo Leite', gender: 'M', age: 30 },
      { name: 'Natalia Prado', gender: 'F', age: 23 },
      { name: 'Anderson Melo', gender: 'M', age: 28 },
      { name: 'Bianca Ferraz', gender: 'F', age: 25 },
      { name: 'Gustavo Reis', gender: 'M', age: 31 },
      { name: 'Claudia Monteiro', gender: 'F', age: 27 },
      { name: 'Rafael Costa', gender: 'M', age: 26 },
    ],
    eventsCount: 6,
    totalPoints: 312,
  },
];

// Weekly goal mock
export const mockWeeklyGoal = {
  label: 'Treinar 5x esta semana',
  current: 3,
  target: 5,
  unit: 'sessões',
  percentage: 60,
};
