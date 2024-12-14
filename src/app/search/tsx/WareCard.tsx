// components/WareCard.tsx
import Link from "next/link";
import Image from "next/image";
import styles from "../css/WareGrid.module.css";
import StarRating from "../../sharedComponents/StarRating";
import { WareGetDTO } from "@/pages/api/WareApi";
import { ShopGetDTO } from "@/pages/api/ShopApi";
import FavoriteButton from "@/app/sharedComponents/FavoriteButton";

type WareCardProps = {
    ware: WareGetDTO;
    isFavorite: boolean;
    toggleFavorite: (wareId: number) => void;
    selectedShop: ShopGetDTO | null;
};

export default function WareCard({
    ware,
    isFavorite,
    toggleFavorite,
    selectedShop
}: WareCardProps) {
    return (
        <div className={styles.wareCard}>
            <div className={styles.wareCardLinkContainer}>
                {/* <button
                    className={styles.favoriteButton}
                    onClick={() => toggleFavorite(ware.id)}
                >
                    {isFavorite ? (
                        <svg
                            width="30"
                            height="30"
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
                            width="30"
                            height="30"
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
                </button> */}
                <FavoriteButton className={styles.favoriteButton} productId={ware.id} isFavorite={isFavorite} toggleFavorite={toggleFavorite} />
                <Link prefetch={true} href={`/ware/${ware.id}`} className={styles.wareCardLink}>
                    <Image
                        src={ware.previewImagePath ? ware.previewImagePath : "/images/imageFallback.png"}
                        alt={ware.name}
                        className={styles.wareImage}
                        layout="intrinsic"
                        width={300}
                        height={400}
                        style={{ objectFit: "contain" }} // Заміна layout для об’єкта
                    />
                    <div className={styles.wareStickersContainer}>
                        {ware.discount > 0 && (
                            <span className={styles.discountSticker}>- {ware.discount} %</span>
                        )}
                        {ware.statusIds.includes(3) && (
                            <span className={styles.newSticker}>Новинка</span>
                        )}
                        {ware.statusIds.includes(1) && (
                            <span className={styles.lowPriceSticker}>Завжди низька ціна</span>
                        )}
                        {ware.statusIds.includes(2) && (
                            <span className={styles.saleSticker}>Чудова пропозиція</span>
                        )}
                    </div>
                </Link>
            </div>

            <div className={styles.wareInfo}>
                <h3>{ware.name}</h3>
                <p>{ware.description}</p>

                <div className={styles.rating}>
                    <StarRating rating={ware.averageRating} />
                </div>
                <div className={styles.warePrice}>
                    <span className={styles.discountedPrice}>
                        {(ware.finalPrice.toFixed(2))} грн
                    </span>
                    {ware.discount !== 0 && (
                        <span className={styles.oldPrice}>{ware.price.toFixed(2)} грн</span>
                    )}
                </div>

                <table className={styles.availability}>
                    <tbody>
                        <tr className={styles.delivery} >
                            {!ware.isDeliveryAvailable ? (
                                <td className={styles.statusCircleTd}>
                                    <svg width="12" height="12">
                                        <circle cx="6" cy="6" r="6" fill="red" />
                                    </svg>
                                </td>
                            ) : (
                                <td className={styles.statusCircleTd}>
                                    <svg width="12" height="12">
                                        <circle cx="6" cy="6" r="6" fill="green" />
                                    </svg>
                                </td>
                            )}
                            <td>{ware.isDeliveryAvailable ? "Є доставка" : "Немає доставки"}</td>
                        </tr>

                        {Array.isArray(ware.wareItems) &&
                            (ware.wareItems.every(wi => wi.quantity === 0) ||
                                ware.wareItems.length === 0) && (
                                <tr className={styles.storeAvailability}>
                                    <td className={styles.statusCircleTd}>
                                        <svg width="12" height="12">
                                            <circle cx="6" cy="6" r="6" fill="red" />
                                        </svg>
                                    </td>
                                    <td>Неможливо замовити</td>
                                </tr>
                            )}
                        {Array.isArray(ware.wareItems) && selectedShop !== null &&
                            ware.wareItems.some(wi => wi.quantity > 0) && // Є в наявності у будь-якому магазині
                            !ware.wareItems.some(wi => wi.quantity > 0 && wi.storageId === selectedShop?.storageId) && ( // Відсутній у вибраному магазині
                                <tr className={styles.storeAvailability}>
                                    <td className={styles.statusCircleTd}>
                                        <svg width="12" height="12">
                                            <circle cx="6" cy="6" r="6" fill="yellow" />
                                        </svg>
                                    </td>
                                    <td>Можливо замовити в {selectedShop?.name}</td>
                                </tr>
                            )}
                        {Array.isArray(ware.wareItems) && selectedShop !== null &&
                            ware.wareItems.some(
                                wi => wi.quantity > 0 && wi.storageId === selectedShop?.storageId
                            ) && (
                                <tr className={styles.storeAvailability}>
                                    <td className={styles.statusCircleTd}>
                                        <svg width="12" height="12">
                                            <circle cx="6" cy="6" r="6" fill="green" />
                                        </svg>
                                    </td>
                                    <td>Є в наявності в {selectedShop?.name}</td>
                                </tr>
                            )}
                        {Array.isArray(ware.wareItems) && selectedShop === null &&
                            ware.wareItems.filter(wi => wi.quantity > 0).length > 0 &&
                            (
                                <tr className={styles.storeAvailability}>
                                    <td className={styles.statusCircleTd}>
                                        <svg width="12" height="12">
                                            <circle cx="6" cy="6" r="6" fill="green" />
                                        </svg>
                                    </td>
                                    <td>Є в наявності в {ware.wareItems.filter(wi => wi.quantity > 0).length} магазинах </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
