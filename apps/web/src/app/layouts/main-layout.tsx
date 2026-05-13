import { Outlet } from '@tanstack/react-router';

import { useAuthMe } from '@/features/auth/hooks/use-auth-me';
import { Header } from '@/components/layout/header/header';
import { Sidebar } from '@/components/layout/sidebar/sidebar';

export default function MainLayout() {
  useAuthMe();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FAFAFA]">
      {/* sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}