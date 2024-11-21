import { useState, useEffect } from "react";
import styles from "../css/SimilarWare.module.css";
import Link from "next/link";
import Image from "next/image";
import StarRating from "../../sharedComponents/StarRating";
import { Product } from '../types/Product';

export default function SimilarWare({ product }: { product: Product }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(0);

  const toggleFavorite = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prevFavorites) =>
      prevFavorites.includes(productId)
        ? prevFavorites.filter((id) => id !== productId)
        : [...prevFavorites, productId]
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setItemsPerSlide(1);
      } else if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
        setItemsPerSlide(2);
      } else if (window.innerWidth <= 1360) {
        setItemsPerSlide(3);
      } else {
        setItemsPerSlide(4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const totalSlides = Math.ceil(product.similarProducts.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className={styles.similarProductsContainer}>
      <div className={styles.carouselContainer}>
        {product.similarProducts.slice(currentSlide * itemsPerSlide, (currentSlide + 1) * itemsPerSlide).map((similarProduct) => (
          <div key={similarProduct.id} className={styles.similarProductCard}>
            <Link prefetch={true} href={`/ware/${similarProduct.id}`} className={styles.wareCardLink}>
              <div className={styles.similarProductImage}>
                <Image
                  src={similarProduct.imageSrc}
                  alt={similarProduct.longName}
                  className={styles.wareImage}
                  layout="fill"
                  objectFit="contain"
                />
                <button
                  className={styles.favoriteButton}
                  onClick={(e) => toggleFavorite(e, similarProduct.id)}
                >
                  {favorites.includes(similarProduct.id) ? "💖" : "🖤"}
                </button>
                <div className={styles.wareStickersContainer}>
                  {similarProduct.discount > 0 && <span className={styles.discountSticker}> - {similarProduct.discount} %</span>}
                  {similarProduct.tag === "Новинка" && <span className={styles.newSticker}>Новинка</span>}
                  {similarProduct.tag === "Завжди низька ціна" && <span className={styles.lowPriceSticker}>Завжди низька ціна</span>}
                  {similarProduct.tag === "Чудова пропозиція" && <span className={styles.saleSticker}>Чудова пропозиція</span>}
                </div>
              </div>
            </Link>
            <div className={styles.similarProductInfo}>
              <div className={styles.similarProductName}>{similarProduct.shortName}</div>
              <div className={styles.similarProductDescription}>{similarProduct.longName}</div>
              <div className={styles.rating}>
                <StarRating rating={similarProduct.rating} />
              </div>
              <div className={styles.similarProductPrices}>
                <span className={styles.similarProductCurrentPrice}>
                  {Math.ceil(similarProduct.price * ((100 - similarProduct.discount) / 100))} грн
                </span>
                {similarProduct.discount > 0 && (
                  <span className={styles.similarProductOldPrice}>{similarProduct.price} грн</span>
                )}
              </div>
              <table className={styles.availability}>
                <tbody>
                  <tr className={styles.delivery}>
                    {similarProduct.deliveryOption.includes("Немає доставки") && <td><svg width="12" height="12">
                      <circle cx="6" cy="6" r="6" fill="red" />
                    </svg></td>}
                    {similarProduct.deliveryOption.includes("Отримати сповіщення") && <td><svg width="12" height="12">
                      <circle cx="6" cy="6" r="6" fill="yellow" />
                    </svg></td>}
                    {similarProduct.deliveryOption.includes("Є доставка") && <td><svg width="12" height="12">
                      <circle cx="6" cy="6" r="6" fill="green" />
                    </svg></td>}
                    <td>{similarProduct.deliveryOption}</td>
                  </tr>
                  <tr className={styles.storeAvailability}>
                    {similarProduct.storeAvailability.includes("Немає в наявності") && <td><svg width="12" height="12">
                      <circle cx="6" cy="6" r="6" fill="red" />
                    </svg></td>}
                    {similarProduct.storeAvailability.includes("Можливо замовити") && <td><svg width="12" height="12">
                      <circle cx="6" cy="6" r="6" fill="yellow" />
                    </svg></td>}
                    {similarProduct.storeAvailability.includes("In stock") && <td><svg width="12" height="12">
                      <circle cx="6" cy="6" r="6" fill="green" />
                    </svg></td>}
                    <td>{similarProduct.storeAvailability}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      <button className={`${styles.carouselControl} ${styles.prevButton}`} onClick={prevSlide}>
        <span className={styles.carouselIcon}>&#10094;</span>
      </button>
      <button className={`${styles.carouselControl} ${styles.nextButton}`} onClick={nextSlide}>
        <span className={styles.carouselIcon}>&#10095;</span>
      </button>
    </div>
  );
}
