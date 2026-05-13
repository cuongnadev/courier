import { Outlet } from '@tanstack/react-router';

import { useAuthMe } from '@/features/auth/hooks/use-auth-me';

export default function MainLayout() {
  useAuthMe();
  
  return (
    <div>
      {/* sidebar */}
      {/* header */}

      <Outlet />
    </div>
  );
}