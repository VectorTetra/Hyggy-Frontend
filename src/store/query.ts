import { create } from 'zustand';
import { useWares } from '@/pages/api/WareApi';
import { getDecodedToken } from '@/pages/api/TokenApi';
import { Ware } from '@/pages/api/WareApi';

interface QueryStore {
    RefetchFavoriteWares: boolean;
    setRefetchFavoriteWares: (value: boolean) => void;
}

const useQueryStore = create<QueryStore>((set) => ({
    RefetchFavoriteWares: false,
    setRefetchFavoriteWares: (value) => set({ RefetchFavoriteWares: value }),
}));

export default useQueryStore;
