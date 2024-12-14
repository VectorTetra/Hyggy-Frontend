import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { WareGetDTO } from './WareApi';
import { WarePriceHistoryGetDTO } from './WarePriceHistoryApi';

export class OrderDeliveryTypeQueryParams {
	SearchParameter: string; // Вибраний критерій пошуку
	Id?: number | null;
	OrderId?: number | null;
	Name?: string | null;
	Description?: string | null;
	MinPrice?: number | null;
	MaxPrice?: number | null;
	MinDeliveryTimeInDays?: number | null;
	MaxDeliveryTimeInDays?: number | null;
	PageNumber?: number | null;
	PageSize?: number | null;
	Sorting?: string | null;
	StringIds?: string | null;
	QueryAny?: string | null;
}

export class OrderDeliveryTypePostDTO {
	Name: string;
	Description?: string | null;
	Price: number;
	MinDeliveryTimeInDays: number;
	MaxDeliveryTimeInDays: number;
}
export class OrderDeliveryTypePutDTO {
	Id: number;
	Name: string;
	Description?: string | null;
	Price: number;
	MinDeliveryTimeInDays: number;
	MaxDeliveryTimeInDays: number;
	OrderIds: number[];
}
export class OrderDeliveryTypeGetDTO {
	id: number;
	name: string;
	description: string;
	price: number;
	minDeliveryTimeInDays: number;
	maxDeliveryTimeInDays: number;
	orderIds?: number[] | null;
}


const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_ORDER_DELIVERY_TYPE;
if (!API_BASE_URL) {
	console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_ORDER_DELIVERY_TYPE in your environment variables.");
	throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_ORDER_DELIVERY_TYPE in your environment variables.");
}

// GET запит (вже реалізований)
export async function getOrderDeliveryTypes(params: OrderDeliveryTypeQueryParams = { SearchParameter: "Query" }) {
	try {
		const response = await axios.get(API_BASE_URL!, {
			params,
		});

		return response.data;
	} catch (error) {
		console.error('Error fetching OrderDeliveryTypes:', error);
		throw new Error('Failed to fetch OrderDeliveryTypes');
	}
}

// POST запит для створення нового складу
export async function postOrderDeliveryType(Order: OrderDeliveryTypePostDTO) {
	try {
		const response = await axios.post(API_BASE_URL!, Order);
		return response.data;
	} catch (error) {
		console.error('Error creating OrderDeliveryType:', error);
		throw new Error('Failed to create OrderDeliveryType');
	}
}

// PUT запит для оновлення існуючого складу
export async function putOrderDeliveryType(Order: OrderDeliveryTypePutDTO) {
	try {
		if (!Order.Id) {
			throw new Error('Id is required for updating a OrderDeliveryType');
		}

		const response = await axios.put(API_BASE_URL!, Order);
		return response.data;
	} catch (error) {
		console.error('Error updating OrderDeliveryType:', error);
		throw new Error('Failed to update OrderDeliveryType');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteOrderDeliveryType(id: number) {
	try {
		const response = await axios.delete(`${API_BASE_URL!}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting OrderDeliveryType:', error);
		throw new Error('Failed to delete OrderDeliveryType');
	}
}


// Використання useQuery для отримання списку складів (orders)
export function useOrderDeliveryTypes(params: OrderDeliveryTypeQueryParams = { SearchParameter: "Query" }, isEnabled: boolean = true) {
	return useQuery({
		queryKey: ['orderDeliveryTypes', params],
		queryFn: () => getOrderDeliveryTypes(params),
		staleTime: Infinity, // Дані завжди актуальні
		gcTime: Infinity, // Дані залишаються в кеші без очищення
		refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
		enabled: isEnabled
	});
}

// Використання useMutation для створення нового складу (order)
export function useCreateOrderDeliveryType() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newOrder: OrderDeliveryTypePostDTO) => postOrderDeliveryType(newOrder),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['orderDeliveryTypes'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для оновлення існуючого складу (order)
export function useUpdateOrderDeliveryType() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newOrder: OrderDeliveryTypePutDTO) => putOrderDeliveryType(newOrder),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['orderDeliveryTypes'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для видалення складу (order)
export function useDeleteOrderDeliveryType() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (id: number) => deleteOrderDeliveryType(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['orderDeliveryTypes'] }); // Оновлює кеш даних після видалення складу
			},
		});
}
