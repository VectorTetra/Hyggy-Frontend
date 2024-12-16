"use client";
import { AddressDTO } from "@/pages/api/AddressApi";
import { OrderGetDTO, useCreateOrderByTransaction } from "@/pages/api/OrderApi";
import { OrderDeliveryTypeGetDTO } from "@/pages/api/OrderDeliveryTypeApi";
import { getDecodedToken, isUser, validateToken } from "@/pages/api/TokenApi";
import useLocalStorageStore, { CartItem } from "@/store/localStorage";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../sharedComponents/Layout";
import styles from "./page.module.css";

const SuccessPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [createdOrderId, setCreatedOrderId] = useState(0);
  const [orderCreationProcessComplete, setOrderCreationProcessComplete] = useState(false);
  const { getCartFromLocalStorage, clearCart, formData, addressInfo, deliveryInfo, paymentStatus, setPaymentStatus, setDeliveryInfo, setAddressInfo, selectedShop } = useLocalStorageStore();

  let selectedDeliveryType: OrderDeliveryTypeGetDTO | null = null;
  let selectedStore: any = null;
  const [successfullOrder, setSuccessfullOrder] = useState<OrderGetDTO | null>(null);
  const { mutateAsync: TryToCreateOrderByTransaction } = useCreateOrderByTransaction();

  let AddressDTOtoPost = new AddressDTO();

  useEffect(() => {

  }, [router]);
  useEffect(() => {
    if (!successfullOrder) {
      const handleOrderCreate = async () => {
        try {
          if (paymentStatus !== 'success') {
            router.push('/cart/payment');
            return;
          }
          if (!deliveryInfo) {
            router.push('/cart/delivery');
            return;
          }
          if (!addressInfo) {
            router.push('/cart/address');
            return;
          }

          if (deliveryInfo && addressInfo) {
            const orderDate = new Date();
            const estimatedDeliveryDate = new Date(orderDate);
            estimatedDeliveryDate.setDate(
              orderDate.getDate() + (selectedDeliveryType?.maxDeliveryTimeInDays ?? 0)
            );
            const formattedDate = estimatedDeliveryDate.toLocaleDateString('uk-UA');

            setDeliveryDate(formattedDate);
            selectedDeliveryType = deliveryInfo.selectedDeliveryType;
            selectedStore = deliveryInfo.selectedStore;
            const validRegisteredCustomerId = validateToken().status === 200 && isUser() ? getDecodedToken()?.nameid : null;
            switch (selectedDeliveryType?.id) {
              case 1:
                Object.assign(AddressDTOtoPost, {
                  Id: selectedStore.addressId,
                  City: selectedStore.city,
                  Street: selectedStore.street,
                  HouseNumber: selectedStore.houseNumber,
                  PostalCode: selectedStore.postalCode,
                  Latitude: selectedStore.latitude,
                  Longitude: selectedStore.longitude,
                });
                break;
              case 3:
                const [city3, street3, houseNumber3] = selectedStore.address.split(',').map((s) => s.trim());
                Object.assign(AddressDTOtoPost, {
                  City: city3,
                  Street: street3,
                  HouseNumber: houseNumber3,
                  PostalCode: selectedStore.postalCode,
                  Latitude: selectedStore.latitude,
                  Longitude: selectedStore.longitude,
                });
                break;
              case 2:
                Object.assign(AddressDTOtoPost, {
                  City: addressInfo.City,
                  Street: addressInfo.Street,
                  HouseNumber: addressInfo.HouseNumber,
                });
                break;
              case 4:
                const [street4, houseNumber4] = selectedStore.address.split(',').map((s) => s.trim());
                Object.assign(AddressDTOtoPost, {
                  City: selectedStore.city,
                  Street: street4,
                  HouseNumber: houseNumber4,
                  PostalCode: selectedStore.postalCode,
                  Latitude: selectedStore.latitude,
                  Longitude: selectedStore.longitude,
                });
                break;
            }

            const creationOrderDTO = {
              RegisteredCustomerId: validRegisteredCustomerId ?? null,
              GuestCustomer: !validRegisteredCustomerId ?
                {
                  Name: formData?.firstName!,
                  Email: formData?.email!,
                  Surname: formData?.lastName!,
                  PhoneNumber: formData?.phone ? formData.phone.replace(/[^\d+]/g, '') : '',
                } : null,
              Address: {
                City: addressInfo.City,
                Street: addressInfo.Street,
                HouseNumber: addressInfo.HouseNumber,
              },
              OrderData: {
                Phone: formData?.phone ? formData.phone.replace(/[^\d+]/g, '') : '',
                Comment: null,
                ShopId: selectedShop?.id ?? 0,
                DeliveryTypeId: selectedDeliveryType?.id ?? 0,
              },
              OrderItems: getCartFromLocalStorage().map((cartItem) => ({
                WareId: cartItem.product.id,
                Count: cartItem.quantity,
                PriceHistoryId: cartItem.product.priceHistoryIds.findLast((x) => x)!,
                OrderId: 0
              }))
            }

            console.log('creationOrderDTO:', creationOrderDTO);
            const createdOrder = await TryToCreateOrderByTransaction(creationOrderDTO);

            setSuccessfullOrder(createdOrder);
            clearCart();
            setPaymentStatus(null);
            setDeliveryInfo(null);
            setAddressInfo(null);
            setOrderCreationProcessComplete(true);
            toast.success(`Замовлення успішно створено!`);
          }


        } catch (error) {
          console.error('Error during order creation:', error);
          toast.error(`Помилка при створенні замовлення! ${error.message}`);
        }
      };

      handleOrderCreate();
    }
  }, [router, paymentStatus, deliveryInfo, addressInfo, successfullOrder]);

  if (!orderCreationProcessComplete || !successfullOrder) {
    return <Layout headerType="header1" footerType="footer1">
      <div>Обробка замовлення...</div>;
    </Layout>
  }

  return (
    <Layout headerType="header1" footerType="footer1">
      <div className={styles.Page}>
        <h2>Оплата успішна</h2>
      </div>
      <center><h3><b>Замовлення № {successfullOrder.id}:</b></h3></center>
      <center>
        <h6>Вибраний тип доставки : {successfullOrder.deliveryType.description}</h6>
        <h6>Вартість доставки : {successfullOrder.deliveryType.price} грн</h6>
      </center>
      <center>
        <center>
          <h6>Доставка за адресою:&nbsp;
            {Object.entries(successfullOrder.deliveryAddress)
              .filter(([key]) => !["id", "latitude", "longitude", "shopId", "storageId", "orderIds"].includes(key))
              .sort(([key1], [key2]) => key1.length < key2.length ? -1 : 1)
              .map(([key, value], index, array) => (
                <span key={index}>{value !== null && key !== "id" && `${value.toString()}${index + 1 < array.length ? "," : ''}`} {index < Object.entries(successfullOrder.deliveryAddress).length}</span>
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
                    <p>{Math.ceil(item.ware.finalPrice)} грн</p>
                    <p>{(Math.ceil(item.ware.finalPrice) * item.count)} грн</p>
                  </div>
                </div>
              ))}
              <p className={styles.totalPrice}>
                Усього {successfullOrder.totalPrice} грн
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