import Link from "next/link";
import styles from "./../../styles/MainPageBody-styles.module.css";

export default function MainPageBodyBlogButtonSmallAdapt({ link, text }) {
	return (
		<Link prefetch={true} href={link} className={styles["blog-buttonSmall"]}>
			{text}
		</Link>
	);
}
