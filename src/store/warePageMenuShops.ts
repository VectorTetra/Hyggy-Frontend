import { create } from "zustand";

interface WarePageMenuShops {
    isWarePageMenuShopsOpened: boolean;
    setIsWarePageMenuShopsOpened: (value: boolean) => void;
}

const useWarePageMenuShops = create<WarePageMenuShops>((set) => ({
    isWarePageMenuShopsOpened: false,
    setIsWarePageMenuShopsOpened: (value: boolean) => set({ isWarePageMenuShopsOpened: value }),

}));

export default useWarePageMenuShops;