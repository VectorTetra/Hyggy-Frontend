"use client";
import { ShopGetDTO } from "@/pages/api/ShopApi";
import { create } from "zustand";

// Інтерфейс для стану
interface LocalStorageStore {
    selectedShop: ShopGetDTO | null;
    setSelectedShop: (shop: ShopGetDTO | null) => void;
    shopToViewOnShopPage: ShopGetDTO | null;
    setShopToViewOnShopPage: (shop: ShopGetDTO | null) => void;
    recentWareIds: number[];
    addRecentWareId: (wareId: number) => void; // Додавання ідентифікатора товару
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

const getRecentWareIdsFromLocalStorage = (): number[] => {
    if (!isClient) return [];
    try {
        const storedIds = localStorage.getItem("recentWareIds");
        return storedIds ? JSON.parse(storedIds) : [];
    } catch (error) {
        console.error("Error reading recent ware IDs from localStorage:", error);
        return [];
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

const setRecentWareIdsToLocalStorage = (ids: number[]): void => {
    if (!isClient) return;
    try {
        localStorage.setItem("recentWareIds", JSON.stringify(ids));
    } catch (error) {
        console.error("Error saving recent ware IDs to localStorage:", error);
    }
};

// Zustand Store
const useLocalStorageStore = create<LocalStorageStore>((set, get) => ({
    selectedShop: isClient ? getSelectedShopFromLocalStorage() : null,
    setSelectedShop: (shop) => {
        set({ selectedShop: shop });
        setSelectedShopToLocalStorage(shop);
    },
    shopToViewOnShopPage: isClient ? getShopToViewOnShopPageFromLocalStorage() : null,
    setShopToViewOnShopPage: (shop) => {
        set({ shopToViewOnShopPage: shop });
        setShopToViewOnShopPageToLocalStorage(shop);
    },
    recentWareIds: isClient ? getRecentWareIdsFromLocalStorage() : [],
    addRecentWareId: (wareId) => {
        const recentWareIds = get().recentWareIds;
        // Додавання нового ідентифікатора, якщо його ще немає
        let updatedIds = recentWareIds.filter((id) => id !== wareId); // Видалення дубля
        updatedIds.unshift(wareId); // Додавання на початок
        if (updatedIds.length > 20) {
            updatedIds = updatedIds.slice(0, 20); // Обмеження до 20 елементів
        }
        set({ recentWareIds: updatedIds });
        setRecentWareIdsToLocalStorage(updatedIds); // Оновлення LocalStorage
    },
}));

export default useLocalStorageStore;
