// import { useState } from "react";
// import styles from "../page.module.css";

// interface FavoriteButtonProps {
//     className: string;
//     productId: number;
//     isFavorite: boolean;
//     toggleFavorite: (productId: number) => void;
//     width?: string;
//     height?: string;
// }

// const FavoriteButton: React.FC<FavoriteButtonProps> = ({ className, productId, isFavorite, toggleFavorite, width = "30px", height = "30px" }) => (
//     <button className={className} onClick={() => toggleFavorite(productId)}>
//         {/* {isFavorite ? "💖" : "🖤"} */}
//         {isFavorite ? (
//             <svg
//                 width={width}
//                 height={height}
//                 viewBox="0 0 46 42"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//             >
//                 <path
//                     d="M24.6348 6.37924C26.5665 3.6382 29.6631 2.00037 33.2666 2C36.0699 2.0037 38.785 3.1907 40.8083 5.34648L42.2666 3.97778L40.8083 5.34648C42.8359 7.50683 43.9967 10.4615 44 13.5678C43.999 20.3414 39.23 26.7617 33.8651 31.7677C29.0345 36.275 24.0997 39.2849 23 39.9309C21.9003 39.2849 16.9655 36.275 12.1349 31.7677C6.76972 26.7614 2.00051 20.3408 2 13.5668C2.00354 10.4608 3.16428 7.5066 5.19167 5.34648C7.21498 3.1907 9.93013 2.0037 12.7334 2C16.3369 2.00037 19.4335 3.6382 21.3652 6.37924L23 8.69917L24.6348 6.37924Z"
//                     fill="#231F20"
//                     stroke="#231F20"
//                     strokeWidth="4"
//                 />
//             </svg>
//         ) : (
//             <svg
//                 width={width}
//                 height={height}
//                 viewBox="0 0 46 42"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//             >
//                 <path
//                     d="M24.6348 6.37924C26.5665 3.6382 29.6631 2.00037 33.2666 2C36.0699 2.0037 38.785 3.1907 40.8083 5.34648L42.2666 3.97778L40.8083 5.34648C42.8359 7.50683 43.9967 10.4615 44 13.5678C43.999 20.3414 39.23 26.7617 33.8651 31.7677C29.0345 36.275 24.0997 39.2849 23 39.9309C21.9003 39.2849 16.9655 36.275 12.1349 31.7677C6.76972 26.7614 2.00051 20.3408 2 13.5668C2.00354 10.4608 3.16428 7.5066 5.19167 5.34648C7.21498 3.1907 9.93013 2.0037 12.7334 2C16.3369 2.00037 19.4335 3.6382 21.3652 6.37924L23 8.69917L24.6348 6.37924Z"
//                     stroke="#231F20"
//                     strokeWidth="4"
//                 />
//             </svg>
//         )}
//     </button>
// );

// export default FavoriteButton;


import { useState, useEffect } from "react";
import styles from "../page.module.css";
import { validateToken } from '@/pages/api/TokenApi';
interface FavoriteButtonProps {
    className: string;
    productId: number;
    isFavorite: boolean;
    toggleFavorite: (productId: number) => void;
    isAuthorized: boolean;
    width?: string;
    height?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    className,
    productId,
    isFavorite,
    toggleFavorite,
    width = "30px",
    height = "30px",
}) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const response = await validateToken();
                if (response.status === 200) {
                    setIsAuthorized(true);
                }
            } catch (error) {
                setIsAuthorized(false);
            }
        };
        checkAuthorization();
    }, []);

    const handleButtonClick = () => {
        if (!isAuthorized) {
            setShowMessage(true); // Показать сообщение
            setTimeout(() => setShowMessage(false), 5000);
            return;
        }
        toggleFavorite(productId);
    };

    return (
        <div className={styles.favoriteButtonContainer}>
            <button className={className} onClick={handleButtonClick}>
                {isFavorite ? (
                    <svg
                        width={width}
                        height={height}
                        viewBox="0 0 46 42"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M24.6348 6.37924C26.5665 3.6382 29.6631 2.00037 33.2666 2C36.0699 2.0037 38.785 3.1907 40.8083 5.34648L42.2666 3.97778L40.8083 5.34648C42.8359 7.50683 43.9967 10.4615 44 13.5678C43.999 20.3414 39.23 26.7617 33.8651 31.7677C29.0345 36.275 24.0997 39.2849 23 39.9309C21.9003 39.2849 16.9655 36.275 12.1349 31.7677C6.76972 26.7614 2.00051 20.3408 2 13.5668C2.00354 10.4608 3.16428 7.5066 5.19167 5.34648C7.21498 3.1907 9.93013 2.0037 12.7334 2C16.3369 2.00037 19.4335 3.6382 21.3652 6.37924L23 8.69917L24.6348 6.37924Z"
                            fill="#231F20"
                            stroke="#231F20"
                            strokeWidth="4"
                        />
                    </svg>
                ) : (
                    <svg
                        width={width}
                        height={height}
                        viewBox="0 0 46 42"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M24.6348 6.37924C26.5665 3.6382 29.6631 2.00037 33.2666 2C36.0699 2.0037 38.785 3.1907 40.8083 5.34648L42.2666 3.97778L40.8083 5.34648C42.8359 7.50683 43.9967 10.4615 44 13.5678C43.999 20.3414 39.23 26.7617 33.8651 31.7677C29.0345 36.275 24.0997 39.2849 23 39.9309C21.9003 39.2849 16.9655 36.275 12.1349 31.7677C6.76972 26.7614 2.00051 20.3408 2 13.5668C2.00354 10.4608 3.16428 7.5066 5.19167 5.34648C7.21498 3.1907 9.93013 2.0037 12.7334 2C16.3369 2.00037 19.4335 3.6382 21.3652 6.37924L23 8.69917L24.6348 6.37924Z"
                            stroke="#231F20"
                            strokeWidth="4"
                        />
                    </svg>
                )}
            </button>
            {showMessage && (
                <div className={styles.message}>
                    Увійдіть або зареєструйтеся, щоб мати можливість зберігати Обрані товари
                </div>
            )}
        </div>
    );
};

export default FavoriteButton;

