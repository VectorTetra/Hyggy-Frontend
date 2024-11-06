// components/WareCard.tsx
import Link from "next/link";
import Image from "next/image";
import styles from "../css/WareGrid.module.css";
import StarRating from "../../sharedComponents/StarRating";
import { Ware } from "@/pages/api/WareApi";
import { ShopGetDTO } from "@/pages/api/ShopApi";

type WareCardProps = {
    ware: Ware;
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
                <button
                    className={styles.favoriteButton}
                    onClick={() => toggleFavorite(ware.id)}
                >
                    {isFavorite ? "💖" : "🖤"}
                </button>
                <Link href={`/ware/${ware.id}`} className={styles.wareCardLink}>
                    <Image
                        src={ware.previewImagePath}
                        alt={ware.name}
                        className={styles.wareImage}
                        layout="contain"
                        width={300}
                        height={400}
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
                        {Math.ceil(ware.finalPrice)} грн
                    </span>
                    {ware.discount !== 0 && (
                        <span className={styles.oldPrice}>{ware.price} грн</span>
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
