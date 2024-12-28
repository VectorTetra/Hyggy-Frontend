"use client";
import { AddressDTO } from "@/pages/api/AddressApi";
import { OrderDeliveryTypeGetDTO } from "@/pages/api/OrderDeliveryTypeApi";
import { ShopGetDTO } from "@/pages/api/ShopApi";
import { WareGetDTO } from "@/pages/api/WareApi";
import { create } from "zustand";

//export type DeliveryOption = "delivery" | "store";
//export type DeliveryType = "courier" | "novaPoshta" | "ukrPoshta" | "store";
export interface CartItem {
    product: WareGetDTO
    quantity: number;
    selectedOption: string; //"delivery" | "store";
}
export interface DeliveryInfo {
    selectedDeliveryType: OrderDeliveryTypeGetDTO | null; //"courier" | "novaPoshta" | "ukrPoshta" | "store";
    selectedStore: any;
    // deliveryCost: number;
    // deliveryDays: number;
}
export interface FormData {
    firstName: string;
    lastName: string;
    city: string;
    street: string;
    houseNumber: string;
    email: string;
    phone: string;
    termsAccepted: boolean;
}
// export interface Cart {
//     items: CartItem[];
//     deliveryInfo: DeliveryInfo;
//     addressInfo: AddressDTO;
//     paymentStatus: string;
//     formData: FormData;
// }

// interface AddressInfo {
//     city: string;
//     street: string;
//     houseNumber: string;
// }



// Інтерфейс для стану
interface LocalStorageStore {
    selectedShop: ShopGetDTO | null;
    setSelectedShop: (shop: ShopGetDTO | null) => void;
    shopToViewOnShopPage: ShopGetDTO | null;
    setShopToViewOnShopPage: (shop: ShopGetDTO | null) => void;
    recentWareIds: number[];
    addRecentWareId: (wareId: number) => void; // Додавання ідентифікатора товару
    cart: CartItem[];
    addressInfo: AddressDTO | null;
    deliveryInfo: DeliveryInfo | null;
    formData: FormData | null;
    selectedDeliveryType: OrderDeliveryTypeGetDTO | null;
    paymentStatus: string | null;
    addToCart: (newItem: CartItem) => void;
    removeFromCart: (index: number) => void;
    clearCart: () => void;
    updateCartQuantity: () => void;
    increaseQuantity: (index: number) => void;
    decreaseQuantity: (index: number) => void;
    handleQuantityChange: (index: number, value: number) => void;
    cartQuantity: number;
    getCartFromLocalStorage: () => CartItem[];
    saveCartToLocalStorage: (cartItems: CartItem[]) => void;
    getSelectedShopFromLocalStorage: () => any | null;
    setAddressInfo: (addressInfo: AddressDTO | null) => void;
    setDeliveryInfo: (deliveryInfo: DeliveryInfo | null) => void;
    setFormData: (formData: FormData) => void;
    setSelectedDeliveryType: (selectedDeliveryType: OrderDeliveryTypeGetDTO | null) => void;
    setPaymentStatus: (paymentStatus: string | null) => void;
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

const getCartFromLocalStorage = (): CartItem[] => {
    if (!isClient) return [];
    console.log("isClient", isClient);
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
};

const getCartQuantityFromLocalStorage = (): number => {
    if (!isClient) return 0;
    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : null;
    if (!cart) return 0;
    return cart.reduce((sum, item) => sum + item.quantity, 0);
};

const saveCartToLocalStorage = (cartItems: CartItem[]): void => {
    if (!isClient) return;
    localStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("storage"));
};

const getAddressInfoFromLocalStorage = (): AddressDTO | null => {
    if (!isClient) return null;
    const savedAddressInfo = localStorage.getItem("addressInfo");
    return savedAddressInfo ? JSON.parse(savedAddressInfo) : null;
};

const saveAddressInfoToLocalStorage = (addressInfo: AddressDTO | null): void => {
    if (!isClient) return;
    localStorage.setItem("addressInfo", JSON.stringify(addressInfo));
};

const getDeliveryInfoFromLocalStorage = (): DeliveryInfo | null => {
    if (!isClient) return null;
    const savedDeliveryInfo = localStorage.getItem("deliveryInfo");
    return savedDeliveryInfo ? JSON.parse(savedDeliveryInfo) : null;
};

const saveDeliveryInfoToLocalStorage = (deliveryInfo: DeliveryInfo | null): void => {
    if (!isClient) return;
    localStorage.setItem("deliveryInfo", JSON.stringify(deliveryInfo));
};

