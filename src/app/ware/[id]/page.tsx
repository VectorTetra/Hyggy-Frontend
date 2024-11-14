"use client";
import { useParams, notFound } from 'next/navigation';
import { useState, useEffect } from "react";
import styles from "../page.module.css";
import Layout from "../../sharedComponents/Layout";
import StarRating from "../../sharedComponents/StarRating";
import DescriptionWare from '../tsx/DescriptionWare';
import ArticlesWare from '../tsx/ArticlesWare';
import SpecificationWare from '../tsx/SpecificationWare';
import ReviewWare from '../tsx/ReviewWare';
import SimilarWare from '../tsx/SimilarWare';
import CartPopup from '../tsx/CartPopup';
import jsonData from '../structure.json';
import {
  getCartFromLocalStorage,
  addToCart,
  removeFromCart
} from '../../cart/types/Cart';

interface CartItem {
  productDescription: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: string;

  oldPrice: string;
  selectedOption: string;
}

export default function WarePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const product = jsonData.find((item) => item.id === Number(id));
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState("delivery");
  const [showPopup, setShowPopup] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselElement = document.getElementById("imageCarousel");
  const [favorites, setFavorites] = useState<number[]>([]);

  if (!product) {
    return notFound();
  }

  useEffect(() => {
    setCartItems(getCartFromLocalStorage());
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      setShowPopup(false);
    }
  }, [cartItems]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAddToCart = () => {
    const newItem = {
      productDescription: product.productDescription,
      productName: product.productName,
      productImage: product.mainImage1,
      quantity: quantity,
      price: product.currentPrice,
      oldPrice: product.oldPrice,
      selectedOption: selectedOption,
    };

    const updatedCart = addToCart(cartItems, newItem);
    setCartItems(updatedCart);
    setShowPopup(true);
  };

  const handleRemoveItem = (index: number) => {
    const updatedCart = removeFromCart(cartItems, index);
    setCartItems(updatedCart);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showPopup]);

  const handleSlide = (index) => {
    setActiveIndex(index);
  };

  const handleSlideChange = (event) => {
    setActiveIndex(event.to);
  };

  carouselElement?.addEventListener("slid.bs.carousel", handleSlideChange);

  const toggleFavorite = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prevFavorites) =>
      prevFavorites.includes(productId)
        ? prevFavorites.filter((id) => id !== productId)
        : [...prevFavorites, productId]
    );
  };

  return (
    <Layout headerType="header1" footerType="footer1">
      <div className={styles.main}>
        {isMobile && (
          <div id="imageCarousel" className="carousel slide" data-bs-ride="carousel">
            <button
              className={styles.favoriteButton}
              onClick={(e) => toggleFavorite(e, product.id)}
            >
              {favorites.includes(product.id) ? "💖" : "🖤"}
            </button>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={product.mainImage1} alt="Main Image 1" className={styles['carousel-image']} />
              </div>
              <div className="carousel-item">
                <img src={product.mainImage2} alt="Main Image 2" className={styles['carousel-image']} />
              </div>
              {product.thumbnails.map((thumb, index) => (
                <div className="carousel-item" key={index}>
                  <img src={thumb} alt={`Thumbnail ${index + 1}`} className={styles['carousel-image']} />
                </div>
              ))}
            </div>
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#imageCarousel"
                data-bs-slide-to="0"
                className="active"
                aria-current="true"
                aria-label="Slide 1"
                style={{ backgroundColor: '#00AAAD', width: '12px', height: '12px', borderRadius: '50%' }}
              ></button>
              <button
                type="button"
                data-bs-target="#imageCarousel"
                data-bs-slide-to="1"
                aria-label="Slide 2"
                style={{ backgroundColor: '#00AAAD', width: '12px', height: '12px', borderRadius: '50%' }}
              ></button>
              {product.thumbnails.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#imageCarousel"
                  data-bs-slide-to={index + 2}
                  aria-label={`Slide ${index + 3}`}
                  style={{ backgroundColor: '#00AAAD', width: '12px', height: '12px', borderRadius: '50%' }}
                ></button>
              ))}
            </div>
          </div>
        )}
        <div className={styles.productContainer}>
          <div className={styles.imageGallery}>
            <div className={styles.mainImageContainer}>
              <div className={styles.mainImage}>
                <img src={product.mainImage1} alt={product.mainImage1} />
              </div>
              <div className={styles.mainImage}>
                <img src={product.mainImage2} alt={product.mainImage2} />
              </div>
            </div>
            <div className={styles.thumbnails}>
              {product.thumbnails.map((thumb, index) => (
                <div key={index} className={styles.thumbnail}>
                  <img src={thumb} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.productInfo}>
            <h1 className={styles.productName}>
              {product.productName}
              {!isMobile && (
                <button
                  className={styles.favoriteButton2}
                  onClick={(e) => toggleFavorite(e, product.id)}
                >
                  {favorites.includes(product.id) ? "💖" : "🖤"}
                </button>
              )}
            </h1>
            <p className={styles.productDescription}>{product.productDescription}</p>
            <div className={styles.rating}>
              <StarRating rating={Number(product.rating)} />
              <span>({product.reviewCount})</span>
            </div>
            <div>
              {product.discount ? <span className={styles.discountSticker}> - {product.discount} %</span> : null}
            </div>
            <div className={styles.price}>
              <span className={styles.currentPrice}>{product.currentPrice} грн / шт</span>
              {product.oldPrice && (
                <span className={styles.oldPrice}>{product.oldPrice} грн / шт</span>
              )}
            </div>
            <p className={styles.priceDescription}>{product.priceDescription}</p>
            <hr className={styles.customHr} />
            <h3 className={styles.deliveryTitle}>{product.deliveryTitle}</h3>
            <div className={styles.deliveryOptionsContainer}>
              <div
                className={`${styles.deliveryOption} ${selectedOption === "delivery" ? styles.activeOption : ""
                  }`} onClick={() => setSelectedOption("delivery")}>
                <div className={styles.optionTitle}>Доставка</div>
                <span className={styles.optionDot}>{product.deliveryOption.includes("Не в наявності") ? <span><svg width="12" height="12">
                  <circle cx="6" cy="6" r="6" fill="red" />
                </svg></span> : <span><svg width="12" height="12">
                  <circle cx="6" cy="6" r="6" fill="#33FF00" />
                </svg></span>}</span>
                <span>{product.deliveryOption}</span>
              </div>
              <div className={`${styles.storeCount} ${selectedOption === "store" ? styles.activeOption : ""
                }`} onClick={() => setSelectedOption("store")}>
                <div className={styles.storeTitle}>В магазинах</div>
                <span className={styles.optionDot}>{product.storeCount.includes("0") ? <span><svg width="12" height="12">
                  <circle cx="6" cy="6" r="6" fill="red" />
                </svg></span> : <span><svg width="12" height="12">
                  <circle cx="6" cy="6" r="6" fill="#33FF00" />
                </svg></span>}</span>
                <span>В наявності в {product.storeCount} магазинах</span>
              </div>
            </div>
            <span className={styles.actions}>
              <span className={styles.quantityContainer}>
                <button className={styles.quantityButton} onClick={decreaseQuantity}>-</button>
                <input
                  type="text"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className={styles.quantityInput}
                />
                <button className={styles.quantityButton} onClick={increaseQuantity}>+</button>
              </span>
              <button className={styles.addToCartButton} onClick={handleAddToCart}>Додати до кошика</button>
            </span>
            {showPopup && (
              <CartPopup
                cartItems={cartItems}
                selectedOption={selectedOption}
                onClose={handleClosePopup}
                onRemoveItem={handleRemoveItem}
              />
            )}
          </div>
        </div>
        <div className={styles.tabsHeader}>
          <div>
            <button className={styles.tabButton} onClick={() => document.getElementById('description')?.scrollIntoView({ behavior: 'smooth' })}>Опис</button>
            <button className={styles.tabButton} onClick={() => document.getElementById('specifications')?.scrollIntoView({ behavior: 'smooth' })}>Характеристики</button>
            <button className={styles.tabButton} onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}>Відгуки</button>
            <button className={styles.tabButton} onClick={() => document.getElementById('similarProducts')?.scrollIntoView({ behavior: 'smooth' })}>Схожі товари</button>
          </div>
        </div>
        <h2 id="description" className={styles.tabTitle}>Опис</h2>
        {product.descriptionText ? (
          <DescriptionWare product={product} />
        ) : (
          <p>Опис недоступний.</p>
        )}
        <center><h3>Пов'язані статті в блозі</h3></center>
        {product.relatedArticles && product.relatedArticles.length > 0 ? (
          <ArticlesWare product={product} />
        ) : (
          <p>Немає пов'язаних статей.</p>
        )}
        <hr />
        <h2 id="specifications" className={styles.tabTitle}>Характеристики</h2>
        {product.specifications && product.specifications.length > 0 ? (
          <center><SpecificationWare product={product} /></center>
        ) : (
          <p>Характеристики недоступні.</p>
        )}
        <hr />
        <h2 id="reviews" className={styles.tabTitle}>Відгуки</h2>
        {product.lastReviews && product.lastReviews.length > 0 ? (
          <ReviewWare product={product} />
        ) : (
          <p>Немає відгуків.</p>
        )}
        <hr />
        <h2 id="similarProducts" className={styles.tabTitle}>Схожі товари</h2>
        {product.similarProducts && product.similarProducts.length > 0 && product.similarProducts.some(p => Object.keys(p).length > 0) ? (
          <section className={styles.similarProducts}>
            <SimilarWare product={product} />
          </section>
        ) : (
          <p>Немає схожих товарів.</p>
        )}
      </div>
    </Layout>
  );
}