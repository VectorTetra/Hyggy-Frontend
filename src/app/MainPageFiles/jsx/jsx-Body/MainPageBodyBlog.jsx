import Link from "next/link";
import styles from "./../../styles/MainPageBody-styles.module.css";
import MainPageBodyBlogButton from "./MainPageBodyBlogButton";

export default function MainPageBodyBlog(props) {
    return (
        <div className={styles["blog-container"]}>
            {props.blog.map(item => (
                <div className={styles["blog-item"]} key={item.urlpage}>
                    <Link prefetch={true} href={item.urlpage}>
                        <img src={item.urlimage} alt={item.alt} className={styles["blog-image"]} />
                        <div className={styles["blog-caption"]}>{item.textblog.textcaption}</div>
                    </Link>
                    <div className={styles["blog-text"]}>{item.textblog.text}</div>
                </div>
            ))}
        </div>

    );
}

// import Link from "next/link";
// import styles from "./../../styles/MainPageBody-styles.module.css";
// import MainPageBodyBlogButton from "./MainPageBodyBlogButton";

// export default function MainPageBodyBlog(props) {
//     return (
//         <div className={styles["blog-container"]}>
//             {props.blog.map((item, index) => (
//                 <div className={styles["blog-block"]} key={item.urlpage}>
//                     {/* Блок с текстом и изображением */}
//                     <div className={styles["blog-content"]}>
//                         <Link prefetch={true} href={item.urlpage}>
//                             <img src={item.urlimage} alt={item.alt} className={styles["blog-image"]} />
//                             <div className={styles["blog-caption"]}>{item.textblog.textcaption}</div>
//                         </Link>
//                         <div className={styles["blog-text"]}>{item.textblog.text}</div>
//                     </div>

//                     {/* Кнопка */}
//                     <MainPageBodyBlogButton button={[props.button]} />
//                 </div>
//             ))}
//         </div>
//     );
// }

