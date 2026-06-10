import { useEffect, useState } from "react";
import axios from "axios";

import { getMeApi, refreshTokenApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";

const MAX_BOOTSTRAP_RETRIES = 5;
const BOOTSTRAP_RETRY_DELAY_MS = 1000;

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function shouldRetryBootstrap(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  /**
   * Backend chưa chạy / mất kết nối / CORS / network fail
   * Axios thường không có response.
   */
  if (!error.response) {
    return true;
  }

  /**
   * Server lỗi tạm thời.
   */
  if (error.response.status >= 500) {
    return true;
  }

  return false;
}

function shouldClearAuth(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return true;
  }

  const status = error.response?.status;

  /**
   * 401 / 403 nghĩa là refresh token không hợp lệ,
   * hết hạn, hoặc user chưa login.
   */
  return status === 401 || status === 403;
}

export function useBootstrapSession() {
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const setAuth = useAuthStore((state) => state.setAuth);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      for (let attempt = 1; attempt <= MAX_BOOTSTRAP_RETRIES; attempt += 1) {
        try {
          const refreshData = await refreshTokenApi();

          if (!isMounted) return;

          setAccessToken(refreshData.accessToken);

          const user = await getMeApi();

          if (!isMounted) return;

          setAuth(user, refreshData.accessToken);
          setIsBootstrapping(false);

          return;
        } catch (error) {
          if (!isMounted) return;

          const isLastAttempt = attempt === MAX_BOOTSTRAP_RETRIES;

          if (shouldClearAuth(error)) {
            clearAuth();
            setIsBootstrapping(false);

            return;
          }

          if (shouldRetryBootstrap(error) && !isLastAttempt) {
            await sleep(BOOTSTRAP_RETRY_DELAY_MS);
            continue;
          }

          /**
           * Nếu retry hết rồi mà backend vẫn lỗi,
           * lúc này mới cho app đi tiếp.
           *
           * Có thể clearAuth để vào login,
           * hoặc giữ nguyên tùy UX bạn muốn.
           */
          clearAuth();
          setIsBootstrapping(false);

          return;
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