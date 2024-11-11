"use client";
import React from 'react';
import Link from 'next/link';
import styles from '../../styles/MainPageHeader-styles.module.css';
import { useRouter } from "next/navigation";

export default function MainPageSale(props) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const router = useRouter();

    // Функция для перехода к следующему элементу
    const nextSale = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex + 1) % props.infoSales.length
        );
    };

    // Автоматическое переключение распродажи каждые 3 секунды
    React.useEffect(() => {
        const interval = setInterval(nextSale, 3000);
        return () => clearInterval(interval); // Очистка интервала при размонтировании
    }, []);

    // Обработчик клика по баннеру
    const handleBannerClick = () => {
        const selectedBanner = props.infoSales[currentIndex];
        const id = selectedBanner.id;
        console.log('Пришло из PageSale', id);
        router.push(`../PageSale?id=${id}`);
    };

    return (
        <div id={styles.mainPageSale}>
            <div onClick={handleBannerClick} className={styles.bannerLink}>
                {props.infoSales[currentIndex].infoSale}
            </div>
        </div>
    );
}