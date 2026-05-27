import { AsyncLoadingGate } from '@/components/common/loader/async-loading-gate';
import { useBootstrapSession } from '@/features/auth/hooks/use-bootstrap-session';
import { queryClient } from '@/lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';

function BootstrapSessionProvider({ children }: { children: React.ReactNode }) {
    const { isBootstrapping } = useBootstrapSession();

    return (
        <AsyncLoadingGate
            isLoading={isBootstrapping}
            label="Checking login session..."
        >
            {children}
        </AsyncLoadingGate>
    );
}

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <BootstrapSessionProvider>
                {children}
            </BootstrapSessionProvider>
        </QueryClientProvider>
    );
}