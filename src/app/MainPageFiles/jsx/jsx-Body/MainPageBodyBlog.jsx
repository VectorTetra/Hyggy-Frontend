import Link from "next/link";
import styles from "./../../styles/MainPageBody-styles.module.css";
import MainPageBodyBlogButtonSmallAdapt from "./MainPageBodyBlogButtonSmallAdapt";
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
                    <MainPageBodyBlogButtonSmallAdapt link={item.urlpage} text={item.textbutton} />
                </div>
            ))}
        </div>

    );
}

