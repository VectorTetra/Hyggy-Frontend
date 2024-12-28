"use client";
import { ShopGetDTO, useShops } from "@/pages/api/ShopApi";
import useLocalStorageStore from "@/store/localStorage";
import useMainPageMenuShops from "@/store/mainPageMenuShops";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Slide } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import styles from "./css/MenuShops.module.css";
import ShopStatusInner from "./ShopStatusInner";
import ShopStatusOuter from "./ShopStatusOuter";

const BlockShops: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { selectedShop, setSelectedShop } = useLocalStorageStore();
    const { isMainPageMenuShopsOpened, setIsMainPageMenuShopsOpened } = useMainPageMenuShops();
    const menuRef = useRef<HTMLDivElement | null>(null);

    const { data: shops, isLoading } = useShops({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000,
    });

    useEffect(() => {
        if (isMainPageMenuShopsOpened) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isMainPageMenuShopsOpened]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleShopClick = (shop: ShopGetDTO) => {
        setSelectedShop(shop);
        dispatchEvent(new Event("shopSelected"));
        setIsMainPageMenuShopsOpened(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMainPageMenuShopsOpened(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div style={{ display: "flex" }}
        >
            {isMainPageMenuShopsOpened && <div className={styles.overlayBackground}></div>}
            <Slide
                in={isMainPageMenuShopsOpened}
                timeout={300}
                direction="left"
                unmountOnExit={false}
                className={`${styles.overlay}`}
            >
                <div ref={menuRef} className={styles.menuContainer}>
                    <div className={styles.menuHeader}>
                        <div className={styles.menuContainerLogo}>
                            <div className={styles.menuHeaderText}>
                                {selectedShop ? selectedShop.name : "Виберіть магазин HYGGY"}
                            </div>
                            <button
                                onClick={() => setIsMainPageMenuShopsOpened(false)}
                                className={styles.closeButton}
                            >
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
                            placeholder="Введіть місто або адресу... "
                        />
                        <button onClick={() => { }} className={styles.searchButton}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>

                    <div className={styles.shopListContainer}>
                        {isLoading ? (
                            <p>Завантаження...</p>
                        ) : (
                            shops?.filter((shop) =>
                                shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                shop.address?.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((shop, index) => (
                                <div key={index} className={styles.card}>
                                    <div className={styles.shopcard}>
                                        <div className={styles.shopInfo}>
                                            <h2 className={styles.h2}>{shop.name}</h2>
                                        </div>
                                        <ShopStatusInner shop={shop} />
                                        <button
                                            onClick={() => handleShopClick(shop)}
                                            className={styles.shopButton}
                                        >
                                            Обрати магазин
                                        </button>
                                    </div>
                                    <ShopStatusOuter shop={shop} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Slide>
        </div>
    );
};

export default BlockShops;
