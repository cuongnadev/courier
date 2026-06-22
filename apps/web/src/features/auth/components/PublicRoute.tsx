import { Navigate } from "@tanstack/react-router";

import { useAuthStore } from "@/features/auth/store";

import { ROUTE_TO } from "@/constants";

type PublicRouteProps = {
  children: React.ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to={ROUTE_TO.ROOT} replace />;
  }

  return children;
}