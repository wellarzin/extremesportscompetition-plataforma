import { create } from 'zustand';
import type { Activity } from '@/types';
import { mockActivities } from '@/data';

interface ActivityState {
  activities: Activity[];
  isLoading: boolean;
  addActivity: (activity: Omit<Activity, 'id' | 'verified'>) => Promise<void>;
  getActivitiesForUser: (userId: string) => Activity[];
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: mockActivities,
  isLoading: false,

  addActivity: async (activityData) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const newActivity: Activity = {
      ...activityData,
      id: `a${Date.now()}`,
      verified: false,
    };
    set((state) => ({
      activities: [newActivity, ...state.activities],
      isLoading: false,
    }));
  },

  getActivitiesForUser: (userId) => {
    return get().activities.filter((a) => a.userId === userId);
  },
}));
