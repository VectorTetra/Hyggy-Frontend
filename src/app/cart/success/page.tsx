"use client";
import { useState, useEffect } from "react";
import Layout from "../../sharedComponents/Layout";
import styles from "./page.module.css";
import useLocalStorageStore, { CartItem } from "@/store/localStorage";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AddressDTO, useAddresses, useCreateAddress } from "@/pages/api/AddressApi";
import { OrderGetDTO, useCreateOrder, useOrders } from "@/pages/api/OrderApi";
import { useOrderStatuses } from "@/pages/api/OrderStatusApi";
import { useCreateOrFindGuestCustomer } from "@/pages/api/CustomerApi";
import { getDecodedToken, isUser, validateToken } from "@/pages/api/TokenApi";
import { toast } from "react-toastify";
import { useCreateOrderItem } from "@/pages/api/OrderItemApi";
import { set } from "lodash";
import { OrderDeliveryTypeGetDTO } from "@/pages/api/OrderDeliveryTypeApi";

const SuccessPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [createdOrderId, setCreatedOrderId] = useState(0);
  const [orderCreationProcessComplete, setOrderCreationProcessComplete] = useState(false);
  const { getCartFromLocalStorage, clearCart, formData, addressInfo, deliveryInfo, paymentStatus, setPaymentStatus, setDeliveryInfo, setAddressInfo, selectedShop } = useLocalStorageStore();

  let selectedDeliveryType: OrderDeliveryTypeGetDTO | null = null;
  let selectedStore: any = null;


  const { data: orderStatuses = [], isSuccess: isOrderStatusesSuccess } = useOrderStatuses({
    SearchParameter: "Query",
    PageNumber: 1,
    PageSize: 1000
  });
  const { data: successfullOrders = [], } = useOrders<OrderGetDTO[]>({
    SearchParameter: 'Query',
    Id: createdOrderId,
  }, createdOrderId !== 0 && orderCreationProcessComplete);

  const successfullOrder = successfullOrders?.[0] || null; // Дістаємо перший елемент або null
  const { mutateAsync: TryToCreateAddress } = useCreateAddress();
  const { mutateAsync: TryToCreateOrder } = useCreateOrder();
  const { mutateAsync: TryToCreateOrderItem } = useCreateOrderItem();
  const { mutateAsync: TryToCreateGuestCustomer } = useCreateOrFindGuestCustomer();

  let AddressDTOtoPost = new AddressDTO();

  useEffect(() => {

  }, [router]);
  useEffect(() => {
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
          selectedDeliveryType = deliveryInfo.selectedDeliveryType;
          selectedStore = deliveryInfo.selectedStore;
          const orderDate = new Date();
          const estimatedDeliveryDate = new Date(orderDate);
          estimatedDeliveryDate.setDate(
            orderDate.getDate() + (selectedDeliveryType?.maxDeliveryTimeInDays ?? 0)
          );
          const formattedDate = estimatedDeliveryDate.toLocaleDateString('uk-UA');

          if (selectedDeliveryType?.id === 1) {
            setAddress(
              `${selectedStore.street}, ${selectedStore.houseNumber}, ${selectedStore.city}, ${selectedStore.postalCode}`
            );
            Object.assign(AddressDTOtoPost, {
              Id: selectedStore.addressId,
              City: selectedStore.city,
              Street: selectedStore.street,
              HouseNumber: selectedStore.houseNumber,
              PostalCode: selectedStore.postalCode,
              Latitude: selectedStore.latitude,
              Longitude: selectedStore.longitude,
            });
          } else if (selectedDeliveryType?.id === 3) {
            const [city, street, houseNumber] = selectedStore.address.split(',').map((s) => s.trim());
            setAddress(`${selectedStore.address}, ${selectedStore.postalCode}`);
            Object.assign(AddressDTOtoPost, {
              City: city,
              Street: street,
              HouseNumber: houseNumber,
              PostalCode: selectedStore.postalCode,
              Latitude: selectedStore.latitude,
              Longitude: selectedStore.longitude,
            });
          } else if (selectedDeliveryType?.id === 2) {
            setAddress(
              `${addressInfo.City}, ${addressInfo.Street}, ${addressInfo.HouseNumber}`
            );
            Object.assign(AddressDTOtoPost, {
              City: addressInfo.City,
              Street: addressInfo.Street,
              HouseNumber: addressInfo.HouseNumber,
            });
          } else if (selectedDeliveryType?.id === 4) {
            const [street, houseNumber] = selectedStore.address.split(',').map((s) => s.trim());
            setAddress(`${selectedStore.address}, ${selectedStore.postalCode}`);
            Object.assign(AddressDTOtoPost, {
              City: selectedStore.city,
              Street: street,
              HouseNumber: houseNumber,
              PostalCode: selectedStore.postalCode,
              Latitude: selectedStore.latitude,
              Longitude: selectedStore.longitude,
            });
          }

          setDeliveryDate(formattedDate);
          setDeliveryCost(selectedDeliveryType?.price ?? 0);
        }

        const validRegisteredCustomerId =
          validateToken().status === 200 && isUser() ? getDecodedToken()?.nameid : null;

        const CustomerId =
          validRegisteredCustomerId ??
          (
            await TryToCreateGuestCustomer({
              Name: formData?.firstName!,
              Email: formData?.email!,
              Surname: formData?.lastName!,
              PhoneNumber: formData?.phone ? formData.phone.replace(/[^\d+]/g, '') : '',
            })
          ).id;

        const createdAddress = await TryToCreateAddress(AddressDTOtoPost);
        const createdOrder = await TryToCreateOrder({
          StatusId: selectedDeliveryType?.id === 1 ? 9 : 1,
          ShopId: selectedShop?.id ?? 0,
          CustomerId: CustomerId,
          Comment: null,
          OrderDate: new Date(),
          Phone: formData?.phone ? formData.phone.replace(/[^\d+]/g, '') : '',
          DeliveryAddressId: createdAddress.id,
          DeliveryTypeId: selectedDeliveryType?.id ?? 0,
        });
        setCreatedOrderId(createdOrder.id);

        const cartItems = getCartFromLocalStorage();
        setCartItems(cartItems);
        for (const cartItem of cartItems) {
          await TryToCreateOrderItem({
            OrderId: createdOrder.id,
            WareId: cartItem.product.id,
            Count: cartItem.quantity,
            PriceHistoryId: cartItem.product.priceHistoryIds.findLast((x) => x)!,
          });
        }

        clearCart();
        setPaymentStatus(null);
        setDeliveryInfo(null);
        setAddressInfo(null);
        setOrderCreationProcessComplete(true);
        toast.success(`Замовлення успішно створено!`);
      } catch (error) {
        console.error('Error during order creation:', error);
        toast.error(`Помилка при створенні замовлення! ${error.message}`);
      }
    };

    if (!orderCreationProcessComplete && isOrderStatusesSuccess) {
      handleOrderCreate();

    }
  }, [router, isOrderStatusesSuccess, paymentStatus, deliveryInfo, addressInfo]);

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
          <h6>Доставка за адресою:</h6>
          {Object.entries(successfullOrder.deliveryAddress).map(([key, value], index) => (
            <span key={index}>{value !== null && value.toString()} {index < Object.entries(successfullOrder.deliveryAddress).length}</span>
          ))}
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