import Skeleton from "../skeletons/Skeleton";
import styles from "./css/WareGrid.module.css";

const SkeletonPost = () => {
    return (
        <div id={styles.wareGrid}>
            <div className={styles.wareCard}>
                <div className={styles.wareCardLinkContainer}>
                    <Skeleton classes="image width-100" />
                </div>
                <Skeleton classes="title width-50" />
                <Skeleton classes="text width-100" />
                <Skeleton classes="text width-100" />
                <Skeleton classes="text width-100" />

            </div>
            <div className={styles.wareCard}>
                <div className={styles.wareCardLinkContainer}>
                    <Skeleton classes="image width-100" />
                </div>
                <Skeleton classes="title width-50" />
                <Skeleton classes="text width-100" />
                <Skeleton classes="text width-100" />
                <Skeleton classes="text width-100" />

            </div>
            <div className={styles.wareCard}>
                <div className={styles.wareCardLinkContainer}>
                    <Skeleton classes="image width-100" />
                </div>
                <Skeleton classes="title width-50" />
                <Skeleton classes="text width-100" />
                <Skeleton classes="text width-100" />
                <Skeleton classes="text width-100" />
            </div>
            <div className={styles.wareCard}>
                <div className={styles.wareCardLinkContainer}>
                    <Skeleton classes="image width-100" />
                </div>
                <Skeleton classes="title width-50" />
                <Skeleton classes="text width-100" />
                <Skeleton classes="text width-100" />
                <Skeleton classes="text width-100" />
            </div>
        </div>
    )
}

export default SkeletonPost