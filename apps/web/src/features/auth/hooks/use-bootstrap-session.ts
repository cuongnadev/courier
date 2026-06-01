import { useEffect, useState } from "react";
import { getMeApi, refreshTokenApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function useBootstrapSession() {
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const setAuth = useAuthStore((state) => state.setAuth);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const refreshData = await refreshTokenApi();

        if (isMounted) {
          setAccessToken(refreshData.accessToken);

          const user = await getMeApi();

          if (isMounted) {
            setAuth(user, refreshData.accessToken);
          }
        }
      } catch {
        if (isMounted) {
          clearAuth();
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, [setAuth, setAccessToken, clearAuth]);

  return { isBootstrapping };
}