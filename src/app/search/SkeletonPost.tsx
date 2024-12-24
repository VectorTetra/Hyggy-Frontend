import Skeleton from "../skeletons/Skeleton";
import styles from "./css/WareGrid.module.css";


const SkeletonPost = () => {
    return (
        <>
            {/* <div className="flex gap-3 flex-wrap">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} style={{ display: "flex", flexWrap: "wrap" }}>
                        <Skeleton classes="filter" />
                    </div>
                ))}
            </div> */}

            <div id={styles.wareGrid}>
                {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className={styles.wareCard}>
                        <div className={styles.wareCardLinkContainer}>
                            <Skeleton classes="image width-100" />
                        </div>
                        <Skeleton classes="title width-50" />
                        <Skeleton classes="text width-100" />
                        <Skeleton classes="text width-100" />
                        <Skeleton classes="text width-100" />
                    </div>
                ))}
            </div>
        </>

    )
}

export default SkeletonPost