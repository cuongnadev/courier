import { Navigate } from "@tanstack/react-router";

import { useAuthStore } from "@/features/auth/store/auth.store";

import { AsyncLoadingGate } from '@/components/common/loader/async-loading-gate';
import { useBootstrapSession } from '@/features/auth/hooks/use-bootstrap-session';

type PublicRouteProps = {
  children: React.ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
  const { isBootstrapping } = useBootstrapSession();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  if (!isBootstrapping && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AsyncLoadingGate
      isLoading={isBootstrapping}
      label="Checking login session..."
      fullScreen
    >
      {children}
    </AsyncLoadingGate>
  );
}