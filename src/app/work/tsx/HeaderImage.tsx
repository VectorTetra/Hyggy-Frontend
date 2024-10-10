import Image from "next/image";
import styles from "../css/HeaderImage.module.css";

export default function HeaderImage(props: any) {
	return (
		<div key={props.item.id} className={styles.imageContainer}>
			<Image
				src={props.item.src}
				alt={props.item.alt}
				width={1140}
				height={400}
				className={styles.image}
				priority={true}
			/>
		</div>
	);
}
