import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export class WareTrademarkQueryParams {
	SearchParameter: string = "Query";
	Id?: number | null;
	WareId?: number | null;
	WareArticle?: number | null;
	NameSubstring?: string | null;
	WareNameSubstring?: string | null;
	WareDescriptionSubstring?: string | null;
	WareCategory1NameSubstring?: string | null;
	WareCategory2NameSubstring?: string | null;
	WareCategory1Id?: number | null;
	WareCategory2Id?: number | null;
	PageNumber?: number | null;
	PageSize?: number | null;
	Sorting?: string | null;
	StringIds?: string | null;
	QueryAny?: string | null;
}

export class WareTrademarkPostDTO {
	Name: string;
	WareCategory2Id: number;
}
export class WareTrademarkPutDTO {
	Id: number;
	Name: string;
	WareCategory2Id: number;
	WareIds?: number[] = [];
}

export class WareTrademark {
	id: number;
	wareCategory2Id: number;
	name: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_WARE_TRADEMARK;
if (!API_BASE_URL) {
	console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_WARE_TRADEMARK in your environment variables.");
	throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_WARE_TRADEMARK in your environment variables.");
}

// GET запит (вже реалізований)
export async function getWareTrademarks(params: WareTrademarkQueryParams = { SearchParameter: "Query" }) {
	try {
		const response = await axios.get(API_BASE_URL!, {
			params,
		});

		return response.data;
	} catch (error) {
		console.error('Error fetching WareTrademarks:', error);
		throw new Error('Failed to fetch WareTrademarks');
	}
}

// POST запит для створення нового складу
export async function postWareTrademark(WareTrademark: WareTrademarkPostDTO) {
	try {
		const response = await axios.post(API_BASE_URL!, WareTrademark);
		return response.data;
	} catch (error) {
		console.error('Error creating WareTrademark:', error);
		throw new Error('Failed to create WareTrademark');
	}
}

// PUT запит для оновлення існуючого складу
export async function putWareTrademark(WareTrademark: WareTrademarkPutDTO) {
	try {
		if (!WareTrademark.Id) {
			throw new Error('Id is required for updating a WareTrademark');
		}

		const response = await axios.put(API_BASE_URL!, WareTrademark);
		return response.data;
	} catch (error) {
		console.error('Error updating WareTrademark:', error);
		throw new Error('Failed to update WareTrademark');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteWareTrademark(id: number) {
	try {
		const response = await axios.delete(`${API_BASE_URL!}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting WareTrademark:', error);
		throw new Error('Failed to delete WareTrademark');
	}
}

// Використання useQuery для отримання списку складів (wareTrademarks)
export function useWareTrademarks(params: WareTrademarkQueryParams = { SearchParameter: "Query" }) {
	return useQuery({
		queryKey: ['wareTrademarks', params],
		queryFn: () => getWareTrademarks(params),
		staleTime: Infinity, // Дані завжди актуальні
		gcTime: Infinity, // Дані залишаються в кеші без очищення
		refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
	});
}

// Використання useMutation для створення нового складу (ware)
export function useCreateWareTrademark() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newWareTrademark: WareTrademarkPostDTO) => postWareTrademark(newWareTrademark),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wareTrademarks'] }); // Інвалідуємо кеш після мутації
			},
		}
	);
}

// Використання useMutation для оновлення існуючого складу (ware)
export function useUpdateWareTrademark() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newWareTrademark: WareTrademarkPutDTO) => putWareTrademark(newWareTrademark),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wareTrademarks'] }); // Інвалідуємо кеш після мутації
			},
		}
	);
}

// Використання useMutation для видалення складу (ware)
export function useDeleteWareTrademark() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (id: number) => deleteWareTrademark(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wareTrademarks'] }); // Інвалідуємо кеш після мутації
			},
		}
	);
}
