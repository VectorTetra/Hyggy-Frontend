// store.ts
import { create } from 'zustand';

interface AdminPanelState {
	activeTab: string | null;
	setActiveTab: (tab: string) => void;
}

const useAdminPanelStore = create<AdminPanelState>((set) => ({
	activeTab: null, // Вибрана вкладка, за замовчуванням немає вибраної
	setActiveTab: (tab) => set({ activeTab: tab }),
}));

export default useAdminPanelStore;
