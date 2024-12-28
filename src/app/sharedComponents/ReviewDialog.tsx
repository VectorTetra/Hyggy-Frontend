import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import styles from "@/app/sharedComponents/css/ReviewDialog.module.css";
import Link from "next/link";
import useReviewDialogStore from "@/store/reviewDialogStore";
import { useCreateWareReview } from "@/pages/api/WareReviewApi";
import { toast } from "react-toastify";
import { getDecodedToken, isUser, validateToken } from "@/pages/api/TokenApi";

interface ReviewModalProps {
    onClose: () => void;
    wareId: number; // Додано, щоб прив'язати відгук до конкретного товару
}

export interface ReviewData {
    rating: number;
    topic: string;
    name: string;
    email: string;
    review: string;
    termsAccepted: boolean;
}

export default function ReviewDialog({ onClose, wareId }: ReviewModalProps) {
    const { isModalOpen, setIsModalOpen } = useReviewDialogStore();
    const [reviewData, setReviewData] = useState<ReviewData>({
        rating: 0,
        topic: "",
        name: "",
        email: "",
        review: "",
        termsAccepted: false,
    });
    // Блокування скролу
    useEffect(() => {
        // Блокуємо скрол
        document.body.style.overflow = "hidden";
        return () => {
            // Розблоковуємо скрол при розмонтуванні компонента
            document.body.style.overflow = "auto";
        };
    }, []);
    // Використання useCreateWareReview для відправки запиту
    const { mutateAsync: createReview, isPending: isReviewPending } = useCreateWareReview();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setReviewData({ ...reviewData, [name]: value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReviewData({ ...reviewData, termsAccepted: e.target.checked });
    };

    const handleRatingChange = (newRating: number) => {
        setReviewData((prev) => ({
            ...prev,
            rating: newRating,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (reviewData.rating === 0) {
            toast.error("Будь ласка, вкажіть рейтинг.");
            return;
        }
        if (!reviewData.termsAccepted) {
            toast.error("Ви повинні прийняти Умови та Положення.");
            return;
        }

        const reviewPayload = {
            Text: reviewData.review,
            Theme: reviewData.topic,
            CustomerName: reviewData.name,
            Email: reviewData.email,
            Rating: reviewData.rating,
            WareId: wareId, // ID товару
            AuthorizedCustomerId: (validateToken().status === 200 && isUser()) ? getDecodedToken()?.nameid ?? null : null, // Якщо потрібно, можна додати логіку авторизації
        };

        createReview(reviewPayload, {
            onSuccess: () => {
                toast.success("Відгук успішно надіслано!");
                onClose();
            },
            onError: () => {
                toast.error("Не вдалося надіслати відгук. Спробуйте ще раз.");
            },
        });
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div onClick={onClose} className={styles.close}>
                    &times;
                </div>
                <h3>Залишити відгук</h3>
                <form onSubmit={handleSubmit}>
                    <hr />
                    <div className={styles.formRating}>
                        <StarRating rating={reviewData.rating} onRatingChange={handleRatingChange} hoverEffect={true} />
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
                            />
                            &nbsp;Прийняти{" "}
                            <Link prefetch={true} href="https://jysk.ua/umovi-ta-polozhennya#8">
                                Умови та Положення
                            </Link>
                        </label>
                    </div>
                    <center>
                        <button type="submit" className={styles.submitButton} disabled={isReviewPending}>
                            {isReviewPending ? "Надсилання..." : "Надіслати відгук"}
                        </button>
                    </center>
                </form>
            </div>
        </div>
    );
}
