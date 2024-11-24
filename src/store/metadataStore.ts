// store/metadataStore.ts
import { create } from 'zustand';

type MetadataState = {
    metadataTitle: string;
    metadataDescription: string;
    setMetadataTitle: (title: string) => void;
    setMetadataDescription: (description: string) => void;
};

const useMetadataStore = create<MetadataState>((set) => ({
    metadataTitle: "HYGGY Все для дому",
    metadataDescription: "Все для дому",
    setMetadataTitle: (title) => set(() => ({ metadataTitle: title })),
    setMetadataDescription: (description) => set(() => ({
        metadataDescription: description
    })),
}));

export default useMetadataStore;
