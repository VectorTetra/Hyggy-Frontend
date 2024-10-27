import { create } from "zustand";

interface MainPageMenuStore {
    isMainPageMenuOpened: boolean;
    setIsMainPageMenuOpened: (value: boolean) => void;
}

const useMainPageMenuStore = create<MainPageMenuStore>((set) => ({
    isMainPageMenuOpened: false,
    setIsMainPageMenuOpened: (value: boolean) => set({ isMainPageMenuOpened: value }),

}));

export default useMainPageMenuStore;

