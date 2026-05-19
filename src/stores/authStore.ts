import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { currentAthleteUser, currentAdminUser } from '@/data';

interface AuthState {
  currentUser: User;
  isAdmin: boolean;
  switchRole: (role: 'athlete' | 'admin') => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: currentAthleteUser,
      isAdmin: false,

      switchRole: (role) => {
        set({
          currentUser: role === 'admin' ? currentAdminUser : currentAthleteUser,
          isAdmin: role === 'admin',
        });
      },

      updateUser: (updates) => {
        set((state) => ({
          currentUser: { ...state.currentUser, ...updates },
        }));
      },
    }),
    {
      name: 'auth-store',
    }
  )
);
