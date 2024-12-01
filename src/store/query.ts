import { create } from 'zustand';

interface QueryStore {
    RefetchFavoriteWares: boolean;
    setRefetchFavoriteWares: (value: boolean) => void;
}

const useQueryStore = create<QueryStore>((set) => ({
    RefetchFavoriteWares: false,
    setRefetchFavoriteWares: (value) => set({ RefetchFavoriteWares: value }),
}));

export default useQueryStore;
