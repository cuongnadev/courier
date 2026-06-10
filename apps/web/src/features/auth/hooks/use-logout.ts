// features/auth/hooks/use-logout.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { logoutApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth.store';

import { ROUTE_TO } from '@/constants/route-paths';

export function useLogout() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const clearAuth = useAuthStore(
    (state) => state.clearAuth,
  );

  return useMutation({
    mutationFn: logoutApi,

    onSuccess: async () => {
      clearAuth();

      queryClient.clear();

      toast.success('Logged out successfully');

      await navigate({
        to: ROUTE_TO.LOGIN,
        replace: true,
      });
    },

    onError: () => {
      toast.error('Failed to logout');
    },
  });
}