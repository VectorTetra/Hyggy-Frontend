import { ShopGetDTO } from "@/pages/api/ShopApi";
import { create } from "zustand";

// Інтерфейс для стану
interface LocalStorageStore {
    selectedShop: ShopGetDTO | null; // Обраний магазин
    setSelectedShop: (shop: ShopGetDTO | null) => void;
    shopToViewOnShopPage: ShopGetDTO | null;
    setShopToViewOnShopPage: (shop: ShopGetDTO | null) => void;
}

// Функція для роботи з LocalStorage
const getSelectedShopFromLocalStorage = () => {
    try {
        const storedShop = localStorage.getItem("selectedShop");
        return storedShop ? JSON.parse(storedShop) : null;
    } catch (error) {
        console.error("Error reading selected shop from localStorage:", error);
        return null;
    }
};
const getShopToViewOnShopPageFromLocalStorage = () => {
    try {
        const storedShop = localStorage.getItem("shop");
        return storedShop ? JSON.parse(storedShop) : null;
    } catch (error) {
        console.error("Error reading selected shop from localStorage:", error);
        return null;
    }
};

const setSelectedShopToLocalStorage = (shop: ShopGetDTO | null) => {
    try {
        if (shop) {
            localStorage.setItem("selectedShop", JSON.stringify(shop));
        } else {
            localStorage.removeItem("selectedShop");
        }
    } catch (error) {
        console.error("Error saving selected shop to localStorage:", error);
    }
};

const setShopToViewOnShopPageToLocalStorage = (shop: ShopGetDTO | null) => {
    try {
        if (shop) {
            localStorage.setItem("shop", JSON.stringify(shop));
        } else {
            localStorage.removeItem("shop");
        }
    } catch (error) {
        console.error("Error saving selected shop to localStorage:", error);
    }
};



// Zustand Store
const useLocalStorageStore = create<LocalStorageStore>((set) => ({

    selectedShop: getSelectedShopFromLocalStorage(), // Ініціалізація з LocalStorage
    setSelectedShop: (shop) => {
        set({ selectedShop: shop });
        setSelectedShopToLocalStorage(shop); // Оновлення LocalStorage
    },
    shopToViewOnShopPage: getShopToViewOnShopPageFromLocalStorage(),
    setShopToViewOnShopPage: (shop) => {
        set({ shopToViewOnShopPage: shop });
        setShopToViewOnShopPageToLocalStorage(shop);
    },
}));

export default useLocalStorageStore;
