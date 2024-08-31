import React from 'react';
import Link from 'next/link';
import styles from '../../styles/MainPageHeader-styles.module.css';
function MainPageSale(props) {
    const [currentIndex, setCurrentIndex] = React.useState(0);

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

    return (
        <div id={styles.mainPageSale}>
            <Link href={props.infoSales[currentIndex].urlpage}>
                {props.infoSales[currentIndex].infoSale}
            </Link>
        </div>
    );
}
export default MainPageSale;