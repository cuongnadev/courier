import { Navigate } from "@tanstack/react-router";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";

type PublicRouteProps = {
  children: React.ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
  useAuthSession();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}