const getFormDataFromLocalStorage = (): FormData | null => {
    if (!isClient) return null;
    const savedFormData = localStorage.getItem("formData");
    return savedFormData ? JSON.parse(savedFormData) : {
        firstName: "",
        lastName: "",
        city: "",
        street: "",
        houseNumber: "",
        email: "",
        phone: "",
        termsAccepted: false,
    };
};

const saveFormDataToLocalStorage = (formData: FormData): void => {
    if (!isClient) return;
    localStorage.setItem("formData", JSON.stringify(formData));
};

const getSelectedDeliveryTypeFromLocalStorage = (): OrderDeliveryTypeGetDTO | null => {
    // if (!isClient) return {
    //     id: 1, // ID доставки "Забрати в магазині HYGGY"
    //     name: "Забрати в магазині HYGGY",
    //     description: "Доставка 12-18 робочих днів",
    //     price: 0,
    //     minDeliveryTimeInDays: 12,
    //     maxDeliveryTimeInDays: 18,
    // };;

    // const savedDeliveryType = localStorage.getItem("selectedDeliveryType");
    // if (savedDeliveryType) {
    //     try {
    //         return JSON.parse(savedDeliveryType) as OrderDeliveryTypeGetDTO;
    //     } catch (error) {
    //         console.error("Invalid delivery type data in localStorage", error);
    //         // Повертаємо дефолтний об'єкт типу OrderDeliveryTypeGetDTO
    //         return {
    //             id: 1, // ID доставки "Забрати в магазині HYGGY"
    //             name: "Забрати в магазині HYGGY",
    //             description: "Доставка 12-18 робочих днів",
    //             price: 0,
    //             minDeliveryTimeInDays: 12,
    //             maxDeliveryTimeInDays: 18,
    //         };
    //     }
    // }

    // // Повертаємо дефолтний об'єкт типу OrderDeliveryTypeGetDTO
    // return {
    //     id: 1, // ID доставки "Забрати в магазині HYGGY"
    //     name: "Забрати в магазині HYGGY",
    //     description: "Доставка 12-18 робочих днів",
    //     price: 0,
    //     minDeliveryTimeInDays: 12,
    //     maxDeliveryTimeInDays: 18,
    // };


    if (!isClient) return null;

    const savedDeliveryType = localStorage.getItem("selectedDeliveryType");
    if (savedDeliveryType) {
        try {
            return JSON.parse(savedDeliveryType) as OrderDeliveryTypeGetDTO;
        } catch (error) {
            console.error("Invalid delivery type data in localStorage", error);
            // Повертаємо дефолтний об'єкт типу OrderDeliveryTypeGetDTO
            return null;
        }
    }

    // Повертаємо дефолтний об'єкт типу OrderDeliveryTypeGetDTO
    return null;
};

const saveSelectedDeliveryTypeToLocalStorage = (selectedDeliveryType: OrderDeliveryTypeGetDTO | null): void => {
    if (!isClient) return;

    try {
        const deliveryTypeString = JSON.stringify(selectedDeliveryType);
        localStorage.setItem("selectedDeliveryType", deliveryTypeString);
    } catch (error) {
        console.error("Failed to save selected delivery type to localStorage", error);
    }
};


const getPaymentStatusFromLocalStorage = (): string | null => {
    if (!isClient) return null;
    const savedPaymentStatus = localStorage.getItem("paymentStatus");
    return savedPaymentStatus ? savedPaymentStatus : null;
};

const savePaymentStatusToLocalStorage = (paymentStatus: string | null): void => {
    if (!isClient) return;
    if (paymentStatus) {
        localStorage.setItem("paymentStatus", paymentStatus);
    } else {
        localStorage.removeItem("paymentStatus");
    }
};

