import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const { currentUser, isAdmin, switchRole, updateUser } = useAuthStore();
  return { currentUser, isAdmin, switchRole, updateUser };
}
