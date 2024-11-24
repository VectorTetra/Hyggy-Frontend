// import '@/app/sharedComponents/css/WareCarousel.css'; // Імпортуйте ваш CSS файл
// import useLocalStorageStore from '@/store/localStorage';
// import { useRef } from 'react';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick-theme.css';
// import 'slick-carousel/slick/slick.css';
// import WareCard from '../search/tsx/WareCard';
// import { useFavoriteWare } from './methods/useFavoriteWare';
// import './css/WareCarousel.css';

// export default function WareCarousel({ wares }) {
//     const sliderRef = useRef<Slider | null>(null);
//     const { selectedShop } = useLocalStorageStore();
//     const { isFavorite, toggleFavoriteWare } = useFavoriteWare();

//     // Мінімальна кількість карток для слайдера
//     const MIN_SLIDES = 4;

//     // Доповнення масиву порожніми елементами
//     const paddedWares = [...wares];
//     while (paddedWares.length < MIN_SLIDES) {
//         paddedWares.push(null); // Додаємо `null` для заповнення
//     }

//     const settings = {
//         infinite: true,
//         slidesToShow: MIN_SLIDES, // Завжди показувати 4 слайди
//         slidesToScroll: 4, // Прокручувати по 1 слайду
//         //arrows: wares.length > MIN_SLIDES, // Показувати стрілки, якщо є більше 4 товарів
//         arrows: true, // Показувати стрілки завжди
//         responsive: [
//             {
//                 breakpoint: 1024,
//                 settings: {
//                     slidesToShow: 3,
//                     slidesToScroll: 3,
//                     //arrows: wares.length > 3, // Показувати стрілки, якщо є більше 3 товарів
//                     arrows: true, // Показувати стрілки завжди
//                 },
//             },
//             {
//                 breakpoint: 768,
//                 settings: {
//                     slidesToShow: 2,
//                     slidesToScroll: 2,
//                     //arrows: wares.length > 2, // Показувати стрілки, якщо є більше 2 товарів
//                     arrows: true, // Показувати стрілки завжди
//                 },
//             },
//             {
//                 breakpoint: 512,
//                 settings: {
//                     slidesToShow: 1, // На малих екранах адаптація
//                     slidesToScroll: 1,
//                     //arrows: wares.length > 1, // Показувати стрілки, якщо є більше 1 товарів
//                     arrows: true, // Показувати стрілки завжди
//                 },
//             },
//         ],
//     };

//     return (
//         <div className="carouselWrapper" id='wareCarousel'>
//             <Slider ref={sliderRef} {...settings}>
//                 {paddedWares.map((wareIter, index) => (
//                     wareIter ? (
//                         <WareCard
//                             key={index}
//                             ware={wareIter}
//                             isFavorite={isFavorite(wareIter.id)}
//                             toggleFavorite={() => toggleFavoriteWare(wareIter.id)}
//                             selectedShop={selectedShop}
//                         />
//                     ) : (
//                         <div key={index} className="wareCardPlaceholder" />
//                     )
//                 ))}
//             </Slider>
//         </div>
//     );
// }

import '@/app/sharedComponents/css/WareCarousel.css'; // Імпортуйте ваш CSS файл
import { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import WareCard from '../search/tsx/WareCard';
import { useFavoriteWare } from './methods/useFavoriteWare';
import useLocalStorageStore from '@/store/localStorage';
import './css/WareCarousel.css';

export default function WareCarousel({ wares }) {
    const { isFavorite, toggleFavoriteWare } = useFavoriteWare();
    const sliderRef = useRef<Slider | null>(null);
    const { selectedShop } = useLocalStorageStore();
    const [slidesToShow, setSlidesToShow] = useState(4); // Кількість видимих слайдів
    const MIN_SLIDES = 4;

    // Функція для визначення кількості слайдів залежно від розміру екрана
    const updateSlidesToShow = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1024) {
            setSlidesToShow(4);
        } else if (screenWidth >= 768) {
            setSlidesToShow(3);
        } else if (screenWidth >= 512) {
            setSlidesToShow(2);
        } else {
            setSlidesToShow(1);
        }
    };

    // Виклик функції при завантаженні та зміні розміру вікна
    useEffect(() => {
        updateSlidesToShow();
        window.addEventListener('resize', updateSlidesToShow);

        return () => {
            window.removeEventListener('resize', updateSlidesToShow);
        };
    }, []);

    // Доповнення масиву порожніми елементами
    const paddedWares = [...wares];
    while (paddedWares.length < slidesToShow) {
        paddedWares.push(null); // Додаємо `null` для заповнення
    }

    const settings = {
        infinite: false,
        slidesToShow,
        slidesToScroll: slidesToShow,
        arrows: true, // Показувати стрілки завжди
    };

    return (
        <div className="carouselWrapper" id="wareCarousel">
            <Slider ref={sliderRef} {...settings}>
                {paddedWares.map((wareIter, index) =>
                    wareIter ? (
                        <WareCard
                            key={index}
                            ware={wareIter}
                            isFavorite={isFavorite(wareIter.id)}
                            toggleFavorite={() => toggleFavoriteWare(wareIter.id)}
                            selectedShop={selectedShop}
                        />
                    ) : (
                        <div key={index} className="wareCardPlaceholder" />
                    )
                )}
            </Slider>
        </div>
    );
}
