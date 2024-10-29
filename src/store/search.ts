// store/search.ts
import { create } from "zustand";
import { Ware } from "@/pages/api/WareApi";
import { Blog } from "@/pages/api/BlogApi";

// f_0 : Фільтр ціни, значення вказується через нижнє підкреслення (напр. 250_8000) 
// в масиві зберігаються об'єкти з ім'ям та значенням фільтру (напр. {name: "f_0", value: "250_8000"})
// f_1 : Фільтр категорії, назви категорії в URL вказується через pipe (напр. Комоди|Столи|Стільці)
// в масиві зберігаються кілька об'єктів з ім'ям та значенням фільтру (напр. {name: "f_1", value: "Комоди"})
// f_2 : Фільтр завжди низької ціни, (напр. IKEA|Hoff) 
export interface Filter {
  name: string;
  value: string;
}

interface SearchStore {
  activeTab: string;
  setActiveTab: (value: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  isPriceRangeOpen: boolean;
  setIsPriceRangeOpen: (value: boolean) => void;
  isCategoryOpen: boolean;
  setIsCategoryOpen: (value: boolean) => void;
  isTrademarksOpen: boolean;
  setIsTrademarksOpen: (value: boolean) => void;
  isStatusOpen: boolean;
  setIsStatusOpen: (value: boolean) => void;
  isSortingSidebarOpen: boolean;
  setIsSortingSidebarOpen: (value: boolean) => void;
  waresBeforeCategories: Ware[];
  setWaresBeforeCategories: (waresBeforeCategories: Ware[]) => void;
  minPossible: number;
  maxPossible: number;
  setMinPossible: (minPossible: number) => void;
  setMaxPossible: (maxPossible: number) => void;
  filteredWares: Ware[];
  setFilteredWares: (filteredWares: Ware[]) => void;
  filteredBlogs: Blog[];
  setFilteredBlogs: (filteredBlogs: Blog[]) => void;
  categoriesMap: Record<string, string>;
  trademarksMap: Record<string, string>;
  statusesMap: Record<string, string>;
  setCategoriesMap: (map: Record<string, string>) => void;
  setTrademarksMap: (map: Record<string, string>) => void;
  setStatusesMap: (map: Record<string, string>) => void;
}

const useSearchStore = create<SearchStore>((set) => ({
  activeTab: "wares",
  setActiveTab: (value) => set({ activeTab: value }),
  isSidebarOpen: false,
  setIsSidebarOpen: (value) => set({ isSidebarOpen: value }),
  isPriceRangeOpen: false,
  setIsPriceRangeOpen: (value) => set({ isPriceRangeOpen: value }),
  isCategoryOpen: false,
  setIsCategoryOpen: (value) => set({ isCategoryOpen: value }),
  isTrademarksOpen: false,
  setIsTrademarksOpen: (value) => set({ isTrademarksOpen: value }),
  isStatusOpen: false,
  setIsStatusOpen: (value) => set({ isStatusOpen: value }),
  isSortingSidebarOpen: false,
  setIsSortingSidebarOpen: (value) => set({ isSortingSidebarOpen: value }),
  waresBeforeCategories: [],
  setWaresBeforeCategories: (waresBeforeCategories) => set({ waresBeforeCategories }),
  minPossible: 0,
  maxPossible: 10000,
  setMinPossible: (minPossible) => set({ minPossible }),
  setMaxPossible: (maxPossible) => set({ maxPossible }),
  filteredWares: [],
  setFilteredWares: (filteredWares) => set({ filteredWares }),
  filteredBlogs: [],
  setFilteredBlogs: (filteredBlogs) => set({ filteredBlogs }),
  categoriesMap: {},
  trademarksMap: {},
  statusesMap: {},
  setCategoriesMap: (map) => set({ categoriesMap: map }),
  setTrademarksMap: (map) => set({ trademarksMap: map }),
  setStatusesMap: (map) => set({ statusesMap: map }),
}));

export default useSearchStore;
