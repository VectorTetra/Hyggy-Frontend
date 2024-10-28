// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import styles from "./css/MenuShops.module.css";
// import blockShops from "./json/menushops.json";
// import useMainPageMenuShops from "@/store/mainPageMenuShops";

// export default function BlockShops() {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [currentMenu, setCurrentMenu] = useState(blockShops);
//     const [selectedShop, setSelectedShop] = useState<{ captioncity: string; geoposition: string } | null>(null);

//     const { isMainPageMenuShopsOpened, setIsMainPageMenuShopsOpened } = useMainPageMenuShops();
//     const menuRef = useRef<HTMLDivElement | null>(null);

//     // Проверка локального хранилища на наличие выбранного магазина
//     useEffect(() => {
//         const savedShop = localStorage.getItem('selectedShop');
//         if (savedShop) {
//             setSelectedShop(JSON.parse(savedShop));
//         }
//     }, []);

//     const handleSearch = () => {
//         console.log("Поиск: ", searchTerm);
//     };

//     const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//         if (event.key === "Enter") {
//             handleSearch();
//         }
//     };

//     const handleClickOutside = (event: MouseEvent) => {
//         if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//             setIsMainPageMenuShopsOpened(false);
//         }
//     };

//     const handleShopClick = (shop: { captioncity: string; geoposition: string }) => {
//         setSelectedShop(shop);
//         const shopString = JSON.stringify(shop);
//         localStorage.setItem('selectedShop', shopString);
//         console.log(`Выбран магазин: ${shopString}`);
//         setIsMainPageMenuShopsOpened(false);
//         window.location.reload();
//     };

//     const checkShopStatus = (worktime) => {
//         const currentDate = new Date();
//         const currentDay = currentDate.toLocaleString("uk-UA", { weekday: "long" });
//         const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();

//         const todayWorktime = worktime.find(time => time.dayweek === currentDay);

//         if (todayWorktime) {
//             const [openHour, openMinute] = todayWorktime.open.split(":").map(Number);
//             const [closeHour, closeMinute] = todayWorktime.close.split(":").map(Number);
//             const openMinutes = openHour * 60 + openMinute;
//             const closeMinutes = closeHour * 60 + closeMinute;

//             if (currentTime >= openMinutes && currentTime < closeMinutes) {
//                 return (
//                     <span style={{ marginLeft: '10px' }}>
//                         <span style={{ color: 'green', fontWeight: 'bold', fontSize: '0.9em' }}>Відчинено:</span>
//                         <span style={{ fontSize: '0.9em', marginLeft: '5px' }}> Зачиняється о {todayWorktime.close}</span>
//                     </span>
//                 );
//             } else {
//                 return (
//                     <span style={{ marginLeft: '10px' }}>
//                         <span style={{ color: 'red', fontWeight: 'bold', fontSize: '0.9em' }}>Зачинено:</span>
//                         <span style={{ fontSize: '0.9em' }}> Відкриється о {todayWorktime.open}</span>
//                     </span>
//                 );
//             }
//         }
//         return "Час роботи не доступний";
//     };

//     const ShopStatus = ({ shop }) => {
//         const [isOpen, setIsOpen] = useState(false);

//         const toggleWorkHours = () => {
//             setIsOpen(!isOpen);
//         };

