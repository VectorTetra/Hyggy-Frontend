import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export class WareHistoryQueryParams {
	SearchParameter: string;
	Id?: number | null;
	WareId?: number | null;
	MinPrice?: number | null;
	MaxPrice?: number | null;
	StartDate?: Date | null;
	EndDate?: Date | null;
	PageNumber?: number | null;
	PageSize?: number | null;
	StringIds?: string | null;
	Sorting?: string | null;
	QueryAny?: string | null;
}

export class WareHistoryPostDTO {
	WareId: number;
	EffectiveDate: Date;
	Price: number;
}
export class WareHistoryPutDTO {
	Id: number;
	WareId: number;
	EffectiveDate: Date;
	Price: number;
}
export class WarePriceHistoryGetDTO {
	id: number;
	wareId: number;
	effectiveDate: Date;
	price: number;
}


const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_WARE_PRICE_HISTORY;
if (!API_BASE_URL) {
	console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_WARE_PRICE_HISTORY in your environment variables.");
	throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_WARE_PRICE_HISTORY in your environment variables.");
}

// GET запит (вже реалізований)
export async function getWareHistories(params: WareHistoryQueryParams = { SearchParameter: "Query" }) {
	try {
		const response = await axios.get(API_BASE_URL!, {
			params,
		});

		return response.data;
	} catch (error) {
		console.error('Error fetching Wares:', error);
		throw new Error('Failed to fetch Wares');
	}
}

// POST запит для створення нового складу
export async function postWareHistory(Ware: WareHistoryPostDTO) {
	try {
		const response = await axios.post(API_BASE_URL!, Ware);
		return response.data;
	} catch (error) {
		console.error('Error creating Ware:', error);
		throw new Error('Failed to create Ware');
	}
}

// PUT запит для оновлення існуючого складу
export async function putWareHistory(Ware: WareHistoryPutDTO) {
	try {
		if (!Ware.Id) {
			throw new Error('Id is required for updating a Ware');
		}

		const response = await axios.put(API_BASE_URL!, Ware);
		return response.data;
	} catch (error) {
		console.error('Error updating Ware:', error);
		throw new Error('Failed to update Ware');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteWareHistory(id: number) {
	try {
		const response = await axios.delete(`${API_BASE_URL!}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting Ware:', error);
		throw new Error('Failed to delete Ware');
	}
}


// Використання useQuery для отримання списку складів (wares)
export function useWarePriceHistories(params: WareHistoryQueryParams = { SearchParameter: "Query" }, isEnabled: boolean = true) {
	return useQuery({
		queryKey: ['waresHistories', params],
		queryFn: () => getWareHistories(params),
		staleTime: 60 * 1000,
		gcTime: 60 * 1000 * 5,
		refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
		enabled: isEnabled
	});
}

// Використання useMutation для створення нового складу (ware)
export function useCreateWareHistory() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newWare: WareHistoryPostDTO) => postWareHistory(newWare),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['waresHistories'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для оновлення існуючого складу (ware)
export function useUpdateWareHistory() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newWare: WareHistoryPutDTO) => putWareHistory(newWare),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['waresHistories'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для видалення складу (ware)
export function useDeleteWareHistory() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (id: number) => deleteWareHistory(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['waresHistories'] }); // Оновлює кеш даних після видалення складу
			},
		});
}
