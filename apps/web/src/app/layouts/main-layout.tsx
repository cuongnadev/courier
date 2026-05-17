import { Navigate, Outlet } from '@tanstack/react-router';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { Header } from '@/components/layout/header/header';
import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { AsyncLoadingGate } from '@/components/common/loader';

export default function MainLayout() {
  const { isLoading } = useAuthSession();

  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const shouldShowLoading = !accessToken && isLoading;

  return (
    <AsyncLoadingGate isLoading={shouldShowLoading}>
      {!isAuthenticated ? (
        <Navigate
          to="/login"
          replace
        />
      ) : (
        <div className="flex h-screen w-full overflow-hidden bg-[#FAFAFA]">
          <Sidebar />

          <div className="flex flex-1 flex-col">
            <Header />

            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      )}
    </AsyncLoadingGate>
  );
}