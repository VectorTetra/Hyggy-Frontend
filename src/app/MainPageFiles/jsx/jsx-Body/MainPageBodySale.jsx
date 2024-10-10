import styles from "./../../styles/MainPageBody-styles.module.css";

export default function MainPageBodySale(props) {
    return (
        <div className={styles["bodysale"]}>
            <img src={props.urlphoto} className={styles["bodysale-image"]} alt="Sale Image" />
            <div className={styles["bodysale-text"]}>
                {props.text}
                <br /><br />
                <a className={styles["text-link"]} href={props.urlpagesale}>
                    {props.text2}
                </a>
            </div>
        </div>
    );
}
