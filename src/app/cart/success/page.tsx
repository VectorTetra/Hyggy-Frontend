"use client";
import { useState, useEffect } from "react";
import Layout from "../../sharedComponents/Layout";
import styles from "./page.module.css";
import useLocalStorageStore from "@/store/localStorage";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CartItem {
  productDescription: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  oldPrice: string;
  selectedOption: string;
}

const SuccessPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryCost, setDeliveryCost] = useState(0);
  const router = useRouter();
  const { getCartFromLocalStorage, clearCart, addressInfo, deliveryInfo, paymentStatus, setPaymentStatus, setDeliveryInfo, setAddressInfo } = useLocalStorageStore();

  useEffect(() => {
    if (paymentStatus !== 'success') {
      router.push('/cart/payment');
      return;
    }

    const savedCartItems = getCartFromLocalStorage();
    setCartItems(savedCartItems);

    if (deliveryInfo && addressInfo) {
      const { selectedDeliveryType, selectedStore, deliveryCost, deliveryDays } = deliveryInfo;

      const orderDate = new Date();
      const estimatedDeliveryDate = new Date(orderDate);
      estimatedDeliveryDate.setDate(orderDate.getDate() + deliveryDays);
      const formattedDate = estimatedDeliveryDate.toLocaleDateString('uk-UA');

      if (selectedDeliveryType === 'store') {
        setAddress(`${selectedStore.street}, ${selectedStore.houseNumber}, ${selectedStore.city}, ${selectedStore.postalCode}`)
      } else if (selectedDeliveryType === 'novaPoshta') {
        setAddress(`${selectedStore.address}, ${selectedStore.postalCode}`)
      } else if (selectedDeliveryType === 'courier') {
        setAddress(`${addressInfo.city}, ${addressInfo.street}, ${addressInfo.houseNumber}`);
      } else if (selectedDeliveryType === 'ukrPoshta') {
        setAddress(`${selectedStore.address}, ${selectedStore.postalCode}`)
      }
      setDeliveryDate(formattedDate);
      setDeliveryCost(deliveryCost);
    }

    setTimeout(() => {
      clearCart();
      setPaymentStatus(null);
      setDeliveryInfo(null);
      setAddressInfo(null);
    }, 1000);
  }, [router]);


  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  return (
    <Layout headerType="header1" footerType="footer1">
      <div className={styles.Page}>
        <h2>Оплата успішна</h2>
      </div>
      <center><h3><b>Замовлення №123456:</b></h3></center>
      <center>
        <h6>Доставка за адресою {address} до {deliveryDate}</h6>
      </center>

      <div className={styles.checkoutPage}>
        <div className={styles.cartSummary}>
          {cartItems.length > 0 && (
            <div>
              {cartItems.map((item, index) => (
                <div key={index} className={styles.cartItem}>
                  <div className={styles.cartItemImageContainer}>
                    <img
                      src={item.productImage}
                      alt={item.productDescription}
                      className={styles.cartItemImage}
                    />
                  </div>
                  <div className={styles.cartItemDetails}>
                    <p>{item.productDescription}</p>
                    <div className={styles.info}>
                      <p>{item.productName}</p>
                      <p>Кількість: {item.quantity} шт</p>
                    </div>
                  </div>
                  <div className={styles.price}>
                    <p>{Math.ceil(item.price)} грн</p>
                    <p>{(Math.ceil(item.price) * item.quantity)} грн</p>
                  </div>
                </div>
              ))}
              <p className={styles.totalPrice}>
                Усього {Math.ceil(calculateTotalPrice() + deliveryCost)} грн
              </p>
            </div>
          )}
          <Link prefetch={true} href="/">
            <button type="button" className={styles.cancelButton}>
              Повернутись на головну
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default SuccessPage;