import { Navigate, Outlet } from '@tanstack/react-router';

import { Header } from '@/components/layout/header/header';
import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { useAuthStore } from '@/features/auth/store/auth.store';

import { AsyncLoadingGate } from '@/components/common/loader/async-loading-gate';
import { useBootstrapSession } from '@/features/auth/hooks/use-bootstrap-session';

export default function MainLayout() {
  const { isBootstrapping } = useBootstrapSession();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isBootstrapping && !isAuthenticated) {
    return (
      <Navigate
        to="/login"
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
          <AsyncLoadingGate
            isLoading={isBootstrapping}
            fullScreen={false}
            label="Checking login session..."
          >
            <Outlet />
          </AsyncLoadingGate>
        </main>
      </div>
    </div>
  );
}