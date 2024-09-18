import StarRating from '../../sharedComponents/StarRating';
import styles from "../css/ReviewWare.module.css";
import { Product } from '../types/Product';

export default function ReviewWare({ product }: { product: Product }) {
  return (
    <div className={styles.reviewsContainer}>
      <div className={styles.overallRating}>
        <div className={styles.rating}>
          <StarRating rating={Number(product.rating)} />
          <span className={styles.ratingText}>{product.rating} / 5</span>
        </div>
        <div className={styles.mainText}>Оцінка користувачів</div>
        <button className={styles.leaveReviewButton}>Залишити відгук</button>
      </div>
      <hr className={styles.reviewHr} />
      <div className={styles.reviewsList}>
        {product.lastReviews.map((review, index) => (
          <div key={index} className={styles.reviewItem}>
            <span className={styles.reviewerName}>{review.name}</span>
            <span className={styles.reviewText}>{review.text}</span>
            <div className={styles.reviewContent}>
              <div className={styles.reviewRatingContainer}>
                <StarRating rating={Number(review.rating)} />
                <span className={styles.reviewRating}>{review.rating} / 5</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
