"use client";
import React from "react";
import styles from "../../styles/MainPageBorder-styles.module.css"
import { useRouter } from "next/navigation";

export function MainPageBorder(props) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const router = useRouter();

    // Функция для перехода к следующему баннеру
    const nextBanner = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex + 1) % props.borderData.mainBorder.length
        );
    };

    // Функция для перехода к предыдущему баннеру
    const prevBanner = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 + props.borderData.mainBorder.length) % props.borderData.mainBorder.length
        );
    };

    // Автоматическое переключение баннера каждые 5 секунд
    React.useEffect(() => {
        const interval = setInterval(nextBanner, 5000);
        return () => clearInterval(interval);
    }, []);

    // Обработчик клика по баннеру
    const handleBannerClick = () => {
        const selectedBanner = props.borderData.mainBorder[currentIndex];
        const id = selectedBanner.id;
        router.push(`../PageSale?id=${id}`);
    };

    return (
        <div className={styles.mainPageBorder}>
            <div className={`${styles["mainPageBorder-container"]}`}>
                <button onClick={prevBanner}>{"<<"}</button>
                <img
                    onClick={handleBannerClick}
                    className={`${styles["mainPageBorder-containerimg"]}`}
                    src={props.borderData.mainBorder[currentIndex].url}
                    alt="Banner"
                />
                <button onClick={nextBanner}>{">>"}</button>
            </div>
        </div>
    );
}