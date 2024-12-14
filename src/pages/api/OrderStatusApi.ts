import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { WareGetDTO } from './WareApi';
import { WarePriceHistoryGetDTO } from './WarePriceHistoryApi';

export class OrderStatusQueryParams {
	SearchParameter: string;
	Id?: number | null;
	OrderId?: number | null;
	NameSubstring?: string | null;
	DescriptionSubstring?: string | null;
	PageNumber?: number | null;
	PageSize?: number | null;
	StringIds?: string | null;
	Sorting?: string | null;
	QueryAny?: string | null;
}

export class OrderStatusPostDTO {
	Name: string;
	Description: string;
}
export class OrderStatusPutDTO {
	Id: number;
	Name: string;
	Description: string;
	OrderIds: number[];

}
export class OrderStatusGetDTO {
	id: number;
	orderIds: number[];
	description: string;
	name: string;
}


const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_ORDER_STATUS;
if (!API_BASE_URL) {
	console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_ORDER_STATUS in your environment variables.");
	throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_ORDER_STATUS in your environment variables.");
}

// GET запит (вже реалізований)
export async function getOrderStatuss(params: OrderStatusQueryParams = { SearchParameter: "Query" }) {
	try {
		const response = await axios.get(API_BASE_URL!, {
			params,
		});

		return response.data;
	} catch (error) {
		console.error('Error fetching OrderStatuss:', error);
		throw new Error('Failed to fetch OrderStatuss');
	}
}

// POST запит для створення нового складу
export async function postOrderStatus(Order: OrderStatusPostDTO) {
	try {
		const response = await axios.post(API_BASE_URL!, Order);
		return response.data;
	} catch (error) {
		console.error('Error creating OrderStatus:', error);
		throw new Error('Failed to create OrderStatus');
	}
}

// PUT запит для оновлення існуючого складу
export async function putOrderStatus(Order: OrderStatusPutDTO) {
	try {
		if (!Order.Id) {
			throw new Error('Id is required for updating a OrderStatus');
		}

		const response = await axios.put(API_BASE_URL!, Order);
		return response.data;
	} catch (error) {
		console.error('Error updating OrderStatus:', error);
		throw new Error('Failed to update OrderStatus');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteOrderStatus(id: number) {
	try {
		const response = await axios.delete(`${API_BASE_URL!}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting OrderStatus:', error);
		throw new Error('Failed to delete OrderStatus');
	}
}


// Використання useQuery для отримання списку складів (orders)
export function useOrderStatuss(params: OrderStatusQueryParams = { SearchParameter: "Query" }, isEnabled: boolean = true) {
	return useQuery({
		queryKey: ['orderStatuses', params],
		queryFn: () => getOrderStatuss(params),
		staleTime: Infinity, // Дані завжди актуальні
		gcTime: Infinity, // Дані залишаються в кеші без очищення
		refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
		enabled: isEnabled
	});
}

// Використання useMutation для створення нового складу (order)
export function useCreateOrderStatus() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newOrder: OrderStatusPostDTO) => postOrderStatus(newOrder),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['orderStatuses'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для оновлення існуючого складу (order)
export function useUpdateOrderStatus() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newOrder: OrderStatusPutDTO) => putOrderStatus(newOrder),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['orderStatuses'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для видалення складу (order)
export function useDeleteOrderStatus() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (id: number) => deleteOrderStatus(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['orderStatuses'] }); // Оновлює кеш даних після видалення складу
			},
		});
}
