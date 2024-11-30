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
import { getJsonConstructorFile, getWares, useWares, Ware } from '@/pages/api/WareApi';
import { getDecodedToken } from '@/pages/api/TokenApi';
import FavoriteButton from '../tsx/FavoriteButton';
import { Customer, useCustomers, useUpdateCustomer } from '@/pages/api/CustomerApi';
import ProductImageCarousel from '../tsx/ProductImageCarousel';
import useQueryStore from '@/store/query';
import ProductPrice from '../tsx/ProductPrice';
import ProductImageGallery from '../tsx/ProductImageGallery';
import DeliveryOptions from '../tsx/DeliveryOptions';
import QuantitySelector from '../tsx/QuantitySelector';
import axios from 'axios';
import useWarePageMenuShops from '@/store/warePageMenuShops';
import BlockShopsByWare from '@/app/sharedComponents/BlockShopsByWare';
import { useWareItems } from '@/pages/api/WareItemApi';
import useLocalStorageStore from '@/store/localStorage';


interface CartItem {
  productDescription: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  oldPrice: string;
  selectedOption: string;
}


export default function WarePage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const { setRefetchFavoriteWares } = useQueryStore();
  let [customer, setCustomer] = useState<Customer | null>(null);
  const { data: customers = [], isLoading: customerLoading, isSuccess: customerSuccess } = useCustomers({
    SearchParameter: "Query",
    Id: getDecodedToken()?.nameid
  });
  const { mutateAsync: updateCustomer } = useUpdateCustomer();
  // const { data: favoriteWares = [], isLoading: isFavoriteWaresLoading, isSuccess: isFavoriteWaresSuccess } = useWares({
  //   SearchParameter: "GetFavoritesByCustomerId",
  //   CustomerId: getDecodedToken()?.nameid
  // });
  const { data: products = [], isLoading: isProductsLoading, isSuccess: isProductsSuccess } = useWares({
    SearchParameter: "Query",
    Id: id
  });

  const [product, setProduct] = useState<Ware | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState("delivery");
  const [showPopup, setShowPopup] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  // const [activeIndex, setActiveIndex] = useState(0);
  const carouselElement = document.getElementById("imageCarousel");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [wareDetails, setWareDetails] = useState<string | null>(null);
  const [wareProperties, setWareProperties] = useState<any[] | null>(null);
  const { isWarePageMenuShopsOpened, setIsWarePageMenuShopsOpened } = useWarePageMenuShops();
  const { selectedShop } = useLocalStorageStore();

  useEffect(() => {
    // Ініціалізація кошика з localStorage через Zustand
    setCartItems(useLocalStorageStore.getState().cart);
  }, []);


  useEffect(() => {
    if (customerSuccess && customers.length > 0) {
      setCustomer(customers[0]);
    }
  }, [customerSuccess, customers]);

  useEffect(() => {
    const fetchData = async () => {
      if (isProductsSuccess && products.length > 0) {
        setProduct(products[0]);
        if (products[0].structureFilePath && products[0].structureFilePath.length > 0) {
          try {
            // Очікуємо результат виконання `getJsonConstructorFile`
            const structFile = await getJsonConstructorFile(products[0].structureFilePath);
            console.log(structFile);

            // Перевірка та обробка отриманого JSON-файлу
            if (Array.isArray(structFile) && structFile.length > 0) {
              structFile.forEach((element: any) => {
                if (element.type === "details") {
                  setWareDetails(element.value);
                }
                if (element.type === "properties") {
                  setWareProperties(element.value);
                }
              });
            }
          } catch (error) {
            console.error("Error fetching JSON constructor file:", error);
          }
        }
      }
    };

    // Викликаємо асинхронну функцію
    fetchData();
  }, [isProductsSuccess]);


  useEffect(() => {
    if (cartItems.length === 0) {
      setShowPopup(false);
    }
  }, [cartItems]);

  // const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = parseInt(e.target.value, 10);
  //   if (!isNaN(value) && value > 0) {
  //     setQuantity(value);
  //   }
  // };

  // const increaseQuantity = () => {
  //   setQuantity(prevQuantity => prevQuantity + 1);
  // };

  // const decreaseQuantity = () => {
  //   setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  // };

  const handleAddToCart = () => {
    if (!product) return;
    const newItem = {
      productDescription: product.description,
      productName: product.name,
      productImage: product.previewImagePath,
      quantity: quantity,
      price: product.finalPrice,
      oldPrice: product.price.toString(),
      selectedOption: selectedOption,
    };

    // Використовуємо метод addToCart з store для додавання товару
    useLocalStorageStore.getState().addToCart(newItem);
    setShowPopup(true);
  };


  const handleRemoveItem = (index: number) => {
    useLocalStorageStore.getState().removeFromCart(index);
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

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     require('bootstrap/dist/js/bootstrap.bundle.min.js');
  //   }
  // }, []);

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showPopup]);

  // const handleSlide = (index) => {
  //   setActiveIndex(index);
  // };

  // const handleSlideChange = (event) => {
  //   setActiveIndex(event.to);
  // };

  //carouselElement?.addEventListener("slid.bs.carousel", handleSlideChange);

  const toggleFavorite = async (wareId: number) => {
    if (!customer) return;

    // Оновлюємо обрані товари, не скидаючи пагінацію
    const updatedFavorites = customer.favoriteWareIds.includes(wareId)
      ? customer.favoriteWareIds.filter(id => id !== wareId)
      : [...customer.favoriteWareIds, wareId];

    setCustomer({
      ...customer,
      favoriteWareIds: updatedFavorites
    });

    // Відправка запиту на сервер
    await updateCustomer({
      Name: customer.name,
      Surname: customer.surname,
      Email: customer.email,
      Id: getDecodedToken()?.nameid || "",
      PhoneNumber: customer.phoneNumber,
      AvatarPath: customer.avatarPath,
      FavoriteWareIds: updatedFavorites,
      OrderIds: customer.orderIds
    });

    setRefetchFavoriteWares(true);
  };


  return (
    <Layout headerType="header1" footerType="footer1">
      {product != null && <div className={styles.main}>
        {isMobile && (
          <ProductImageCarousel product={product} customer={customer} toggleFavorite={toggleFavorite} />
        )}
        <div className={styles.productContainer}>
          <ProductImageGallery product={product} />
          <div className={styles.productInfo}>
            <h1 className={styles.productName}>
              {product.name}
              {!isMobile && (
                <FavoriteButton
                  className={styles.favoriteButton2}
                  productId={product.id}
                  isFavorite={customer?.favoriteWareIds.includes(product.id) ?? false}
                  toggleFavorite={toggleFavorite}
                />
              )}
            </h1>
            <p className={styles.productDescription}>{product.description}</p>
            <div className={styles.rating}>
              <StarRating rating={Number(product.averageRating)} />
              <span>({product.reviewIds.length})</span>
            </div>
            <ProductPrice finalPrice={product.finalPrice} oldPrice={product.price} discount={product.discount} />
            {/* <p className={styles.priceDescription}>{product.description}</p> */}
            <hr className={styles.customHr} />
            <DeliveryOptions selectedOption={selectedOption} isDeliveryAvailable={product.isDeliveryAvailable} storeCount={product.wareItems.filter(wi => wi.quantity > 0).length} onSelectOption={setSelectedOption} />
            <span className={styles.actions}>
              <QuantitySelector initialQuantity={quantity} onQuantityChange={setQuantity} />
              <button disabled={product.wareItems.every(wi => wi.quantity === 0)}
                style={{
                  cursor: product.wareItems.every(wi => wi.quantity === 0) ? 'not-allowed' : 'pointer',
                  opacity: product.wareItems.every(wi => wi.quantity === 0) ? 0.5 : 1
                }}

                className={styles.addToCartButton} onClick={selectedShop === null ? () => setIsWarePageMenuShopsOpened(true) : handleAddToCart}>
                {product.wareItems.every(wi => wi.quantity === 0) ? "Немає в наявності" : "Додати до кошика"}
              </button>
            </span>
            {isWarePageMenuShopsOpened && <BlockShopsByWare wareId={id} />}
            {showPopup && (
              <CartPopup
                onClose={handleClosePopup}
                selectedOption={selectedOption}
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

        <DescriptionWare article={product.article} description={wareDetails} />

        {/* <h2 id="description" className={styles.tabTitle}>Опис</h2>
        <center><h3>Пов'язані статті в блозі</h3></center>
        {product.relatedArticles && product.relatedArticles.length > 0 ? (
          <ArticlesWare product={product} />
        ) : (
          <p>Немає пов'язаних статей.</p>
        )}
        <hr />*/}
        <h2 id="specifications" className={styles.tabTitle}>Характеристики</h2>
        {wareProperties && wareProperties.length > 0 ? (
          <center><SpecificationWare properties={wareProperties} /></center>
        ) : (
          <p>Характеристики недоступні.</p>
        )}
        <hr />
        {/* <h2 id="reviews" className={styles.tabTitle}>Відгуки</h2>
        {product.lastReviews && product.lastReviews.length > 0 ? (
          <ReviewWare product={product} />
        ) : (
          <p>Немає відгуків.</p>
        )} */}
        <hr />
        {/* <h2 id="similarProducts" className={styles.tabTitle}>Схожі товари</h2>
        {product.similarProducts && product.similarProducts.length > 0 && product.similarProducts.some(p => Object.keys(p).length > 0) ? (
          <section className={styles.similarProducts}>
            <SimilarWare product={product} />
          </section>
        ) : (
          <p>Немає схожих товарів.</p>
        )}
      </div> */}
      </div>}
    </Layout>
  );
}