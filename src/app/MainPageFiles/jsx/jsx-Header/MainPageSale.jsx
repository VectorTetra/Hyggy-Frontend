"use client";

import { useBlogs } from '@/pages/api/BlogApi';
import { useRouter } from "next/navigation";
import React, { useEffect } from 'react';
import styles from '../../styles/MainPageHeader-styles.module.css';


export default function MainPageSale(props) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const router = useRouter();

    // Используем useQuery для получения последних 3 акций
    const { data: sales = [], isSuccess } = useBlogs(
        {
            SearchParameter: "Query",
            PageNumber: 1,
            PageSize: 3,
            Sorting: "IdDesc",
            BlogCategory1Name: "Акції"
        }
    );

    useEffect(() => {
        if (isSuccess) {
            console.log("OurSales", sales);
            console.log("OurSales is Array", Array.isArray(sales));
            console.log("OurSales type", typeof (sales));
            const interval = setInterval(nextSale, 3000);
            return () => clearInterval(interval); // Очистка интервала при размонтировании
        }
    }, [isSuccess]);

    // Функция для перехода к следующему элементу
    const nextSale = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex + 1) % sales.length
        );
    };

    // Обработчик клика по баннеру
    const handleBannerClick = () => {
        const selectedBanner = sales[currentIndex];
        const id = selectedBanner.id;
        router.push(`../PageBlogIndividual/${id}`);
    };

    return (
        <div id={styles.mainPageSale}>
            <div onClick={handleBannerClick} className={styles.bannerLink}>
                {isSuccess && sales[currentIndex]?.blogTitle}
            </div>
        </div>
    );
}