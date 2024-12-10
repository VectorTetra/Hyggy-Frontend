import { BlogCategory1 } from '@/pages/api/BlogCategory1Api';
import { BlogCategory2 } from '@/pages/api/BlogCategory2Api';
import { create } from 'zustand';

type CurrentCategory = {
    currentCategory: BlogCategory1 | null;
    currentCategory2: BlogCategory2 | null;
    setCurrentCategory: (value: BlogCategory1 | null) => void;
    setCurrentCategory2: (value: BlogCategory2 | null) => void;
}

export const useCurrentCategory = create<CurrentCategory>((set) => ({
    currentCategory: null,
    currentCategory2: null,
    setCurrentCategory: (value) => set({ currentCategory: value }),
    setCurrentCategory2: (value) => set({ currentCategory2: value }),
}));

