"use client";
import { Customer, useCustomers, useUpdateCustomer } from '@/pages/api/CustomerApi';
import { getDecodedToken } from '@/pages/api/TokenApi';
import { getJsonConstructorFile, useWares, Ware } from '@/pages/api/WareApi';
import useQueryStore from '@/store/query';
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import {
  addToCart,
  getCartFromLocalStorage,
  removeFromCart
} from '../../cart/types/Cart';
import FavoriteButton from '../../sharedComponents/FavoriteButton';
import Layout from "../../sharedComponents/Layout";
import StarRating from "../../sharedComponents/StarRating";
import styles from "../page.module.css";
import ArticlesWare from '../tsx/ArticlesWare';
import CartPopup from '../tsx/CartPopup';
import DeliveryOptions from '../tsx/DeliveryOptions';
import DescriptionWare from '../tsx/DescriptionWare';
import ProductImageCarousel from '../tsx/ProductImageCarousel';
import ProductImageGallery from '../tsx/ProductImageGallery';
import ProductPrice from '../tsx/ProductPrice';
import QuantitySelector from '../tsx/QuantitySelector';
import ReviewWare from '../tsx/ReviewWare';
import SpecificationWare from '../tsx/SpecificationWare';
import BlockShopsByWare from '@/app/sharedComponents/BlockShopsByWare';
import WareCarousel from '@/app/sharedComponents/WareCarousel';
import { useBlogs } from '@/pages/api/BlogApi';
import { useWareReviews } from '@/pages/api/WareReviewApi';
import useLocalStorageStore from '@/store/localStorage';
import useWarePageMenuShops from '@/store/warePageMenuShops';
import Head from 'next/head';  // Імпортуємо компонент Head
import RecentWares from '@/app/sharedComponents/RecentWares';


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
  const { data: customers = [], isSuccess: customerSuccess } = useCustomers({
    SearchParameter: "Query",
    Id: getDecodedToken()?.nameid
  });
  const { mutateAsync: updateCustomer } = useUpdateCustomer();
  const [product, setProduct] = useState<Ware | null>(null);
  const [filteredWares, setFilteredWares] = useState<Ware[]>([]);
  const { data: products = [], isSuccess: isProductsSuccess } = useWares({
    SearchParameter: "Query",
    Id: id
  });
  const {
    data: relatedBlogs = [],
    refetch: refetchRelatedBlogs
  } = useBlogs({
    SearchParameter: "Query",
    QueryAny: product !== null ? product?.wareCategory1Name : "",
    PageNumber: 1,
    PageSize: 3,
    Sorting: "IdDesc",
  });
  // const {
  //   data: relatedReviews = [],
  //   refetch: refetchRelatedReviews
  // } = useWareReviews({
  //   SearchParameter: "WareId",
  //   WareId: product !== null ? product?.id : 0,
  //   Sorting: "IdDesc",
  // }, product !== null);
  const {
    data: similarWares = [],
    refetch: refetchSimilarWares,
    isLoading: isSimilarWaresLoading
  } = useWares({
    SearchParameter: "StringCategory2Ids",
    StringCategory2Ids: product !== null ? product?.wareCategory2Id.toString() : "",
  });

  useEffect(() => {
    if (!isSimilarWaresLoading && similarWares.length > 0 && product !== null) {
      // Фільтруємо дані, наприклад, щоб виключити товар з тим самим ID
      const updatedWares = similarWares.filter(ware => ware.id !== product?.id);
      setFilteredWares(updatedWares);
    }
  }, [similarWares, isSimilarWaresLoading, product]);


  console.log("relatedBlogs", relatedBlogs);
  console.log("similarWares", similarWares);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState("delivery");
  const [showPopup, setShowPopup] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [wareDetails, setWareDetails] = useState<string | null>(null);
  const [wareProperties, setWareProperties] = useState<any[] | null>(null);
  const { isWarePageMenuShopsOpened, setIsWarePageMenuShopsOpened } = useWarePageMenuShops();
  const { selectedShop, addRecentWareId } = useLocalStorageStore();

  useEffect(() => {
    // Ініціалізація кошика з localStorage через Zustand
    setCartItems(useLocalStorageStore.getState().cart);
  }, []);


  useEffect(() => {
    if (product !== null) {
      refetchRelatedBlogs(); // Оновлюємо список пов'язаних статей
      refetchSimilarWares(); // Оновлюємо список схожих товарів
      addRecentWareId(product.id); // Додаємо товар до нещодавно переглянутих
    }
  }, [product, refetchRelatedBlogs, refetchSimilarWares]);

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

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 50; // Наприклад, 50px відступу
      const elementPosition = element.getBoundingClientRect().top; // Позиція елемента відносно вікна
      const offsetPosition = elementPosition + window.pageYOffset - offset; // Фінальна позиція з урахуванням відступу

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth", // Гладка прокрутка
      });
    }
  };


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

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showPopup]);

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
      <Head>
        <title>{product?.name || "Відомості про товар"}</title>
        <meta name="description" content={product?.description || "Все для дому"} />
      </Head>

      {product != null && <div className={styles.main}>
        {isMobile && (
          <ProductImageCarousel product={product} />
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
                  width='24px'
                  height='24px'
                />
              )}
            </h1>
            <p className={styles.productDescription}>{product.description}</p>
            {Number(product.averageRating) > 0 && <div className={styles.rating}>
              <StarRating rating={Number(product.averageRating)} />
              <span>({product.reviewIds.length})</span>
            </div>}
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
            <button className={styles.tabButton} onClick={() => scrollToSection('description')}>Опис</button>
            <button className={styles.tabButton} onClick={() => scrollToSection('specifications')}>Характеристики</button>
            <button className={styles.tabButton} onClick={() => scrollToSection('reviews')}>Відгуки</button>
            <button className={styles.tabButton} onClick={() => scrollToSection('similarProducts')}>Схожі товари</button>
          </div>
        </div>
        <hr id="descriptionBefore" style={{ display: "none" }} />
        <h2 id="description" className={styles.tabTitle}>Опис</h2>
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, margin: "0 3.5rem" }}>
            <DescriptionWare article={product.article} description={wareDetails} product={product} />
            {product && relatedBlogs && relatedBlogs.length > 0 ? (
              <ArticlesWare blogs={relatedBlogs} />
            ) : (
              <p>Немає пов&apos;язаних статей.</p>
            )}
          </div>

        </div>
        <hr id="specificationsBefore" />
        <h2 id="specifications" className={styles.tabTitle}>Характеристики</h2>
        {wareProperties && wareProperties.length > 0 ? (
          <center><SpecificationWare properties={wareProperties} /></center>
        ) : (
          <p>Характеристики недоступні.</p>
        )}
        <hr id="reviewsBefore" />
        <h2 id="reviews" className={styles.tabTitle}>Відгуки</h2>
        {product.reviewIds && product.reviewIds.length > 0 ? (
          <ReviewWare product={product} />
        ) : (
          <p>Немає відгуків.</p>
        )}
        <hr />
        <h2 id="similarProductsBefore" className={styles.tabTitle}>Схожі товари</h2>
        {(similarWares && similarWares.length > 0) ? (
          <section id="similarProducts" className={styles.similarProducts}>
            <WareCarousel wares={filteredWares} />
          </section>
        ) : (
          <p>Немає схожих товарів.</p>
        )}
        <RecentWares />
      </div>
      }
    </Layout>
  );
}