"use client";
import { useParams, notFound } from 'next/navigation';
import Image from "next/image";
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
} from '../types/Cart';

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
  const { id } = useParams();
  const product = jsonData.find((item) => item.id === Number(id));

  if (!product) {
    return notFound();
  }

  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState("delivery");
  const [showPopup, setShowPopup] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);

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
      setIsMobile(window.innerWidth <= 991);
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

  return (
    <Layout headerType="header1" footerType="footer1">
      <div className={styles.main}>
          {isMobile && (
            <div id="imageCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <Image
                    src={product.mainImage1}
                    alt={product.productName}
                    layout="responsive"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="carousel-item">
                  <Image
                    src={product.mainImage2}
                    alt={product.productName}
                    layout="responsive"
                    width={100}
                    height={100}
                  />
                </div>
                {product.thumbnails.map((thumb, index) => (
                  <div className="carousel-item" key={index}>
                    <Image
                      src={thumb}
                      alt={`Thumbnail ${index + 1}`}
                      layout="responsive"
                      width={100}
                      height={100}
                    />
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          )}

        <div className={styles.productContainer}>
          <div className={styles.imageGallery}>
            <div className={styles.mainImageContainer}>
              <div className={styles.mainImage}>
                <Image src={product.mainImage1} alt={product.productName} layout="fill" />
              </div>
              <div className={styles.mainImage}>
                <Image src={product.mainImage2} alt={product.productName} layout="fill" />
              </div>
            </div>
              <div className={styles.thumbnails}>
                {product.thumbnails.map((thumb, index) => (
                  <div key={index} className={styles.thumbnail}>
                    <Image src={thumb} alt={`Thumbnail ${index + 1}`} layout="fill" objectFit="cover" />
                  </div>
                ))}
            </div>
          </div>
          <div className={styles.productInfo}>
            <h1 className={styles.productName}>{product.productName}</h1>
            <p className={styles.productDescription}>{product.productDescription}</p>
            <div className={styles.rating}>
              <StarRating rating={Number(product.rating)} />
              <span>({product.reviewCount})</span>
            </div>
            <div className={styles.price}>
              <span className={styles.currentPrice}>{product.currentPrice} грн / шт</span>
              {product.oldPrice && (
                <span className={styles.oldPrice}>{product.oldPrice} грн / шт</span>
              )}
            </div>
            <p className={styles.priceDescription}>{product.priceDescription}</p>
            <hr className={styles.customHr}/>
            <h3 className={styles.deliveryTitle}>{product.deliveryTitle}</h3>
            <div className={styles.deliveryOptionsContainer}>
              <div
                className={`${styles.deliveryOption} ${
                  selectedOption === "delivery" ? styles.activeOption : ""
                }`}
                onClick={() => setSelectedOption("delivery")}>
                <div className={styles.optionTitle}>Доставка</div>
                    <span className={styles.optionDot}>{product.deliveryOption.includes("Не в наявності") ? <span><svg width="12" height="12">
                      <circle cx="6" cy="6" r="6" fill="red" />
                    </svg></span> : <span><svg width="12" height="12">
                      <circle cx="6" cy="6" r="6" fill="#33FF00" />
                    </svg></span>}</span>
                <span>{product.deliveryOption}</span>
              </div>
              <div className={`${styles.storeCount} ${
                  selectedOption === "store" ? styles.activeOption : ""
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
          <h3>Пов'язані статті в блозі</h3>
          {product.relatedArticles && product.relatedArticles.length > 0 ? ( 
            <ArticlesWare product={product} />
          ) : (
            <p>Немає пов'язаних статей.</p>
          )}
          <hr/>
          <h2 id="specifications" className={styles.tabTitle}>Характеристики</h2>
          {product.specifications && product.specifications.length > 0 ? (
            <center><SpecificationWare product={product} /></center>
          ) : (
            <p>Характеристики недоступні.</p>
          )}
          <hr/>
          <h2 id="reviews" className={styles.tabTitle}>Відгуки</h2>
          {product.lastReviews && product.lastReviews.length > 0 ? ( 
            <ReviewWare product={product} />
          ) : (
            <p>Немає відгуків.</p>
          )}
          <hr/>
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