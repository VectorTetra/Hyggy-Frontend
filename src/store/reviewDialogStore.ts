import { create } from 'zustand';

interface ReviewDialogStore {
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
}

const useReviewDialogStore = create<ReviewDialogStore>((set) => ({
    isModalOpen: false,
    setIsModalOpen: (value) => set({ isModalOpen: value }),
}));

export default useReviewDialogStore;
