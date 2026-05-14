// Fake data for now, replace with backend query later
import { mockToolCounts } from "../data/mock-tool-counts";

export function useToolCounts() {
    return {
        toolCounts: mockToolCounts,
        isLoading: false,
        error: null,
    };
}