// Zustand Store
const useLocalStorageStore = create<LocalStorageStore>((set, get) => ({
    cart: getCartFromLocalStorage(),
    addressInfo: getAddressInfoFromLocalStorage(),
    deliveryInfo: getDeliveryInfoFromLocalStorage(),
    formData: getFormDataFromLocalStorage(),
    selectedDeliveryType: getSelectedDeliveryTypeFromLocalStorage(),
    paymentStatus: getPaymentStatusFromLocalStorage(),
    cartQuantity: getCartQuantityFromLocalStorage(),
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
    addToCart: (newItem) => {
        set((state) => {
            const existingItemIndex = state.cart.findIndex(
                (item) => item.product.id === newItem.product.id
            );

            let updatedCart;
            if (existingItemIndex !== -1) {
                // Якщо товар вже є в кошику, додаємо кількість до існуючої
                updatedCart = state.cart.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + newItem.quantity } // Додаємо кількість
                        : item
                );
            } else {
                // Якщо товару немає, додаємо новий товар з його кількістю
                updatedCart = [...state.cart, newItem];
            }

            //Оновлення типу доставки для всіх товарів в кошику
            const lastSelectedDeliveryType = newItem.selectedOption; // Тип доставки нового товару
            updatedCart = updatedCart.map((item) => ({
                ...item,
                selectedOption: lastSelectedDeliveryType, // Встановлюємо новий тип доставки для всіх товарів
            }));

            // Збереження оновленого кошика в localStorage
            saveCartToLocalStorage(updatedCart);

            // Оновлення кількості товарів у кошику
            const totalQuantity = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
            return { cart: updatedCart, cartQuantity: totalQuantity };
        });
    },


    removeFromCart: (index) => {
        set((state) => {
            const updatedCart = state.cart.filter((_, i) => i !== index);
            saveCartToLocalStorage(updatedCart);
            const totalQuantity = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
            return { cart: updatedCart, cartQuantity: totalQuantity };
        });
    },

    clearCart: () => {
        set(() => {
            localStorage.removeItem("cart");
            return { cart: [], cartQuantity: 0 };
        });
    },

    updateCartQuantity: () => {
        set((state) => {
            const totalQuantity = state.cart.reduce((sum, item) => sum + item.quantity, 0);
            return { cartQuantity: totalQuantity };
        });
    },

    getCartFromLocalStorage: () => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    },

    saveCartToLocalStorage: (cartItems: CartItem[]) => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
        window.dispatchEvent(new Event("storage"));
    },

    getSelectedShopFromLocalStorage: () => {
        try {
            const storedShop = localStorage.getItem("selectedShop");
            return storedShop ? JSON.parse(storedShop) : null;
        } catch (error) {
            console.error("Error reading selected shop from localStorage:", error);
            return null;
        }
    },

    setAddressInfo: (addressInfo) => {
        set({ addressInfo });
        saveAddressInfoToLocalStorage(addressInfo);
    },

    setDeliveryInfo: (deliveryInfo) => {
        set({ deliveryInfo });
        saveDeliveryInfoToLocalStorage(deliveryInfo);
    },

    setFormData: (formData) => {
        set({ formData });
        saveFormDataToLocalStorage(formData);
    },

    setSelectedDeliveryType: (selectedDeliveryType) => {
        set({ selectedDeliveryType });
        saveSelectedDeliveryTypeToLocalStorage(selectedDeliveryType);
    },

    setPaymentStatus: (paymentStatus) => {
        set({ paymentStatus });
        savePaymentStatusToLocalStorage(paymentStatus);
    },

    increaseQuantity: (index: number) => {
        const updatedCart = [...get().cart];
        updatedCart[index].quantity += 1;
        set({ cart: updatedCart });  // Оновлюємо cart
        saveCartToLocalStorage(updatedCart);  // Зберігаємо оновлений кошик в localStorage

        // Оновлюємо загальну кількість товарів у кошику
        const totalQuantity = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        set({ cartQuantity: totalQuantity });  // Оновлюємо кількість товарів
    },

    decreaseQuantity: (index: number) => {
        const updatedCart = [...get().cart];
        // Перевіряємо, чи кількість більша за 1, щоб уникнути негативних значень
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity -= 1;
        } else {
            updatedCart[index].quantity = 1;  // Запобігаємо встановленню кількості менше 1
        }
        set({ cart: updatedCart });  // Оновлюємо cart
        saveCartToLocalStorage(updatedCart);  // Зберігаємо оновлений кошик в localStorage

        // Оновлюємо кількість товарів у кошику
        const totalQuantity = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        set({ cartQuantity: totalQuantity });  // Оновлюємо загальну кількість товарів
    },

    handleQuantityChange: (index: number, value: number) => {
        if (value <= 0) {
            return;  // Prevent setting quantity to 0 or negative
        }
        const updatedCart = [...get().cart];
        updatedCart[index].quantity = value;
        set({ cart: updatedCart });
        saveCartToLocalStorage(updatedCart);

        const totalQuantity = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        set({ cartQuantity: totalQuantity });
    }

}));

export default useLocalStorageStore;