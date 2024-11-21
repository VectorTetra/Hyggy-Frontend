"use client";
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
const isClient = typeof window !== "undefined";

const getSelectedShopFromLocalStorage = (): ShopGetDTO | null => {
    if (!isClient) return null;
    try {
        const storedShop = localStorage.getItem("selectedShop");
        return storedShop ? JSON.parse(storedShop) : null;
    } catch (error) {
        console.error("Error reading selected shop from localStorage:", error);
        return null;
    }
};

const getShopToViewOnShopPageFromLocalStorage = (): ShopGetDTO | null => {
    if (!isClient) return null;
    try {
        const storedShop = localStorage.getItem("shop");
        return storedShop ? JSON.parse(storedShop) : null;
    } catch (error) {
        console.error("Error reading shop to view on shop page from localStorage:", error);
        return null;
    }
};

const setSelectedShopToLocalStorage = (shop: ShopGetDTO | null): void => {
    if (!isClient) return;
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

const setShopToViewOnShopPageToLocalStorage = (shop: ShopGetDTO | null): void => {
    if (!isClient) return;
    try {
        if (shop) {
            localStorage.setItem("shop", JSON.stringify(shop));
        } else {
            localStorage.removeItem("shop");
        }
    } catch (error) {
        console.error("Error saving shop to view on shop page to localStorage:", error);
    }
};

// Zustand Store
const useLocalStorageStore = create<LocalStorageStore>((set) => ({
    selectedShop: isClient ? getSelectedShopFromLocalStorage() : null, // Ініціалізація з LocalStorage
    setSelectedShop: (shop) => {
        set({ selectedShop: shop });
        setSelectedShopToLocalStorage(shop); // Оновлення LocalStorage
    },
    shopToViewOnShopPage: isClient ? getShopToViewOnShopPageFromLocalStorage() : null,
    setShopToViewOnShopPage: (shop) => {
        set({ shopToViewOnShopPage: shop });
        setShopToViewOnShopPageToLocalStorage(shop);
    },
}));

export default useLocalStorageStore;
