import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AddressDTO } from './AddressApi';
import { ShopGetDTO } from './ShopApi';
import { Customer, GuestCustomerPostDTO } from './CustomerApi';
import { OrderItemGetDTO, OrderItemPostDTO } from './OrderItemApi';
import { OrderStatusGetDTO } from './OrderStatusApi';
import { OrderDeliveryTypeGetDTO } from './OrderDeliveryTypeApi';

export class OrderQueryParams {

	SearchParameter?: string; // Вибраний критерій пошуку
	Id?: number;
	AddressId?: number;
	// Адреса доставки, розділена на компоненти
	Street?: string;
	HouseNumber?: string;
	City?: string;
	State?: string;
	PostalCode?: string;
	PageNumber?: number;
	PageSize?: number;
	// Географічні координати
	Latitude?: number;
	Longitude?: number;
	// Дані про клієнта
	MinOrderDate?: Date;
	MaxOrderDate?: Date;
	Phone?: string;
	Comment?: string;
	StatusId?: number;
	StatusName?: string;
	StatusDescription?: string;
	DeliveryTypeId?: number | null;
	DeliveryTypeName?: string | null;
	DeliveryTypeDescription?: string | null;
	MinDeliveryTypePrice?: number | null;
	MaxDeliveryTypePrice?: number | null;
	MinDeliveryTimeInDays?: number | null;
	MaxDeliveryTimeInDays?: number | null;
	OrderItemId?: number;
	WareId?: number;
	WarePriceHistoryId?: number;
	CustomerId?: number;
	ShopId?: number;
	Sorting?: string;
	StringIds?: string;
	QueryAny?: string;

}
export class OrderPostDTO {
	StatusId?: number;
	ShopId?: number;
	CustomerId?: string;
	Comment?: string | null;
	OrderDate?: Date;
	Phone?: string;
	DeliveryAddressId?: number;
	DeliveryTypeId?: number;
}
export class OrderCreateByTransactionDTO {
	RegisteredCustomerId: string | null;
	GuestCustomer: GuestCustomerPostDTO | null;
	Address: AddressDTO | null;
	OrderData: OrderPostDTO | null;
	OrderItems: OrderItemPostDTO[];
}
export class OrderPutDTO {
	Id: number;
	StatusId: number;
	ShopId: number;
	CustomerId: string;
	Comment: string | null;
	OrderDate: Date;
	Phone: string;
	DeliveryAddressId: number;
	DeliveryTypeId: number;
	OrderItemIds: number[];
}
export class OrderGetDTO {
	id: number;
	deliveryAddressId: number;
	orderDate: Date;
	phone: string;
	comment: string | null;
	statusId: number;
	shopId: number;
	status: OrderStatusGetDTO;
	shop: ShopGetDTO;
	deliveryAddress: AddressDTO;
	customerId: string;
	orderItemIds: number[];
	customer: Customer;
	orderItems: OrderItemGetDTO[];
	deliveryType: OrderDeliveryTypeGetDTO;
	deliveryTypeId: number;
	totalPrice: number;
}


const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_ORDER;
if (!API_BASE_URL) {
	console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_ORDER in your environment variables.");
	throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_ORDER in your environment variables.");
}

// GET запит (вже реалізований)
export async function getOrders(params: OrderQueryParams = { SearchParameter: "Query" }) {
	try {
		const response = await axios.get(API_BASE_URL!, {
			params,
		});

		return response.data;
	} catch (error) {
		console.error('Error fetching Orders:', error);
		throw new Error('Failed to fetch Orders');
	}
}

// POST запит для створення нового складу
export async function postOrder(Order: OrderPostDTO) {
	try {
		const response = await axios.post(API_BASE_URL!, Order);
		return response.data;
	} catch (error) {
		console.error('Error creating Order:', error);
		throw new Error('Failed to create Order');
	}
}

export async function postOrderViaTransaction(Order: OrderCreateByTransactionDTO) {
	try {
		const response = await axios.post(`${API_BASE_URL!}/createByProcess`, Order);
		return response.data;
	} catch (error) {
		console.error('Error creating Order:', error);
		throw new Error('Failed to create Order');
	}
}


// PUT запит для оновлення існуючого складу
export async function putOrder(Order: OrderPutDTO) {
	try {
		if (!Order.Id) {
			throw new Error('Id is required for updating a Order');
		}

		const response = await axios.put(API_BASE_URL!, Order);
		return response.data;
	} catch (error) {
		console.error('Error updating Order:', error);
		throw new Error('Failed to update Order');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteOrder(id: number) {
	try {
		const response = await axios.delete(`${API_BASE_URL!}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting Order:', error);
		throw new Error('Failed to delete Order');
	}
}


// Використання useQuery для отримання списку складів (orders)
export function useOrders(params: OrderQueryParams = { SearchParameter: "Query" }, isEnabled: boolean = true) {
	return useQuery({
		queryKey: ['orders', params],
		queryFn: () => getOrders(params),
		staleTime: Infinity, // Дані завжди актуальні
		gcTime: Infinity, // Дані залишаються в кеші без очищення
		refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
		enabled: isEnabled
	});
}

// Використання useMutation для створення нового складу (order)
export function useCreateOrder() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newOrder: OrderPostDTO) => postOrder(newOrder),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['orders'] }); // Оновлює кеш даних після створення складу
			},
		});
}

export function useCreateOrderByTransaction() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newOrder: OrderCreateByTransactionDTO) => postOrderViaTransaction(newOrder),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['addresses'] });
				queryClient.invalidateQueries({ queryKey: ['customers'] });
				queryClient.invalidateQueries({ queryKey: ['orders'] });
				queryClient.invalidateQueries({ queryKey: ['orderItems'] });
			},
		});
}

// Використання useMutation для оновлення існуючого складу (order)
export function useUpdateOrder() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newOrder: OrderPutDTO) => putOrder(newOrder),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['orders'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для видалення складу (order)
export function useDeleteOrder() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (id: number) => deleteOrder(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['orders'] }); // Оновлює кеш даних після видалення складу
			},
		});
}
