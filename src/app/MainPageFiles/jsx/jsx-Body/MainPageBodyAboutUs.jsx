import Link from "next/link";
import Image from "next/image";
import styles from "@/app/MainPageFiles/styles/MainPageBody-styles.module.css";

function MainPageBodyAboutUs(props) {
    return (
        <div className={styles["brand-container"]}>
            {props.aboutus.map((item, index) => (
                <div key={index} className={styles["brand-item"]}>
                    <Link prefetch={true} style={{ textDecoration: "none" }} href={item.urlpage}>
                        <Image
                            className={styles["imageaboutus"]}
                            src={item.urlimage}
                            alt={item.captoin}
                            width={50} // Фіксована ширина
                            height={50} // Фіксована висота
                            style={{ objectFit: "contain" }} // Пропорційне вміщення
                        />
                        {/* <img className={styles["imageaboutus"]} src={item.urlimage} alt={item.captoin} /> */}
                        <div className={styles["aboutus-textcaption"]}>{item.captoin}</div>
                        <div className={styles["aboutus-text"]}>{item.text}</div>
                    </Link>
                </div>
            ))
            }
        </div >
    );
}

export default MainPageBodyAboutUs;
