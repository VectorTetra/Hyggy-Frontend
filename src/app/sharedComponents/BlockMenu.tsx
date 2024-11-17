"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./css/mainblockmenu.module.css";
import blockData from "./json/blockmenu.json";
import useMainPageMenuStore from "@/store/mainPageMenu";
import { useWareCategories1 } from "@/pages/api/WareCategory1Api";
import { CircularProgress } from "@mui/material";
const adaptCategories = (data) => {
    return data.map((category) => ({
        caption: category.name,
        subCategories: category.waresCategories2.map((subCategory) => ({
            type: subCategory.name,
            subCategories: subCategory.waresCategories3.map((subSubCategory) => ({
                name: subSubCategory.name,
                // Додайте інші потрібні поля, якщо потрібно
            })),
        })),
    }));
};
const BlockMenu: React.FC = () => {
    const [history, setHistory] = useState<any>([]); // История для возврата на предыдущие уровни
    const { data: foundWareCategories = [], isLoading: isWareCategories1Loading } = useWareCategories1({
        SearchParameter: "Query",
        //QueryAny: query,
        PageNumber: 1,
        PageSize: 1000,
        Sorting: "NameAsc"
    });
    const [currentMenu, setCurrentMenu] = useState(adaptCategories(foundWareCategories));
    const [currentCategory, setCurrentCategory] = useState<any>(null); // Текущая категория для отображения в заголовке
    const { isMainPageMenuOpened, setIsMainPageMenuOpened } = useMainPageMenuStore();

    const menuRef = useRef(null);


    const handleCategoryClick = (category) => {
        if (category.subCategories) {
            setHistory([...history, { menu: currentMenu, category: currentCategory }]); // Сохраняем текущий уровень в историю
            setCurrentMenu(category.subCategories); // Переходим к подкатегориям
            setCurrentCategory(category); // Обновляем текущую категорию
        } else {
            setIsMainPageMenuOpened(false);
        }
    };

    const handleBackClick = () => {
        if (history.length > 0) {
            const previousState = history[history.length - 1]; // Берем предыдущий уровень
            setCurrentMenu(previousState.menu); // Возвращаемся к предыдущему уровню
            setCurrentCategory(previousState.category); // Возвращаем заголовок предыдущей категории
            setHistory(history.slice(0, history.length - 1)); // Убираем последний элемент из истории
        }
    };

    // useEffect(() => {
    //     if (isMainPageMenuOpened) {
    //         document.body.style.overflow = "hidden";
    //     } else {
    //         document.body.style.overflow = "";

    //     }
    //     return () => {
    //         document.body.style.overflow = "";
    //     };
    // }, [isMainPageMenuOpened]);
    // // Закрытие меню при клике вне его области
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (menuRef.current && !menuRef.current.contains(event.target)) {
    //             setIsMainPageMenuOpened(false);
    //         }
    //     };

    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [setIsMainPageMenuOpened]);

    useEffect(() => {
        if (!isWareCategories1Loading) {
            const adaptedCategories = adaptCategories(foundWareCategories);
            setCurrentMenu(adaptedCategories); // Оновлення меню після завантаження
        }
    }, [foundWareCategories, isWareCategories1Loading]);

    useEffect(() => {
        if (isMainPageMenuOpened) {
            document.body.style.overflow = "hidden";
            if (!isWareCategories1Loading && foundWareCategories.length > 0) {
                setCurrentMenu(adaptCategories(foundWareCategories)); // Оновлення меню при відкритті
            }
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMainPageMenuOpened, foundWareCategories, isWareCategories1Loading]);

    if (!isMainPageMenuOpened) return null;
    return (
        <div className={styles.overlay}> <div ref={menuRef} className={`${styles.menuContainer} ${styles.show}`}>
            <div className={styles.menuHeader}>
                {history.length === 0 ? (
                    <>
                        <div className={styles.menuContainerLogo}>
                            <img src="/images/AdminPanel/hyggyIcon.png" alt="Logo" className={styles.logo} />
                            <button onClick={() => { setIsMainPageMenuOpened(false) }} className={styles.closeButton}>Х</button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.headermenucategory}>
                            <button onClick={handleBackClick} className={styles.backButton}>
                                {'<'}
                            </button>
                            <div className={styles.menuTitle}>
                                {/* Отображение правильного заголовка в зависимости от уровня меню */}
                                {history.length === 1 && currentCategory ? (
                                    // Второй уровень 
                                    currentCategory.caption || currentCategory.type
                                ) : history.length === 2 && currentCategory ? (
                                    // Третий уровень
                                    currentCategory.type || currentCategory.name
                                ) : ''}
                            </div>
                            <button onClick={() => { setIsMainPageMenuOpened(false) }} className={styles.closeButton}>Х</button>
                        </div>
                    </>
                )}
            </div>
            <hr className={styles.divider} />
            <ul className={styles.menu}>
                {currentMenu.map((category, index) => (
                    <li key={index} className={styles.menuItem} onClick={() => handleCategoryClick(category)}>
                        {category.subCategories && history.length < 2 ? (
                            <span className={styles.menuText}>
                                {category.caption || category.type || category.name}
                            </span>
                        ) : (
                            <Link prefetch={true} href={`/search?query=${category.name}`} className={styles.menuText}>
                                {category.caption || category.type || category.name}
                            </Link>
                        )}
                        {category.subCategories && history.length < 2 && (
                            <span className={styles.menuIcon}>{'>'}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
        </div>
    );
}

export default BlockMenu;