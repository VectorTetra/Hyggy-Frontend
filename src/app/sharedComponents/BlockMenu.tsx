"use client";
import { useWareCategories1 } from "@/pages/api/WareCategory1Api";
import useMainPageMenuStore from "@/store/mainPageMenu";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import styles from "./css/mainblockmenu.module.css";
import { Collapse } from "@mui/material";
interface Category {
    caption?: string;
    type?: string;
    name?: string;
    subCategories?: Category[];
}

const adaptCategories = (data: any[]): Category[] => {
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
    const [currentMenu, setCurrentMenu] = useState<any[]>([]);
    const [currentCategory, setCurrentCategory] = useState<any>(null); // Текущая категория для отображения в заголовке
    const { isMainPageMenuOpened, setIsMainPageMenuOpened } = useMainPageMenuStore();

    const menuRef = useRef<HTMLDivElement | null>(null);


    const handleCategoryClick = (category) => {
        if (category.subCategories) {
            //setHistory([...history, { menu: currentMenu, category: currentCategory }]); // Сохраняем текущий уровень в историю
            setHistory((prevHistory) => [...prevHistory, { menu: currentMenu, category: currentCategory }]);
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

    useEffect(() => {
        setTimeout(() => {
            if (isMainPageMenuOpened) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";

            }
            return () => {
                document.body.style.overflow = "";
            };
        }
            , 300);
    }, [isMainPageMenuOpened]);
    // Закрытие меню при клике вне его области
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                if (isMainPageMenuOpened) {
                    setIsMainPageMenuOpened(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMainPageMenuOpened, setIsMainPageMenuOpened]);


    useEffect(() => {
        if (!isWareCategories1Loading && foundWareCategories.length > 0) {
            setCurrentMenu(adaptCategories(foundWareCategories));
        }
    }, [foundWareCategories, isWareCategories1Loading]);




    useEffect(() => {
        if (isMainPageMenuOpened) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMainPageMenuOpened]);


    //if (!isMainPageMenuOpened) return null;
    return (
        <div>
            <Collapse
                in={isMainPageMenuOpened}
                timeout={300} // Тривалість анімації (мс)
                orientation="horizontal" // Анімація по горизонталі
            >
                <div className={`${styles.menuContainer} ${isMainPageMenuOpened ? styles.show : ""}`}>
                    <div ref={menuRef}>
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
            </Collapse>
        </div>
    );
}

export default BlockMenu;