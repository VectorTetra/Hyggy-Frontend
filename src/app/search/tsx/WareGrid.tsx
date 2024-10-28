import { useState, useEffect } from "react";
import styles from "../css/WareGrid.module.css";
import Link from "next/link";
import Image from "next/image";
import StarRating from "../../sharedComponents/StarRating";
import Pagination from "../../sharedComponents/Pagination";
import { Ware } from "@/types/searchTypes";

export default function WareGrid(props: any) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  console.log('items per page:', props.itemsPerPage)
  // Додавання товару до обраних
  const toggleFavorite = (wareId: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(wareId)
        ? prevFavorites.filter((id) => id !== wareId)
        : [...prevFavorites, wareId]
    );
  };
  // Після зміни сторінки прокрутити вгору
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0); // затримка 0 мс
  }, [currentPage]);


  const itemsPerPage = props.itemsPerPage !== undefined ? props.itemsPerPage : 20; // Кількість товарів на сторінку
  const totalItems = props.wares.length;
  // Визначення товарів, які будуть відображені на поточній сторінці
  const displayedWares = props.wares.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div id={styles.wareGrid}>
        {displayedWares.map((ware: Ware) => (
          <div key={ware.id} className={styles.wareCard}>
            <div className={styles.wareCardLinkContainer}>
              <button
                className={styles.favoriteButton}
                onClick={() => toggleFavorite(ware.id)}
              >
                {favorites.includes(ware.id) ? "💖" : "🖤"}
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
                  {ware.discount > 0 && <span className={styles.discountSticker}> - {ware.discount} %</span>}
                  {ware.statusNames.includes("Новинка") && <span className={styles.newSticker}>Новинка</span>}
                  {ware.statusNames.includes("Завжди низька ціна") && <span className={styles.lowPriceSticker}>Завжди низька ціна</span>}
                  {ware.statusNames.includes("Чудова пропозиція") && <span className={styles.saleSticker}>Чудова пропозиція</span>}
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
                  <span className={styles.oldPrice}>{ware.finalPrice} грн</span>
                )}
              </div>

              <table className={styles.availability}>
                <tbody>
                  <tr className={styles.delivery}>
                    {!ware.isDeliveryAvailable && <td><svg width="12" height="12">
                      <circle cx="6" cy="6" r="6" fill="red" />
                    </svg></td>}
                    {ware.isDeliveryAvailable && <td><svg width="12" height="12">
                      <circle cx="6" cy="6" r="6" fill="green" />
                    </svg></td>}
                    <td>{ware.isDeliveryAvailable ? "Є доставка" : "Немає доставки"}</td>
                  </tr>

                  {(Array.isArray(ware.wareItems) && ware.wareItems.every(wi => wi.quantity === 0)) &&
                    <tr className={styles.storeAvailability}>
                      <td><svg width="12" height="12">
                        <circle cx="6" cy="6" r="6" fill="red" />
                      </svg></td>
                      <td>Неможливо замовити</td>
                    </tr>
                  }
                  {(ware.storeAvailability.includes("Можливо замовити")) && <td><svg width="12" height="12">
                    <circle cx="6" cy="6" r="6" fill="yellow" />
                  </svg></td>}
                  {ware.storeAvailability.includes("In stock") && <td><svg width="12" height="12">
                    <circle cx="6" cy="6" r="6" fill="green" />
                  </svg></td>}


                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
