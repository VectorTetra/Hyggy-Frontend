import Link from "next/link";
import styles from "./../../styles/MainPageBody-styles.module.css";

export default function MainPageBodySale(props) {
    return (
        <div className={styles["bodysale"]}>
            <img src={props.urlphoto} className={styles["bodysale-image"]} alt="Sale Image" />
            <div className={styles["bodysale-text"]}>
                {props.text}
                <br /><br />
                <Link prefetch={true} className={styles["text-link"]} href={props.urlpagesale}>
                    {props.text2}
                </Link>
            </div>
        </div>
    );
}
