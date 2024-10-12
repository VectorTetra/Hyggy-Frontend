"use client";
import React, { useState } from "react";
import styles from "./css/mainblockmenu.module.css";
import blockData from "./json/blockmenu.json";
import useMainPageMenuStore from "@/store/mainPageMenu";
export default function BlockMenu() {
    const [history, setHistory] = useState([]); // История для возврата на предыдущие уровни
    const [currentMenu, setCurrentMenu] = useState(blockData.blockData);
    const [currentCategory, setCurrentCategory] = useState(null); // Текущая категория для отображения в заголовке
    const { isMainPageMenuOpened, setIsMainPageMenuOpened } = useMainPageMenuStore();
    const handleCategoryClick = (category) => {
        if (category.subCategories) {
            setHistory([...history, { menu: currentMenu, category: currentCategory }]); // Сохраняем текущий уровень в историю
            setCurrentMenu(category.subCategories); // Переходим к подкатегориям
            setCurrentCategory(category); // Обновляем текущую категорию
        } else {

            //СДЕЛАТЬ ПЕРЕХОД НА СТР. ПОИСКА ТОВАРОВ С ИДЕНТИФИКАТОРОМ КАТЕГОРИИ В URL
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

    return (
        <div className={styles.overlay}>
            <div className={`${styles.menuContainer} ${currentMenu.length ? styles.show : ''}`}>
                <div className={styles.menuHeader}>
                    {history.length === 0 ? (
                        <>
                            <div className={styles.menuContainerLogo}>
                                <img src="/images/Logo.png" alt="Logo" className={styles.logo} />
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
                            <span className={styles.menuText}>
                                {category.caption || category.type || category.name}
                            </span>
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