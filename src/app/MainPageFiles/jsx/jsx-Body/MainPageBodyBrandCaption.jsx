import styles from "./../../styles/MainPageBody-styles.module.css";

export default function MainPageBodyBrandCaption(props) {
	return (
		<div className={styles["category-caption"]}>
			<div className={styles.caption}>
				{props.caption}
			</div>
		</div>
	);
}
