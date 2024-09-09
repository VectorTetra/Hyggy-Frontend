import styles from "./css/StarRating.module.css";

interface StarRatingProps {
	rating: number;
}

export default function StarRating({ rating }: StarRatingProps) {
	const fullStars = Math.floor(rating); // Повні зірки
	const partialStar = rating - fullStars; // Часткова зірка
	const maxStars = 5; // Максимальна кількість зірок
	const starElements = [];

	// Додавання повних зірок
	for (let i = 0; i < fullStars; i++) {
		starElements.push(
			<span key={i} className={styles.fullStar}>
				★
			</span>
		);
	}

	// Додавання часткової зірки, якщо вона є
	if (partialStar > 0) {
		starElements.push(
			<span key="partial" className={styles.partialStarContainer}>
				<span
					className={styles.partialStar}
					style={{ width: `${partialStar * 100}%` }}
				>
					★
				</span>
				<span className={styles.emptyStar}>★</span>
			</span>
		);
	}

	// Додавання порожніх зірок
	for (let i = fullStars + (partialStar > 0 ? 1 : 0); i < maxStars; i++) {
		starElements.push(
			<span key={i} className={styles.emptyStar}>
				★
			</span>
		);
	}

	return <div className={styles.starRating}>{starElements}</div>;
}
