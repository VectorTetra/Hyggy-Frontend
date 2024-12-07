// store.ts
import { create } from 'zustand';

interface AdminPanelState {

	activeTab: string | null;
	setActiveTab: (tab: string) => void;
	warehouseId: number | null;
	setWarehouseId: (id: number | null) => void;
	blogId: number | null;
	setBlogId: (id: number | null) => void;
	wareId: number | null;
	setWareId: (id: number | null) => void;
	shopId: number | null;
	setShopId: (id: number | null) => void;
}

const useAdminPanelStore = create<AdminPanelState>((set) => ({
	activeTab: null, // Вибрана вкладка, за замовчуванням немає вибраної
	setActiveTab: (tab) => set({ activeTab: tab }),
	warehouseId: null,
	setWarehouseId: (id) => set({ warehouseId: id }),
	blogId: null,
	setBlogId: (id) => set({ blogId: id }),
	wareId: null, // Вибрана вкладка, за замовчуванням немає вибраної
	setWareId: (id) => set({ wareId: id }),
	shopId: null, // Вибрана вкладка, за замовчуванням немає вибраної
	setShopId: (id) => set({ shopId: id }),
}));

export default useAdminPanelStore;