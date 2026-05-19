import { create } from 'zustand';
import type { Notification } from '@/types';

interface ToastNotification {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationState {
  notifications: Notification[];
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  markAllRead: () => void;
}

const initialNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Resultado validado!',
    message: 'Seu resultado no 800m foi validado pelo administrador.',
    type: 'success',
    read: false,
    createdAt: '2025-05-18T09:30:00',
  },
  {
    id: 'n2',
    title: 'Novo evento disponível',
    message: 'Campeonato Estadual SP 2025 está aceitando inscrições.',
    type: 'info',
    read: false,
    createdAt: '2025-05-17T14:00:00',
  },
  {
    id: 'n3',
    title: 'Conquista desbloqueada!',
    message: 'Você ganhou a conquista "100 Atividades".',
    type: 'success',
    read: true,
    createdAt: '2025-05-16T18:45:00',
  },
  {
    id: 'n4',
    title: 'Body scan agendado',
    message: 'Seu body scan foi agendado para 25/05/2025 às 10h.',
    type: 'info',
    read: true,
    createdAt: '2025-05-15T11:20:00',
  },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: initialNotifications,
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${Date.now()}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    // Auto remove after 4s
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  markAllRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },
}));