//         return (
//             <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
//                     <div>{checkShopStatus(shop.worktime)}</div>
//                     <span
//                         onClick={toggleWorkHours}
//                         style={{
//                             margin: '10px 15px 10px 0',
//                             color: '#007bff',
//                             textDecoration: 'underline',
//                             cursor: 'pointer',
//                             fontSize: '14px',
//                         }}
//                     >
//                         Робочі години
//                     </span>
//                 </div>
//                 {isOpen && (
//                     <div style={{ width: '100%', padding: '10px', marginTop: '10px' }}>
//                         <div>
//                             <p style={{ fontWeight: 'bold' }}>Інформація про магазин:</p>
//                             <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//                                 <strong>Адреса:</strong>
//                                 <span style={{ marginLeft: '50px' }}>
//                                     {shop.address.street},
//                                     <p style={{ marginBottom: 0 }}>{shop.address.city}</p>
//                                     <a className={styles.customlink} href="https://jysk.ua">Як знайти магазин</a>
//                                 </span>
//                             </div>
//                         </div>
//                         <div style={{ display: 'flex', margin: '20px 0 10px 0', flexDirection: 'column' }}>
//                             <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Робочі години:</p>
//                             <ul className={styles.worktimelist}>
//                                 {shop.worktime.map((time, index) => (
//                                     <li key={index} className={styles.worktimeitem}>
//                                         <span className={styles.worktimeday}>{time.dayweek}:</span>
//                                         <span style={{ fontSize: '14px' }}>{time.open} - {time.close}</span>
//                                     </li>
//                                 ))}
//                             </ul>
//                             <a className={styles.customlink2} href="https://jysk.ua">Показати магазин</a>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     useEffect(() => {
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     return (
//         <>
//             {isMainPageMenuShopsOpened && <div className={styles.overlayBackground}></div>}
//             <div className={`${styles.overlay} ${isMainPageMenuShopsOpened ? styles.show : ''}`}>
//                 <div ref={menuRef} className={`${styles.menuContainer} ${styles.show}`}>
//                     <div className={styles.menuHeader}>
//                         <div className={styles.menuContainerLogo}>
//                             <span>{selectedShop ? selectedShop.captioncity : "Виберіть магазин HYGGY"}</span>
//                             <button onClick={() => setIsMainPageMenuShopsOpened(false)} className={styles.closeButton}>Х</button>
//                         </div>
//                     </div>
//                     <hr className={styles.divider} />
//                     <div className={styles.searchContainer}>
//                         <input
//                             type="text"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             onKeyDown={handleKeyDown}
//                             className={styles.searchInput}
//                             placeholder="Введіть місто або адресу..."
//                         />
//                         <button onClick={handleSearch} className={styles.searchButton}>
//                             🔍
//                         </button>
//                     </div>

//                     <div className={styles.shopListContainer}>
//                         {blockShops.blockShops.map((shop, index) => (
//                             <div key={index} className={styles.card}>
//                                 <div className={styles.shopcard}>
//                                     <div className={styles.shopInfo}>
//                                         <h2 className={styles.h2}>{shop.captioncity}</h2>
//                                         <p className={styles.p}>{shop.geoposition}</p>
//                                     </div>
//                                     <button onClick={() => handleShopClick(shop)} className={styles.shopButton}>
//                                         Обрати магазин
//                                     </button>
//                                 </div>
//                                 <ShopStatus shop={shop} />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./css/MenuShops.module.css";
import blockShops from "./json/menushops.json";
import useMainPageMenuShops from "@/store/mainPageMenuShops";
import { ShopGetDTO } from "@/pages/api/ShopApi";

export default function BlockShops() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentMenu, setCurrentMenu] = useState(blockShops);
    const [selectedShop, setSelectedShop] = useState<ShopGetDTO | null>(null);

    const { isMainPageMenuShopsOpened, setIsMainPageMenuShopsOpened } = useMainPageMenuShops();
    const menuRef = useRef<HTMLDivElement | null>(null);

    // Проверка локального хранилища на наличие выбранного магазина
    useEffect(() => {
        const savedShop = localStorage.getItem('selectedShop');
        if (savedShop) {
            setSelectedShop(JSON.parse(savedShop));
        }
    }, []);

    const handleSearch = () => {
        console.log("Поиск: ", searchTerm);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMainPageMenuShopsOpened(false);
        }
    };

    const handleShopClick = (shop: ShopGetDTO) => {
        setSelectedShop(shop);
        const shopString = JSON.stringify(shop);
        localStorage.setItem('selectedShop', shopString);
        console.log(`Выбран магазин: ${shopString}`);
        setIsMainPageMenuShopsOpened(false);
        window.location.reload();
    };

    const checkShopStatus = (worktime) => {
        const currentDate = new Date();
        const currentDay = currentDate.toLocaleString("uk-UA", { weekday: "long" });
        const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();

        const todayWorktime = worktime.find(time => time.dayweek === currentDay);

        if (todayWorktime) {
            const [openHour, openMinute] = todayWorktime.open.split(":").map(Number);
            const [closeHour, closeMinute] = todayWorktime.close.split(":").map(Number);
            const openMinutes = openHour * 60 + openMinute;
            const closeMinutes = closeHour * 60 + closeMinute;

            if (currentTime >= openMinutes && currentTime < closeMinutes) {
                return (
                    <span style={{ marginLeft: '10px' }}>
                        <span style={{ color: 'green', fontWeight: 'bold', fontSize: '0.9em' }}>Відчинено:</span>
                        <span style={{ fontSize: '0.9em', marginLeft: '5px' }}> Зачиняється о {todayWorktime.close}</span>
                    </span>
                );
            } else {
                return (
                    <span style={{ marginLeft: '10px' }}>
                        <span style={{ color: 'red', fontWeight: 'bold', fontSize: '0.9em' }}>Зачинено:</span>
                        <span style={{ fontSize: '0.9em' }}> Відкриється о {todayWorktime.open}</span>
                    </span>
                );
            }
        }
        return "Час роботи не доступний";
    };

    const ShopStatus = ({ shop }) => {
        const [isOpen, setIsOpen] = useState(false);

        const toggleWorkHours = () => {
            setIsOpen(!isOpen);
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>{checkShopStatus(shop.worktime)}</div>
                    <span
                        onClick={toggleWorkHours}
                        style={{
                            margin: '10px 15px 10px 0',
                            color: '#007bff',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '14px',
                        }}
                    >
                        Робочі години
                    </span>
                </div>
                {isOpen && (
                    <div style={{ width: '100%', padding: '10px', marginTop: '10px' }}>
                        <div>
                            <p style={{ fontWeight: 'bold' }}>Інформація про магазин:</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <strong>Адреса:</strong>
                                <span style={{ marginLeft: '50px' }}>
                                    {shop.address.street},
                                    <p style={{ marginBottom: 0 }}>{shop.address.city}</p>
                                    <a className={styles.customlink} href="https://jysk.ua">Як знайти магазин</a>
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', margin: '20px 0 10px 0', flexDirection: 'column' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Робочі години:</p>
                            <ul className={styles.worktimelist}>
                                {shop.worktime.map((time, index) => (
                                    <li key={index} className={styles.worktimeitem}>
                                        <span className={styles.worktimeday}>{time.dayweek}:</span>
                                        <span style={{ fontSize: '14px' }}>{time.open} - {time.close}</span>
                                    </li>
                                ))}
                            </ul>
                            <a className={styles.customlink2} href="https://jysk.ua">Показати магазин</a>
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

    return (
        <>
            {isMainPageMenuShopsOpened && <div className={styles.overlayBackground}></div>}
            <div className={`${styles.overlay} ${isMainPageMenuShopsOpened ? styles.show : ''}`}>
                <div ref={menuRef} className={`${styles.menuContainer} ${styles.show}`}>
                    <div className={styles.menuHeader}>
                        <div className={styles.menuContainerLogo}>
                            <span>{selectedShop ? selectedShop.captioncity : "Виберіть магазин HYGGY"}</span>
                            <button onClick={() => setIsMainPageMenuShopsOpened(false)} className={styles.closeButton}>Х</button>
                        </div>
                    </div>
                    <hr className={styles.divider} />
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className={styles.searchInput}
                            placeholder="Введіть місто або адресу..."
                        />
                        <button onClick={handleSearch} className={styles.searchButton}>
                            🔍
                        </button>
                    </div>

                    <div className={styles.shopListContainer}>
                        {blockShops.blockShops.map((shop, index) => (
                            <div key={index} className={styles.card}>
                                <div className={styles.shopcard}>
                                    <div className={styles.shopInfo}>
                                        <h2 className={styles.h2}>{shop.captioncity}</h2>
                                        <p className={styles.p}>{shop.geoposition}</p>
                                    </div>
                                    <button onClick={() => handleShopClick(shop)} className={styles.shopButton}>
                                        Обрати магазин
                                    </button>
                                </div>
                                <ShopStatus shop={shop} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

