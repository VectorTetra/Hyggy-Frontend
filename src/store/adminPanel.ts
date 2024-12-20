// store.ts
import { WareGetDTO } from '@/pages/api/WareApi';
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
	frameRemainsSidebarVisibility: boolean;
	setFrameRemainsSidebarVisibility: (visibility: boolean) => void;
	frameRemainsSelectedWare: WareGetDTO | null;
	setFrameRemainsSelectedWare: (selectedWare: WareGetDTO | null) => void;
	orderDetailsSidebarVisibility: boolean;
	setOrderDetailsSidebarVisibility: (visibility: boolean) => void;
	selectedOrder: any | null;
	setSelectedOrder: (order: any | null) => void;
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
	frameRemainsSidebarVisibility: false,
	setFrameRemainsSidebarVisibility: (visibility) => set({ frameRemainsSidebarVisibility: visibility }),
	frameRemainsSelectedWare: null,
	setFrameRemainsSelectedWare: (selectedWare) => set({ frameRemainsSelectedWare: selectedWare }),
	orderDetailsSidebarVisibility: false,
	setOrderDetailsSidebarVisibility: (visibility) => set({ orderDetailsSidebarVisibility: visibility }),
	selectedOrder: null,
	setSelectedOrder: (order) => set({ selectedOrder: order }),

}));

export default useAdminPanelStore;