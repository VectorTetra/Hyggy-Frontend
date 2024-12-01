"use client";

import React, {useState , useEffect} from 'react';
import Link from 'next/link';
import styles from '../../styles/MainPageHeader-styles.module.css';
import { useRouter } from "next/navigation";
import { BlogQueryParams, useBlogs } from '@/pages/api/BlogApi';
import { type } from 'os';


export default function MainPageSale(props) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const router = useRouter();

    // Используем useQuery для получения последних 3 акций
    const { data: sales = [], isLoading, isSuccess } = useBlogs(
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
        }
    }, [isSuccess]);

    // Функция для перехода к следующему элементу
    const nextSale = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex + 1) % sales.length
        );
    };

    // Автоматическое переключение распродажи каждые 3 секунды
    React.useEffect(() => {
        
        const interval = setInterval(nextSale, 3000);
        return () => clearInterval(interval); // Очистка интервала при размонтировании
    }, []);

    // Обработчик клика по баннеру
    const handleBannerClick = () => {
        const selectedBanner = sales[currentIndex];
        const id = selectedBanner.id;
        router.push(`../PageBlogIndividual/${id}`);
    };

    return (
        <div id={styles.mainPageSale}>
            <div onClick={handleBannerClick} className={styles.bannerLink}>
                {sales[currentIndex]?.blogTitle}
            </div>
        </div>
    );
}