import { create } from "zustand";

interface MainPageMenuShops {
    isMainPageMenuShopsOpened: boolean;
    setIsMainPageMenuShopsOpened: (value: boolean) => void;
}

const useMainPageMenuShops = create<MainPageMenuShops>((set) => ({
    isMainPageMenuShopsOpened: false,
    setIsMainPageMenuShopsOpened: (value: boolean) => set({ isMainPageMenuShopsOpened: value }),

}));

export default useMainPageMenuShops;