import styles from "./../../styles/MainPageBody-styles.module.css";

export default function MainPageBodyBrand(props) {
    return (
        <div className={styles["brand-container"]}>
            {props.brand.map((item, index) => (
                <div className={styles["brand-item"]} key={index}>
                    <img src={item.urlimage} alt={`Brand ${index}`} />
                </div>
            ))}
        </div>
    );
}
