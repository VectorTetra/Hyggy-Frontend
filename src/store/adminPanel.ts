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
	shopEmployeeId: string | null;
	setShopEmployeeId: (id: string | null) => void;
	storageEmployeeId: string | null;
	setStorageEmployeeId: (id: string | null) => void;
	frameRemainsSidebarVisibility: boolean;
	setFrameRemainsSidebarVisibility: (visibility: boolean) => void;
	frameRemainsSelectedWare: WareGetDTO | null;
	setFrameRemainsSelectedWare: (selectedWare: WareGetDTO | null) => void;
}

const useAdminPanelStore = create<AdminPanelState>((set) => ({
	activeTab: null,
	setActiveTab: (tab) => set({ activeTab: tab }),
	warehouseId: null,
	setWarehouseId: (id) => set({ warehouseId: id }),
	blogId: null,
	setBlogId: (id) => set({ blogId: id }),
	wareId: null,
	setWareId: (id) => set({ wareId: id }),
	shopId: null,
	setShopId: (id) => set({ shopId: id }),
	shopEmployeeId: null,
	setShopEmployeeId: (id) => set({ shopEmployeeId: id }),
	storageEmployeeId: null,
	setStorageEmployeeId: (id) => set({ storageEmployeeId: id }),
	frameRemainsSidebarVisibility: false,
	setFrameRemainsSidebarVisibility: (visibility) => set({ frameRemainsSidebarVisibility: visibility }),
	frameRemainsSelectedWare: null,
	setFrameRemainsSelectedWare: (selectedWare) => set({ frameRemainsSelectedWare: selectedWare }),

}));

export default useAdminPanelStore;