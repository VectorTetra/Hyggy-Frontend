// store/search.ts
import { create } from "zustand";
import { Ware } from "@/types/searchTypes";

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
  isSortingSidebarOpen: boolean;
  setIsSortingSidebarOpen: (value: boolean) => void;
  waresBeforeCategories: Ware[];
  setWaresBeforeCategories: (waresBeforeCategories: Ware[]) => void;
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
  minPossible: 0,
  maxPossible: 10000,
  setMinPossible: (minPossible) => set({ minPossible }),
  setMaxPossible: (maxPossible) => set({ maxPossible }),
  activeTab: "wares",
  setActiveTab: (value) => set({ activeTab: value }),
  isTrademarksOpen: false,
  setIsTrademarksOpen: (value: boolean) => set({ isTrademarksOpen: value }),
  isSortingSidebarOpen: false,
  setIsSortingSidebarOpen: (value: boolean) => set({ isSortingSidebarOpen: value }),
  waresBeforeCategories: [],
  setWaresBeforeCategories: (waresBeforeCategories) => set({ waresBeforeCategories }),
}));

export default useSearchStore;
