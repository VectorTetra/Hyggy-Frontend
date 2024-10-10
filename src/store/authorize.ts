import { create } from "zustand";

interface AuthorizeStore {
    isAuthorized: boolean;
    setIsAuthorized: (value: boolean) => void;
}

const useAuthorizeStore = create<AuthorizeStore>((set) => ({
    isAuthorized: false,
    setIsAuthorized: (value: boolean) => set({ isAuthorized: value }),

}));

export default useAuthorizeStore;

