import { useEffect } from 'react';
import { Navigate, Outlet, useParams } from '@tanstack/react-router';

import { Header } from '@/components/layout/header/header';
import { Sidebar } from '@/components/layout/sidebar/sidebar';

import { useAuthStore } from '@/features/auth/store';
import { useWorkspaceStore } from '@/features/workspaces/store';

import { ROUTE_TO } from '@/constants/route-paths';

export default function MainLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { workspaceId } = useParams({
    from: "/workspaces/$workspaceId",
  });

  const setCurrentWorkspaceId = useWorkspaceStore(
    (state) => state.setCurrentWorkspaceId,
  );

  useEffect(() => {
    setCurrentWorkspaceId(workspaceId);
  }, [workspaceId, setCurrentWorkspaceId]);

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTE_TO.LOGIN}
        replace
      />
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FAFAFA]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}