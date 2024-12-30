"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { formatCurrency } from "@/app/sharedComponents/methods/formatCurrency";
import Layout from "../../sharedComponents/Layout";
import Link from "next/link";
import { OrderGetDTO } from "@/pages/api/OrderApi";
import useLocalStorageStore from "@/store/localStorage";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    clearCart,
    setDeliveryInfo,
    setPaymentStatus,
    setAddressInfo
  } = useLocalStorageStore();
  const [successfullOrder, setSuccessfullOrder] = useState<OrderGetDTO | null>(null);
  const [deliveryDate, setDeliveryDate] = useState("");

  useEffect(() => {
    const orderParam = searchParams ? searchParams.get("order") : null;
    const deliveryDateParam = searchParams ? searchParams.get("deliveryDate") : null;

    if (orderParam) {
      setSuccessfullOrder(JSON.parse(decodeURIComponent(orderParam)));
    }

    if (deliveryDateParam) {
      setDeliveryDate(decodeURIComponent(deliveryDateParam));
    }
  }, [searchParams]);

  useEffect(() => {
    if (successfullOrder) {
      clearCart();
      setPaymentStatus(null);
      setDeliveryInfo(null);
      setAddressInfo(null);
    }
  }, [successfullOrder]);

  if (!successfullOrder) {
    return <div>Завантаження...</div>;
  }

  return (
    <Layout headerType="header1" footerType="footer1">
      <div className={styles.Page}>
        <h2>Оплата успішна</h2>
      </div>
      <center><h3><b>Замовлення № {successfullOrder.id}:</b></h3></center>
      <center>
        <h6>Вибраний тип доставки : {successfullOrder.deliveryType.description}</h6>
        <h6>Вартість доставки : {formatCurrency(successfullOrder.deliveryType.price, "грн")}</h6>
      </center>
      <center>
        <center>
          <h6>Доставка за адресою:&nbsp;
            {Object.entries(successfullOrder.deliveryAddress)
              .filter(([key]) => !["id", "latitude", "longitude", "shopId", "storageId", "orderIds"].includes(key))
              .sort(([key1], [key2]) => key1.length < key2.length ? -1 : 1)
              .map(([key, value], index, array) => (
                <span key={index}>{value !== null && key !== "id" && `${(value ?? '').toString()}${index + 1 < array.length ? "," : ''}`} {index < Object.entries(successfullOrder.deliveryAddress).length}</span>
              ))}
          </h6>
        </center>
        <h6> Очікувана дата доставки: до {deliveryDate}</h6>
      </center>

      <div className={styles.checkoutPage}>
        <div className={styles.cartSummary}>
          {successfullOrder.orderItems.length > 0 && (
            <div>
              {successfullOrder.orderItems.map((item, index) => (
                <div key={index} className={styles.cartItem}>
                  <div className={styles.cartItemImageContainer}>
                    <img
                      src={item.ware.previewImagePath}
                      alt={item.ware.description}
                      className={styles.cartItemImage}
                    />
                  </div>
                  <div className={styles.cartItemDetails}>
                    <p>{item.ware.description}</p>
                    <div className={styles.info}>
                      <p>{item.ware.name}</p>
                      <p>Кількість: {item.count} шт</p>
                    </div>
                  </div>
                  <div className={styles.price}>
                    <p>{formatCurrency(item.ware.finalPrice, "грн / шт")}</p>
                    <p>{formatCurrency(item.ware.finalPrice * item.count, "грн")}</p>
                  </div>
                </div>
              ))}
              <p className={styles.totalPrice}>
                Всього {formatCurrency(successfullOrder.totalPrice, "грн")}
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
