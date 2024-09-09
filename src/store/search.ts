import { create } from "zustand";

// Інтерфейс для опису типу сортування
// export interface Types {
//   activeTab: "wares" | "articles";
// }

interface SearchStore {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}

const useSearchStore = create<SearchStore>((set) => ({
  isSidebarOpen: false,
  setIsSidebarOpen: (value: boolean) => set({ isSidebarOpen: value }),
}));

export default useSearchStore;
