import styles from "./../../styles/MainPageBody-styles.module.css";

export default function MainPageBodyCategory(props) {
    return (
        <div className={styles["category-container"]}>
            {props.CategoryName.map((item, index) => (
                <div className={styles["category-item"]} key={index}>
                    <a href={item.urlcategory} className={styles["category-link"]}>
                        <img src={item.urlimage} alt={item.nameCategory} className={styles["category-image"]} />
                        <div className={styles["category-text"]}>{item.nameCategory}</div>
                    </a>
                </div>
            ))}
        </div>
    );
}
