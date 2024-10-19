// store.ts
import { create } from 'zustand';

interface AdminPanelState {
	activeTab: string | null;
	setActiveTab: (tab: string) => void;
	addNewShopId: number;
	setNewShopId: (id: number) => void;
}

const useAdminPanelStore = create<AdminPanelState>((set) => ({
	activeTab: null, // Вибрана вкладка, за замовчуванням немає вибраної
	setActiveTab: (tab) => set({ activeTab: tab }),
	addNewShopId: 0,
	setNewShopId: (id) => set({addNewShopId: id}),
}));

export default useAdminPanelStore;
