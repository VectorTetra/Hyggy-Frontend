// store.ts
import { create } from 'zustand';

interface AdminPanelState {

	activeTab: string | null;
	setActiveTab: (tab: string) => void;
	warehouseId: number | null;
	setWarehouseId: (id: number | null) => void;
}

const useAdminPanelStore = create<AdminPanelState>((set) => ({
	activeTab: null, // Вибрана вкладка, за замовчуванням немає вибраної
	setActiveTab: (tab) => set({ activeTab: tab }),
	warehouseId: null, // Вибрана вкладка, за замовчуванням немає вибраної
	setWarehouseId: (id) => set({ warehouseId: id }),
}));

export default useAdminPanelStore;