"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCreateOrderByTransaction } from "@/pages/api/OrderApi";
import useLocalStorageStore from "@/store/localStorage";
import { toast } from "react-toastify";
import { getDecodedToken, isUser, validateToken } from "@/pages/api/TokenApi";

const TransactionPage = () => {
	const router = useRouter();
	const {
		getCartFromLocalStorage,
		formData,
		addressInfo,
		deliveryInfo,
		paymentStatus,
		selectedShop,
	} = useLocalStorageStore();

	const { mutateAsync: TryToCreateOrderByTransaction } = useCreateOrderByTransaction();
	const isOrderCreated = useRef(false); // Флаг для уникнення дублювання

	useEffect(() => {
		const createOrder = async () => {
			if (isOrderCreated.current) return; // Якщо замовлення вже створено, виходимо
			isOrderCreated.current = true; // Встановлюємо флаг

			try {
				if (paymentStatus !== "success") {
					router.push("/cart/payment");
					return;
				}
				if (!deliveryInfo) {
					router.push("/cart/delivery");
					return;
				}
				if (!addressInfo) {
					router.push("/cart/address");
					return;
				}

				const validRegisteredCustomerId =
					validateToken().status === 200 && isUser() ? getDecodedToken()?.nameid : null;

				const creationOrderDTO = {
					RegisteredCustomerId: validRegisteredCustomerId ?? null,
					GuestCustomer: !validRegisteredCustomerId
						? {
							Name: formData?.firstName!,
							Email: formData?.email!,
							Surname: formData?.lastName!,
							PhoneNumber: formData?.phone ? formData.phone.replace(/[^\d+]/g, "") : "",
						}
						: null,
					Address: {
						City: addressInfo.City,
						Street: addressInfo.Street,
						HouseNumber: addressInfo.HouseNumber,
					},
					OrderData: {
						Phone: formData?.phone ? formData.phone.replace(/[^\d+]/g, "") : "",
						Comment: null,
						ShopId: selectedShop?.id ?? 0,
						DeliveryTypeId: deliveryInfo.selectedDeliveryType?.id ?? 0,
					},
					OrderItems: getCartFromLocalStorage().map((cartItem) => ({
						WareId: cartItem.product.id,
						Count: cartItem.quantity,
						PriceHistoryId: cartItem.product.priceHistoryIds.findLast((x) => x)!,
						OrderId: 0,
					})),
				};

				console.log("creationOrderDTO:", creationOrderDTO);

				const createdOrder = await TryToCreateOrderByTransaction(creationOrderDTO);

				const estimatedDeliveryDate = new Date();
				estimatedDeliveryDate.setDate(
					estimatedDeliveryDate.getDate() +
					(deliveryInfo.selectedDeliveryType?.maxDeliveryTimeInDays ?? 0)
				);
				const formattedDate = estimatedDeliveryDate.toLocaleDateString("uk-UA");

				router.push(
					`/cart/success?order=${encodeURIComponent(
						JSON.stringify(createdOrder)
					)}&deliveryDate=${encodeURIComponent(formattedDate)}`
				);

				toast.success(`Замовлення успішно створено!`);
			} catch (error) {
				console.error("Error creating order:", error);
				toast.error(`Помилка при створенні замовлення: ${error.message}`);
			}
		};

		createOrder();
	}, [router, TryToCreateOrderByTransaction, paymentStatus, deliveryInfo, addressInfo, formData, selectedShop]);

	return <div>Обробка замовлення...</div>;
};

export default TransactionPage;
