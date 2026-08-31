import { queryClient } from '@/lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';

import { SearchProvider } from '@/features/search/provider/SearchProvider';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <SearchProvider>{children}</SearchProvider>
        </QueryClientProvider>
    );
}