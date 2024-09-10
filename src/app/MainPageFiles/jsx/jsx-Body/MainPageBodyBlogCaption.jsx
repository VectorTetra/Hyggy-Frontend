import styles from "./../../styles/MainPageBody-styles.module.css";

export default function MainPageBodyBlogCaption(props) {
	return (
		<div className={styles["category-caption"]}>
			{props.caption}
		</div>
	);
}
