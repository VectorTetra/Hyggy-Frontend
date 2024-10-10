import styles from "./css/StarRating.module.css";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void; 
}

export default function StarRating({ rating, onRatingChange }: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null); 
  const fullStars = Math.floor(hoveredRating ?? rating); // Повні зірки, з урахуванням наведення
	const partialStar = hoveredRating === null ? rating - fullStars : 0; // Часткова зірка тільки при відсутності наведення
	const maxStars = 5; // Максимальна кількість зірок

  const starElements = [];

  const handleStarClick = (index: number) => {
    if (onRatingChange) {
      onRatingChange(index + 1); 
    }
  };

  const handleStarMouseEnter = (index: number) => {
    setHoveredRating(index + 1);
  };

  const handleStarMouseLeave = () => {
    setHoveredRating(null);
  };

  // Додавання повних зірок
  for (let i = 0; i < fullStars; i++) {
    starElements.push(
      <span
        key={i}
        className={styles.fullStar}
        onClick={() => handleStarClick(i)}
        onMouseEnter={() => handleStarMouseEnter(i)}
        onMouseLeave={handleStarMouseLeave}
        style={{ cursor: onRatingChange ? "pointer" : "default" }}
      >
        ★
      </span>
    );
  }

  // Додавання часткової зірки, якщо вона є
  if (partialStar > 0 && hoveredRating === null) {
    starElements.push(
      <span
        key="partial"
        className={styles.partialStarContainer}
        onClick={() => handleStarClick(fullStars)}
        onMouseEnter={() => handleStarMouseEnter(fullStars)}
        onMouseLeave={handleStarMouseLeave}
        style={{ cursor: onRatingChange ? "pointer" : "default" }}
      >
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
      <span
        key={i}
        className={styles.emptyStar}
        onClick={() => handleStarClick(i)}
        onMouseEnter={() => handleStarMouseEnter(i)}
        onMouseLeave={handleStarMouseLeave}
        style={{ cursor: onRatingChange ? "pointer" : "default" }}
      >
        ★
      </span>
    );
  }

  return <div className={styles.starRating}>{starElements}</div>;
}