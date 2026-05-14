import { useState } from "react";

// Fake data for now, replace with backend query later
import { collections } from "@/features/collections/data/mock-collections";

export function useCollectionSidebar() {
    const [openCollections, setOpenCollections] = useState<
        Record<string, boolean>
    >({
        auth: true,
        products: false,
        payment: false,
    });

    const toggleCollection = (collectionId: string) => {
        setOpenCollections((prev) => ({
            ...prev,
            [collectionId]: !prev[collectionId],
        }));
    };

    return {
        collections,
        openCollections,
        toggleCollection,
    };
}