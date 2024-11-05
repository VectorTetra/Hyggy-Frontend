import { useState } from 'react';
import StarRating from '../../sharedComponents/StarRating';
import styles from "../../ware/css/ReviewWare.module.css";
import Link from 'next/link';

export default function ReviewModal({ isOpen, onClose, product }) {
    const [reviewData, setReviewData] = useState({
        rating: 0,
        topic: '',
        name: '',
        email: '',
        review: '',
        termsAccepted: false,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReviewData({ ...reviewData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setReviewData({ ...reviewData, termsAccepted: e.target.checked });
    };

    const handleRatingChange = (newRating) => {
        setReviewData((prev) => ({
            ...prev,
            rating: newRating,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (reviewData.rating === 0) {
            alert("Будь ласка, вкажіть рейтинг.");
            return;
        }
        if (!reviewData.termsAccepted) {
            alert("Ви повинні прийняти Умови та Положення");
            return;
        }

        // Добавляем идентификатор продукта в данные отзыва
        const fullReviewData = { ...reviewData, productId: product.shortName };

        try {
            // Отправка данных в JSON (замените путь на нужный)
            await fetch('/path/to/reviews.json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fullReviewData),
            });
            alert("Відгук відправлений успішно.");
            onClose();
        } catch (error) {
            console.error("Помилка при відправленні відгуку:", error);
            alert("Не вдалося надіслати відгук.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                {/* Кнопка закрытия модального окна */}
                <span onClick={onClose} className={styles.close}>×</span>
                <h1>Залишити відгук</h1>
                <form onSubmit={handleSubmit}>
                    <hr />
                    <div className={styles.formRating}>
                        <StarRating rating={reviewData.rating} onRatingChange={handleRatingChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="topic"
                            value={reviewData.topic}
                            onChange={handleInputChange}
                            required
                            placeholder="Тема*"
                            className={styles.formInput}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="name"
                            value={reviewData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Ім’я*"
                            className={styles.formInput}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="email"
                            name="email"
                            value={reviewData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="E-mail*"
                            className={styles.formInput}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <textarea
                            name="review"
                            value={reviewData.review}
                            onChange={handleInputChange}
                            required
                            placeholder="Відгук*"
                            className={styles.formTextarea}
                        ></textarea>
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            <input
                                type="checkbox"
                                name="termsAccepted"
                                checked={reviewData.termsAccepted}
                                onChange={handleCheckboxChange}
                                required
                            />&nbsp;Прийняти <Link href="https://jysk.ua/umovi-ta-polozhennya#8">Умови та Положення</Link>
                        </label>
                    </div>
                    <center><button type="submit" className={styles.submitButton}> Надіслати відгук</button></center>
                </form>
            </div>
        </div>
    );
}
