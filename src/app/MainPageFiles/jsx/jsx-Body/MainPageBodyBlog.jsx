import styles from "./../../styles/MainPageBody-styles.module.css";
import MainPageBodyBlogButton from "./MainPageBodyBlogButton";

export default function MainPageBodyBlog(props) {
    return (
        <div className={styles["blog-container"]}>
            {props.blog.map(item => (
                <div className={styles["blog-item"]} key={item.urlpage}>
                    <a href={item.urlpage}>
                        <img src={item.urlimage} alt={item.alt} className={styles["blog-image"]} />
                        <div className={styles["blog-caption"]}>{item.textblog.textcaption}</div>
                    </a>
                    <div className={styles["blog-text"]}>{item.textblog.text}</div>
                </div>

            ))}
        </div>
    );
}
