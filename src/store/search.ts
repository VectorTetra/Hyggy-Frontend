// store/search.ts
import { create } from "zustand";

interface SearchStore {
  activeTab: string;
  setActiveTab: (value: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  isPriceRangeOpen: boolean; // Add the missing property
  setIsPriceRangeOpen: (value: boolean) => void;
  isCategoryOpen: boolean; // Add the missing property
  setIsCategoryOpen: (value: boolean) => void;
  selectedFilters: string[];
  addFilter: (filter: string) => void;
  removeFilter: (filter: string) => void;
  clearFilters: () => void;
  //PriceRange
  minPossible: number;
  maxPossible: number;
  setMinPossible: (minPossible: number) => void;
  setMaxPossible: (maxPossible: number) => void;
}

const useSearchStore = create<SearchStore>((set) => ({
  isSidebarOpen: false,
  setIsSidebarOpen: (value: boolean) => set({ isSidebarOpen: value }),
  isPriceRangeOpen: false,
  setIsPriceRangeOpen: (value: boolean) => set({ isPriceRangeOpen: value }),
  isCategoryOpen: false,
  setIsCategoryOpen: (value: boolean) => set({ isCategoryOpen: value }),
  selectedFilters: [],
  addFilter: (filter: string) =>
    set((state) => ({
      selectedFilters: [...state.selectedFilters, filter],
    })),
  removeFilter: (filter: string) =>
    set((state) => ({
      selectedFilters: state.selectedFilters.filter((f) => f !== filter),
    })),
  clearFilters: () => set({ selectedFilters: [] }),
  minPossible: 0,
  maxPossible: 10000,
  setMinPossible: (minPossible) => set({ minPossible }),
  setMaxPossible: (maxPossible) => set({ maxPossible }),
  activeTab: "wares",
  setActiveTab: (value) => set({ activeTab: value }),
}));

export default useSearchStore;
