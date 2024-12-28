"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./css/MenuShops.module.css";
import useWarePageMenuShops from "@/store/warePageMenuShops";
import { ShopGetDTO, useShops } from "@/pages/api/ShopApi";
import { useWareItems } from "@/pages/api/WareItemApi";
import useLocalStorageStore from "@/store/localStorage";
import { Collapse } from "@mui/material";

export default function BlockShopsByWare({ wareId }: { wareId: number }) {
    const [searchTerm, setSearchTerm] = useState("");
    const { selectedShop, setSelectedShop } = useLocalStorageStore();  // Використовуємо useLocalStorage
    const { isWarePageMenuShopsOpened, setIsWarePageMenuShopsOpened } = useWarePageMenuShops();
    const menuRef = useRef<HTMLDivElement | null>(null);

    const { data: shops, isLoading: isShopsLoading } = useShops({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000,
    });

    const { data: wareItems = [], isLoading: isWareItemsLoading } = useWareItems({
        SearchParameter: "WareId",
        WareId: wareId,
    });

    const isNotAvailable = wareItems.length > 0 && wareItems.every((item) => item.quantity === 0);

    useEffect(() => {
        setTimeout(() => {
            if (isWarePageMenuShopsOpened) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
            return () => {
                document.body.style.overflow = "";
            };
        }, 300);
    }, [isWarePageMenuShopsOpened]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleShopClick = (shop: ShopGetDTO) => {
        setSelectedShop(shop);
        setIsWarePageMenuShopsOpened(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsWarePageMenuShopsOpened(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getQuantityForShop = (shopId: number) => {
        const wareItem = wareItems.find((item) => item.storageId === shopId && item.wareId === wareId);
        return wareItem?.quantity || 0;
    };

    const isOrderable = (shopId: number) => {
        const currentQuantity = getQuantityForShop(shopId);
        if (currentQuantity > 0) return false;
        return wareItems.some((item) => item.storageId !== shopId && item.quantity > 0);
    };

    const renderQuantityIndicator = (quantity: number, orderable: boolean) => {
        if (quantity > 10) {
            return (
                <svg width="12" height="12">
                    <circle cx="6" cy="6" r="6" fill="green" />
                </svg>
            );
        } else if (quantity > 0) {
            return (
                <svg width="12" height="12">
                    <circle cx="6" cy="6" r="6" fill="orange" />
                </svg>
            );
        } else if (orderable) {
            return (
                <svg width="12" height="12">
                    <circle cx="6" cy="6" r="6" fill="yellow" />
                </svg>
            );
        } else {
            return (
                <svg width="12" height="12">
                    <circle cx="6" cy="6" r="6" fill="red" />
                </svg>
            );
        }
    };

    return (

        <Collapse
            in={isWarePageMenuShopsOpened}
            timeout={300} // Тривалість анімації (мс)
            orientation="horizontal" // Анімація по горизонталі
            unmountOnExit={false}
        >
            <div className={`${styles.overlay} ${isWarePageMenuShopsOpened ? styles.show : ""}`}>
                <div ref={menuRef} className={`${styles.menuContainer}`}>
                    <div className={styles.menuHeader}>
                        <div className={styles.menuContainerLogo}>
                            <span>{selectedShop ? selectedShop.name : "Виберіть магазин HYGGY для доставки"}</span>
                            <button onClick={() => setIsWarePageMenuShopsOpened(false)} className={styles.closeButton}>
                                Х
                            </button>
                        </div>
                    </div>
                    <hr className={styles.divider} />
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={styles.searchInput}
                            placeholder="Введіть місто або адресу..."
                        />
                        <button className={styles.searchButton}>🔍</button>
                    </div>
                    <div className={styles.shopListContainer}>
                        {isShopsLoading || isWareItemsLoading ? (
                            <p>Завантаження...</p>
                        ) : (
                            shops
                                ?.filter((shop) =>
                                    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    shop.address?.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((shop) => {
                                    const quantity = getQuantityForShop(shop.id);
                                    const orderable = isOrderable(shop.id);
                                    return (
                                        <div key={shop.id} className={styles.card}>
                                            <div className={styles.shopcard}>
                                                <div className={styles.shopInfo}>
                                                    <h2 className={styles.h2}>{shop.name}</h2>
                                                    <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                                                        {renderQuantityIndicator(quantity, orderable)}
                                                        <span style={{ marginLeft: "10px", fontSize: "0.9em" }}>
                                                            {quantity > 0
                                                                ? `${quantity} шт.`
                                                                : orderable
                                                                    ? `${quantity} шт. (Можливо замовити)`
                                                                    : "Немає в наявності"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleShopClick(shop)}
                                                    className={styles.shopButton}
                                                    disabled={quantity === 0 && !orderable}
                                                    style={{
                                                        backgroundColor: quantity === 0 && !orderable ? "gray" : "",
                                                        cursor: quantity === 0 && !orderable ? "not-allowed" : "pointer",
                                                    }}
                                                >
                                                    Обрати магазин
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                        )}
                    </div>

                </div>
            </div>
        </Collapse>

    );
}
