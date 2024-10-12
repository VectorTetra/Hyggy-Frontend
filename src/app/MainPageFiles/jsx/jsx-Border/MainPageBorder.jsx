"use client";
import React from "react";
import styles from "../../styles/MainPageBorder-styles.module.css"
export function MainPageBorder(props) {
    const [currentIndex, setCurrentIndex] = React.useState(0);

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

    // Автоматическое переключение баннера каждые 2 секунды
    React.useEffect(() => {
        const interval = setInterval(nextBanner, 5000);
        return () => clearInterval(interval); // Очистка интервала при размонтировании
    }, []);

    return (
        <div className={styles.mainPageBorder}>
            <div className={`${styles["mainPageBorder-container"]}`}>
                <button onClick={prevBanner}>{"<<"}</button>
                <a href={props.borderData.mainBorder[currentIndex].urlpage}>
                    <img className={`${styles["mainPageBorder-containerimg"]}`} style={{
                        width: '80vw',
                        height: '250px'
                    }} src={props.borderData.mainBorder[currentIndex].url} />
                </a>
                <button onClick={nextBanner}>{">>"}</button>
            </div>
        </div>
    );
}
