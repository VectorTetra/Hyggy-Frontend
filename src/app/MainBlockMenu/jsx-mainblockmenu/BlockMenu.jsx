"use client";
import React, { useState } from "react";
import styles from "../css/mainblockmenu.module.css"; // Проверь, что путь верный

export default function BlockMenu(props) {
    const [isOpen, setIsOpen] = useState(false); // Открытие/закрытие меню
    const [activeCategory, setActiveCategory] = useState(null); // Открытая категория
    const [activeSubCategory, setActiveSubCategory] = useState(null); // Открытая подкатегория

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        console.log("Menu toggled: ", isOpen ? "закрыто" : "открыто"); // Отладка
    };

    const toggleCategory = (category) => {
        setActiveCategory(activeCategory === category ? null : category);
        setActiveSubCategory(null); // Сброс подкатегории при смене категории
    };

    const toggleSubCategory = (subCategory) => {
        setActiveSubCategory(activeSubCategory === subCategory ? null : subCategory);
    };

    return (
        <div className={styles.sidebarContainer}>
            <button className={styles.menuButton} onClick={toggleMenu}>
                Меню
            </button>

            {/* Отображаем меню, если isOpen === true */}
            {isOpen && (
                <div className={styles.sidebar}>
                    <ul className={styles.menuList}>
                        {props.blockData.map((category, index) => (
                            <li key={index}>
                                <button onClick={() => toggleCategory(category.caption)}>
                                    {category.caption}
                                </button>
                                {activeCategory === category.caption && (
                                    <ul className={styles.subMenu}>
                                        {category.subCategories.map((subCategory, subIndex) => (
                                            <li key={subIndex}>
                                                <button
                                                    onClick={() => toggleSubCategory(subCategory.type)}
                                                >
                                                    {subCategory.type}
                                                </button>
                                                {activeSubCategory === subCategory.type && (
                                                    <ul className={styles.subSubMenu}>
                                                        {subCategory.subCategories.map(
                                                            (subSubCategory, subSubIndex) => (
                                                                <li key={subSubIndex}>
                                                                    {subSubCategory.name}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
