"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./css/MenuShops.module.css";
import useMainPageMenuShops from "@/store/mainPageMenuShops";
import { ShopGetDTO, useShops } from "@/pages/api/ShopApi";
import Link from "next/link";
import useLocalStorageStore from "@/store/localStorage";
import { useRouter } from "next/navigation";
import { set } from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const BlockShops: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { selectedShop, setSelectedShop, setShopToViewOnShopPage } = useLocalStorageStore();
    const { isMainPageMenuShopsOpened, setIsMainPageMenuShopsOpened } = useMainPageMenuShops();
    const menuRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    // Використання кешованих даних з API для отримання списку магазинів
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

    const checkShopStatus = (workHours: string) => {
        const currentDate = new Date();
        const currentDay = currentDate.toLocaleString("uk-UA", { weekday: "long" });
        const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();

        const workHoursArray = workHours.split("|").map((day) => {
            const [dayweek, hours] = day.split(",");
            const [open, close] = hours.split(" - ");
            return { dayweek: dayweek.trim(), open: open.trim(), close: close.trim() };
        });

        const todayWorktime = workHoursArray.find((time) => time.dayweek.toLocaleLowerCase() === currentDay.toLocaleLowerCase());
        if (todayWorktime) {
            const [openHour, openMinute] = todayWorktime.open.split(":").map(Number);
            const [closeHour, closeMinute] = todayWorktime.close.split(":").map(Number);
            const openMinutes = openHour * 60 + openMinute;
            const closeMinutes = closeHour * 60 + closeMinute;

            if (currentTime >= openMinutes && currentTime < closeMinutes) {
                return (
                    <span style={{ marginLeft: "10px" }}>
                        <span style={{ color: "green", fontWeight: "bold", fontSize: "0.9em" }}>Відчинено:</span>
                        <span style={{ fontSize: "0.9em", marginLeft: "5px" }}> Зачиняється о {todayWorktime.close}</span>
                    </span>
                );
            } else {
                return (
                    <span style={{ marginLeft: "10px" }}>
                        <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9em" }}>Зачинено:</span>
                        <span style={{ fontSize: "0.9em" }}> Відкриється о {todayWorktime.open}</span>
                    </span>
                );
            }
        }
        return "Час роботи не доступний";
    };

    const ShopStatus = ({ shop }: { shop: ShopGetDTO }) => {
        const [isOpen, setIsOpen] = useState(false);

        const toggleWorkHours = () => {
            setIsOpen(!isOpen);
        };

        const parsedWorkHours = shop.workHours ? shop.workHours.split("|").map((day) => {
            const [dayweek, hours] = day.split(",");
            const [open, close] = hours.split(" - ");
            return { dayweek: dayweek.trim(), open: open.trim(), close: close.trim() };
        }) : [];

        if (!isMainPageMenuShopsOpened) return null;
        return (
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div>{shop.workHours ? checkShopStatus(shop.workHours) : "Час роботи не доступний"}</div>
                    <span
                        onClick={toggleWorkHours}
                        style={{
                            margin: "10px 15px 10px 0",
                            color: "#007bff",
                            textDecoration: "underline",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        Робочі години
                    </span>
                </div>
                {isOpen && (
                    <div style={{ width: "100%", padding: "10px", marginTop: "10px" }}>
                        <div>
                            <p style={{ fontWeight: "bold" }}>Інформація про магазин:</p>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                <strong>Адреса:</strong>
                                <span style={{ marginLeft: "50px" }}>
                                    {shop.street},
                                    <p style={{ marginBottom: 0 }}>{shop.city}</p>
                                    <Link prefetch={true} className={styles.customlink} href="/shops">Як знайти магазин</Link>
                                </span>
                            </div>
                        </div>
                        <div style={{ display: "flex", margin: "20px 0 10px 0", flexDirection: "column" }}>
                            <p style={{ fontWeight: "bold", marginBottom: "10px" }}>Робочі години:</p>
                            <ul className={styles.worktimelist}>
                                {parsedWorkHours.map((time, index) => (
                                    <li key={index} className={styles.worktimeitem}>
                                        <span className={styles.worktimeday}>{time.dayweek}:</span>
                                        <span style={{ fontSize: "14px" }}>{time.open} - {time.close}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className={styles.customlink2} onClick={() => {
                                setShopToViewOnShopPage(shop);
                                setIsMainPageMenuShopsOpened(false);
                                router.push("/shop");
                            }} >Показати магазин</button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    if (!isMainPageMenuShopsOpened) return null;
    return (

        <div>
            <div className={styles.overlayBackground}></div>
            <div className={`${styles.overlay} ${isMainPageMenuShopsOpened ? styles.show : ""}`}>
                <div ref={menuRef} className={`${styles.menuContainer} ${styles.show}`}>
                    <div className={styles.menuHeader}>
                        <div className={styles.menuContainerLogo}>
                            <div className={styles.menuHeaderText}>{selectedShop ? selectedShop.name : "Виберіть магазин HYGGY"}</div>
                            <button onClick={() => setIsMainPageMenuShopsOpened(false)} className={styles.closeButton}>
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
                            <FontAwesomeIcon icon={faSearch} className="text-[#00AAAD] opacity-60/" />
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
                                        <button onClick={() => handleShopClick(shop)} className={styles.shopButton}>
                                            Обрати магазин
                                        </button>
                                    </div>
                                    <ShopStatus shop={shop} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlockShops;

