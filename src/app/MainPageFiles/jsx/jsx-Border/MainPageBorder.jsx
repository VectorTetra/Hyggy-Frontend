// "use client";
// import React, { useEffect } from 'react';
// import styles from "../../styles/MainPageBorder-styles.module.css"
// import { useRouter } from "next/navigation";
// import { useBlogs } from '@/pages/api/BlogApi';
// import { type } from 'os';

// export function MainPageBorder(props) {
//     const [currentIndex, setCurrentIndex] = React.useState(0);
//     const router = useRouter();

//     // Используем useQuery для получения последних 3 акций
//     const { data: sales = [], isLoading, isSuccess } = useBlogs(
//         {
//             SearchParameter: "Query",
//             PageNumber: 1,
//             PageSize: 3,
//             Sorting: "IdDesc",
//             BlogCategory1Name: "Акції"
//         }
//     );

//     // Функция для перехода к следующему элементу
//     const nextSale = () => {
//         setCurrentIndex((prevIndex) =>
//             isSuccess && sales.length > 0 && (prevIndex + 1) % sales.length
//         );
//     };

//     // Переход к следующему баннеру
//     const nextBanner = () => {
//         setCurrentIndex((prevIndex) =>
//             isSuccess ? (prevIndex + 1) % sales.length : prevIndex
//         );
//     };

//     // Переход к предыдущему баннеру
//     const prevBanner = () => {
//         setCurrentIndex((prevIndex) =>
//             isSuccess ? (prevIndex - 1 + sales.length) % sales.length : prevIndex
//         );
//     };

//     // Автоматическое переключение распродажи каждые 3 секунды
//     useEffect(() => {
//         const interval = setInterval(nextSale, 3000);
//         return () => clearInterval(interval); // Очистка интервала при размонтировании
//     }, []);

//     // Обработчик клика по баннеру
//     const handleBannerClick = () => {
//         if (isSuccess && sales[currentIndex]?.id) {
//             router.push(`../PageSale?id=${sales[currentIndex].id}`);
//         }
//     };

//     return (
//         <div className={styles.mainPageBorder}>
//             <div className={`${styles["mainPageBorder-container"]}`}>
//                 <button onClick={prevBanner}>{"<<"}</button>
//                 <img
//                     onClick={handleBannerClick}
//                     className={`${styles["mainPageBorder-containerimg"]}`}
//                     src={sales[currentIndex]?.previewImagePath}
//                     alt="Banner"
//                 />
//                 <button onClick={nextBanner}>{">>"}</button>
//             </div>
//         </div>
//     );
// }

'use client';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRef } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import Link from 'next/link';
import { useBlogs } from '@/pages/api/BlogApi';
import '../../styles/MainPageBorderCarusel.css'; // Імпортуйте ваш CSS файл

export function MainPageBorder() {
    const sliderRef = useRef(null);

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


    const settings = {
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        // dots: true,
        arrows: true,
        // responsive: [
        // 	{
        // 		breakpoint: 1024,
        // 		settings: {
        // 			infinite: true,
        // 			slidesToShow: 2,
        // 			arrows: true,
        // 		},
        // 	},
        // 	{
        // 		breakpoint: 768,
        // 		settings: {
        // 			infinite: true,
        // 			slidesToShow: 1,
        // 			arrows: true,
        // 		},
        // 	},
        // ],
    };

    return (
        <div className="carouselWrapper">
            <Slider ref={sliderRef} {...settings}>
                {Array.isArray(sales) && sales.length > 0 && sales.map((card, index) => (
                    <div key={index} className="slide">
                        <Link href={`/PageBlogIndividual/${card.id}`}>
                            <Image
                                width={400}
                                height={300}
                                src={card.previewImagePath}
                                alt={card.blogTitle}
                                className="cardImage"
                            />
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
