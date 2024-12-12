import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { WareGetDTO } from './WareApi';
import { WarePriceHistoryGetDTO } from './WarePriceHistoryApi';

export class OrderItemQueryParams {
	SearchParameter: string;
	Id?: number | null;
	OrderId?: number | null;
	WareId?: number | null;
	PriceHistoryId?: number | null;
	Count?: number | null;
	PageNumber?: number | null;
	PageSize?: number | null;
	StringIds?: string | null;
	Sorting?: string | null;
	QueryAny?: string | null;
}

export class OrderItemPostDTO {
	OrderId: number;
	WareId: number;
	PriceHistoryId: number;
	Count: number;
}
export class OrderItemPutDTO {
	Id: number;
	OrderId: number;
	WareId: number;
	PriceHistoryId: number;
	Count: number;
}
export class OrderItemGetDTO {
	id: number;
	orderId: number;
	wareId: number;
	priceHistoryId: number;
	count: number;
	ware: WareGetDTO;
	priceHistory: WarePriceHistoryGetDTO;
}


const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_ORDER_ITEM;
if (!API_BASE_URL) {
	console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_ORDER_ITEM in your environment variables.");
	throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_ORDER_ITEM in your environment variables.");
}

// GET запит (вже реалізований)
export async function getOrderItems(params: OrderItemQueryParams = { SearchParameter: "Query" }) {
	try {
		const response = await axios.get(API_BASE_URL!, {
			params,
		});

		return response.data;
	} catch (error) {
		console.error('Error fetching OrderItems:', error);
		throw new Error('Failed to fetch OrderItems');
	}
}

// POST запит для створення нового складу
export async function postOrderItem(Order: OrderItemPostDTO) {
	try {
		const response = await axios.post(API_BASE_URL!, Order);
		return response.data;
	} catch (error) {
		console.error('Error creating OrderItem:', error);
		throw new Error('Failed to create OrderItem');
	}
}

// PUT запит для оновлення існуючого складу
export async function putOrderItem(Order: OrderItemPutDTO) {
	try {
		if (!Order.Id) {
			throw new Error('Id is required for updating a OrderItem');
		}

		const response = await axios.put(API_BASE_URL!, Order);
		return response.data;
	} catch (error) {
		console.error('Error updating OrderItem:', error);
		throw new Error('Failed to update OrderItem');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteOrderItem(id: number) {
	try {
		const response = await axios.delete(`${API_BASE_URL!}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting OrderItem:', error);
		throw new Error('Failed to delete OrderItem');
	}
}


// Використання useQuery для отримання списку складів (orders)
export function useOrderItems(params: OrderItemQueryParams = { SearchParameter: "Query" }, isEnabled: boolean = true) {
	return useQuery({
		queryKey: ['orderItems', params],
		queryFn: () => getOrderItems(params),
		staleTime: Infinity, // Дані завжди актуальні
		gcTime: Infinity, // Дані залишаються в кеші без очищення
		refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
		enabled: isEnabled
	});
}

// Використання useMutation для створення нового складу (order)
export function useCreateOrderItem() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newOrder: OrderItemPostDTO) => postOrderItem(newOrder),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['orderItems'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для оновлення існуючого складу (order)
export function useUpdateOrderItem() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newOrder: OrderItemPutDTO) => putOrderItem(newOrder),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['orderItems'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для видалення складу (order)
export function useDeleteOrderItem() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (id: number) => deleteOrderItem(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['orderItems'] }); // Оновлює кеш даних після видалення складу
			},
		});
}
