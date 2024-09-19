// "use client"; // Пометьте компонент как клиентский

// import { useSearchParams } from 'next/navigation';
// import styles from '../page.module.css';

// interface BlockItem {
//     imgSrc: string;
//     title: string;
//     link: string;
// }

// interface BlogCategoryData {
//     title: string;
//     description: string;
//     block: BlockItem[];
// }

// interface PageBlogCategoryProps {
//     caption: string;
//     blogCategory: {
//         [key: string]: BlogCategoryData[];
//     };
// }

// export default function PageBlogCategory({ caption, blogCategory }: PageBlogCategoryProps) {
//     console.log('Received caption:', caption);
//     const searchParams = useSearchParams();

//     // Проверяем, что searchParams не null
//     if (!searchParams) {
//         return <div>Ошибка: параметры запроса не найдены</div>;
//     }

//     // Используем параметры запроса или переданный через пропсы
//     const captionFromParams = searchParams.get('caption') || caption;

//     const categoryKey = captionFromParams.toLowerCase();
//     const categoryData = blogCategory[categoryKey]?.[0]?.block;

//     if (!categoryData) {
//         return <div>Категория не найдена</div>;
//     }



//     return (
//         <div>
//             <h2>{}</h2>
//             <h2>{}</h2>
//             <div className={styles.grid}>
//                 {categoryData.map((item, index) => (
//                     <div key={index} className={styles.card}>
//                         <img src={item.imgSrc} alt={item.title} />
//                         <h3>{item.title}</h3>
//                         <a href={item.link} className={styles.button}>Подробнее</a>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }


"use client"; // Пометьте компонент как клиентский

import { useSearchParams } from 'next/navigation';
import styles from '../page.module.css';
import data from '../data.json';
// interface BlockItem {
//     imgSrc: string;
//     caption: string;
//     title: string;
//     link: string;
// }

// interface BlogCategoryData {
//     title: string;
//     description: string;
//     block: BlockItem[];
// }

// interface PageBlogCategoryProps {
//     caption: string;
//     blogCategory: {
//         [key: string]: BlogCategoryData[];
//     };
// }

export default function PageBlogCategory(props: any) {
    // console.log('Received caption:', data.categories.);
    // console.log('Received blogCategory: ', blogCategory);
    const searchParams = useSearchParams();

    // Проверяем, что searchParams не null
    if (!searchParams) {
        return <div>Ошибка: параметры запроса не найдены</div>;
    }

    // Используем параметры запроса или переданный через пропсы
    const captionFromParams = searchParams.get('caption') || props.caption;

    const matchingCategory = data.find(category =>
        category.title.toLowerCase() === captionFromParams.toLowerCase()
    );

    //const categoryKey = captionFromParams.toLowerCase();
    //const categoryData = blogCategory[categoryKey]?.[0]?.block;

    if (!matchingCategory) {
        return <div>Категория не найдена</div>;
    }

    const { title, description, block } = matchingCategory;

    return (
        <div className={styles.container}>
            <h1>{title}</h1>
            <p className={styles.description}>{description}</p>
            <div className={styles.grid}>
                {block.map((item, index) => (
                    <div key={index} className={styles.card}>
                        <img src={item.imgSrc} alt={item.caption} />
                        <h3>{item.caption}</h3>
                        <p>{item.title}</p>
                        <a href={item.link} className={styles.button}>Переглянути</a>
                    </div>
                ))}
            </div>
        </div>
    );
}