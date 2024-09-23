"use client"
import React, { useState } from "react";
import styles from '../page.module.css';
import data from '../PageProfileUser.json';

const ITEMS_PER_PAGE = 8;

export default function FavoritesUser(props: any) {
    const [currentPage, setCurrentPage] = useState(1);
    const favorites = data.favorites;

    // Вычисляем общее количество страниц
    const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);

    // Вычисляем начало и конец текущей страницы
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = favorites.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Функция для перехода на следующую страницу
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Функция для возврата на предыдущую страницу
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Обране</h2>
            <div className={styles.grid}>
                {currentItems.map((item, index) => (
                    <div className={styles.card1} key={index}>
                        <div className={styles.heartConteiner}>
                            <span>❤️</span>
                        </div>
                        <div className={styles.card}>
                            <img src={item.image} alt={item.name} className={styles.productImage} />

                            <div className={styles.sale}>{item.sale}</div>
                            <div className={styles.status}>{item.status}</div>
                            <div className={styles.productDetails}>
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <p className={styles.price}>{item.price}{" грн "}</p>
                                <p>{item.offer}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.pagination}>
                {currentPage > 1 && (
                    <button className={styles.arrow} onClick={prevPage}>
                        &laquo;
                    </button>
                )}
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`${styles.button} ${currentPage === i + 1 ? styles.activePage : ""}`}
                    >
                        {i + 1}
                    </button>
                ))}
                {currentPage < totalPages && <button className={styles.arrow} onClick={nextPage}> &raquo; </button>}
            </div>
        </div>
    );
}
