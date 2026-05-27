import { Navigate, Outlet } from '@tanstack/react-router';

import { Header } from '@/components/layout/header/header';
import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { useAuthStore } from '@/features/auth/store/auth.store';

export default function MainLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}