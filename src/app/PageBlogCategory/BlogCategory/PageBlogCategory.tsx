// "use client";

// import { useSearchParams } from 'next/navigation';
// import styles from '../page.module.css';
// import data from '../data.json';

// export default function PageBlogCategory(props: any) {
//     const searchParams = useSearchParams();

//     // Проверяем, что searchParams не null
//     if (!searchParams) {
//         return <div>Ошибка: параметры запроса не найдены</div>;
//     }

//     // Используем параметры запроса или переданный через пропсы
//     const captionFromParams = searchParams.get('caption') || props.caption;

//     const matchingCategory = data.find(category =>
//         category.title.toLowerCase() === captionFromParams.toLowerCase()
//     );

//     if (!matchingCategory) {
//         return <div>Категория не найдена</div>;
//     }

//     const { title, description, block } = matchingCategory;

//     return (
//         <div className={styles.container}>
//             <h1>{title}</h1>
//             <p className={styles.description}>{description}</p>
//             <div className={styles.grid}>
//                 {block.map((item, index) => (
//                     <div key={index} className={styles.card}>
//                         <img src={item.imgSrc} alt={item.caption} />
//                         <h3>{item.caption}</h3>
//                         <p>{item.title}</p>
//                         <a href={item.link} className={styles.button}>Переглянути</a>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

"use client";

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styles from '../page.module.css';
import data from '../data.json';

const BLOCKS_PER_PAGE = 6;

export default function PageBlogCategory(props: any) {
    const searchParams = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);

    // Проверяем, что searchParams не null
    if (!searchParams) {
        return <div>Ошибка: параметры запроса не найдены</div>;
    }

    // Используем параметры запроса или переданный через пропсы
    const captionFromParams = searchParams.get('caption') || props.caption;

    const matchingCategory = data.find(category =>
        category.title.toLowerCase() === captionFromParams.toLowerCase()
    );

    if (!matchingCategory) {
        return <div>Категория не найдена</div>;
    }

    const { title, description, block } = matchingCategory;

    // Вычисляем количество страниц
    const totalPages = Math.ceil(block.length / BLOCKS_PER_PAGE);
    const blocksToShow = block.slice((currentPage - 1) * BLOCKS_PER_PAGE, currentPage * BLOCKS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className={styles.container}>
            <h1>{title}</h1>
            <p className={styles.description}>{description}</p>
            <div className={styles.grid}>
                {blocksToShow.map((item, index) => (
                    <div key={index} className={styles.card}>
                        <img src={item.imgSrc} alt={item.caption || 'Изображение'} />
                        {item.caption && <h3>{item.caption}</h3>}
                        <p>{item.title}</p>
                        <a href={item.link} className={styles.button}>Переглянути</a>
                    </div>
                ))}
            </div>
            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`${styles.pageButton} ${currentPage === i + 1 ? styles.activePage : ''}`}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
