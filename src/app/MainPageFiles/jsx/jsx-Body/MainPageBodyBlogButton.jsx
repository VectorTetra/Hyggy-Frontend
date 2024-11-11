import Link from "next/link";
import styles from "./../../styles/MainPageBody-styles.module.css";

export default function MainPageBodyBlogButton(props) {
    return (
        <div className={styles["blog-container2"]}>
            {props.button.map((item, index) => (
                <div className={styles["blog-item2"]} key={index}>
                    <Link href={item.urlpage} className={styles["blog-button"]}>
                        <div>{item.textbutton}</div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
