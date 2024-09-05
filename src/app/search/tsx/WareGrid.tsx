import { useState } from "react";
import styles from "../page.module.css";
import Link from "next/link";
import Image from "next/image";

export default function WareGrid(props: any) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (wareId: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(wareId)
        ? prevFavorites.filter((id) => id !== wareId)
        : [...prevFavorites, wareId]
    );
  };

  // Функція для відображення зірочок на основі рейтингу
  const renderStars = (rating: number) => {
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

    return starElements;
  };

  return (
    <div id={styles.wareGrid}>
      {props.wares.map((ware: any) => (
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
                src={ware.imageSrc}
                alt={ware.longName}
                className={styles.wareImage}
                layout='responsive'
                width={300}
                height={400}
              />
              <div className={styles.wareStickersContainer}>
                {ware.discount > 0 && <span className={styles.discountSticker}> - {ware.discount} %</span>}
                {ware.tag === "Новинка" && <span className={styles.newSticker}>Новинка</span>}
                {ware.tag === "Завжди низька ціна" && <span className={styles.lowPriceSticker}>Завжди низька ціна</span>}
                {ware.tag === "Чудова пропозиція" && <span className={styles.saleSticker}>Чудова пропозиція</span>}
              </div>
            </Link>
          </div>



          <div className={styles.wareInfo}>
            <h3>{ware.shortName}</h3>
            <p>{ware.longName}</p>

            <div className={styles.rating}>{renderStars(ware.rating)}</div>
            <div className={styles.warePrice}>
              <span className={styles.discountedPrice}>
                {Math.ceil(ware.price * ((100 - ware.discount) / 100))} грн
              </span>
              {ware.discount !== 0 && (
                <span className={styles.oldPrice}>{ware.price} грн</span>
              )}
            </div>

            <table className={styles.availability}>
              <tbody>
                <tr className={styles.delivery}>
                  {ware.deliveryOption.includes("Немає доставки") && <td>🔴</td>}
                  {ware.deliveryOption.includes("Отримати сповіщення") && <td>🟡</td>}
                  {ware.deliveryOption.includes("Є доставка") && <td>🟢</td>}
                  <td>{ware.deliveryOption}</td>
                </tr>
                <tr className={styles.storeAvailability}>
                  {ware.storeAvailability.includes("Немає в наявності") && <td>🔴</td>}
                  {ware.storeAvailability.includes("Можливо замовити") && <td>🟡</td>}
                  {ware.storeAvailability.includes("In stock") && <td>🟢</td>}
                  <td>{ware.storeAvailability}</td>
                </tr>
              </tbody>
            </table>
          </div>


        </div>

      ))}
    </div>
  );
}
