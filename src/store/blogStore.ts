import { create } from 'zustand';

type CurrentCategory = {
    currentCategory: string;
    currentCategory2: string;
    setCurrentCategory: (value: string) => void;
    setCurrentCategory2: (value: string) => void;
}

export const useCurrentCategory = create<CurrentCategory>((set) => ({
    currentCategory: "",
    currentCategory2: "",
    setCurrentCategory: (value) => set({ currentCategory: value }),
    setCurrentCategory2: (value) => set({ currentCategory2: value }),
}));

