// store.ts
import { create } from 'zustand';

interface AdminPanelState {
	activeTab: string | null;
	setActiveTab: (tab: string) => void;
	warehouseId: number;
	setWarehouseId: (id: number) => void;
}

const useAdminPanelStore = create<AdminPanelState>((set) => ({
	activeTab: null, // Вибрана вкладка, за замовчуванням немає вибраної
	setActiveTab: (tab) => set({ activeTab: tab }),
	warehouseId: 0, // Вибрана вкладка, за замовчуванням немає вибраної
	setWarehouseId: (id) => set({ warehouseId: id }),

}));

export default useAdminPanelStore;
