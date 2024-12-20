
import { Ware } from '@/pages/api/WareApi';
import { useWareReviews } from '@/pages/api/WareReviewApi';
import useReviewDialogStore from '@/store/reviewDialogStore';
import { useEffect } from 'react';
import StarRating from '../../sharedComponents/StarRating';
import styles from "../css/ReviewWare.module.css";
import ReviewDialog from '../../sharedComponents/ReviewDialog';

export default function ReviewWare({ product }: { product: Ware }) {
  const { isModalOpen, setIsModalOpen } = useReviewDialogStore();

  const { data: reviews = [], refetch } = useWareReviews(
    {
      SearchParameter: "WareId",
      WareId: product ? product.id : 0,
      Sorting: "IdDesc",
    },
    //false // Запит не виконується автоматично
    true
  );
  console.log(reviews);

  // Викликаємо refetch, коли продукт завантажено
  useEffect(() => {
    if (product) {
      refetch();
    }
  }, [product, refetch]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";

    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <div className={styles.reviewsContainer}>
      <div className={styles.overallRating}>
        <div className={styles.rating}>
          <StarRating rating={Number(product.averageRating)} />
          <span className={styles.ratingText}>{product.averageRating.toFixed(1)} / 5</span>
        </div>
        <div className={styles.mainText}>Оцінка користувачів</div>
        <button
          className={styles.leaveReviewButton}
          onClick={() => setIsModalOpen(true)}>
          Залишити відгук
        </button>
      </div>
      {isModalOpen && (
        <ReviewDialog onClose={() => setIsModalOpen(false)} wareId={product.id} />
      )}
      {/* <hr className={styles.reviewHr} /> */}
      <div className={styles.reviewsList}>
        {Array.isArray(reviews) && reviews.length > 0 && reviews.map((review, index) => (
          <div key={index} className={styles.reviewItem}>
            <span className={styles.reviewerName}>{review.customerName}</span>
            <div className={styles.reviewContent}>
              <div className={styles.reviewRatingContainer}>
                <StarRating rating={Number(review.rating)} />
                <span className={styles.reviewRating}>{review.rating} / 5</span>
              </div>
            </div>
            <span className={styles.reviewText}>{review.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
