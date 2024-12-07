import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export class WareCategory3QueryParams {
	SearchParameter: string = "Query";
	Id?: number | null;
	NameSubstring?: string | null;
	WareCategory1Id?: number | null;
	WareCategory1NameSubstring?: string | null;
	WareCategory2Id?: number | null;
	WareCategory2NameSubstring?: string | null;
	WareId?: number | null;
	WareArticle?: number | null;
	WareNameSubstring?: string | null;
	WareDescriptionSubstring?: string | null;
	PageNumber?: number | null;
	PageSize?: number | null;
	Sorting?: string | null;
	StringIds?: string | null;
	QueryAny?: string | null;
}

export class WareCategory3PostDTO {
	Name: string;
	WareCategory2Id: number;
}
export class WareCategory3PutDTO {
	Id: number;
	Name: string;
	WareCategory2Id: number;
	WareIds?: number[] = [];
}

export class WareCategory3 {
	id: number;
	waresCategory2Ids: number[];
	name: string;
	waresCategories2: any[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_WARE_CATEGORY_3;
if (!API_BASE_URL) {
	console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_WARE_CATEGORY_3 in your environment variables.");
	throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_WARE_CATEGORY_3 in your environment variables.");
}
// API запити
export async function getWareCategories3(params: WareCategory3QueryParams = { SearchParameter: "Query" }) {
	try {
		const response = await axios.get(API_BASE_URL!, { params });
		return response.data;
	} catch (error) {
		console.error('Error fetching WareCategory3s:', error);
		throw new Error('Failed to fetch WareCategory3s');
	}
}

export async function postWareCategory3(WareCategory3: WareCategory3PostDTO) {
	try {
		const response = await axios.post(API_BASE_URL!, WareCategory3);
		return response.data;
	} catch (error) {
		console.error('Error creating WareCategory3:', error);
		throw new Error('Failed to create WareCategory3');
	}
}

export async function putWareCategory3(WareCategory3: WareCategory3PutDTO) {
	try {
		const response = await axios.put(API_BASE_URL!, WareCategory3);
		return response.data;
	} catch (error) {
		console.error('Error updating WareCategory3:', error);
		throw new Error('Failed to update WareCategory3');
	}
}

export async function deleteWareCategory3(id) {
	try {
		const response = await axios.delete(`${API_BASE_URL!}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting WareCategory3:', error);
		throw new Error('Failed to delete WareCategory3');
	}
}

// Використання useQuery для отримання даних
export function useWareCategories3(params) {
	return useQuery({
		queryKey: ['wareCategories3', params],
		queryFn: () => getWareCategories3(params),
		staleTime: Infinity, // Дані завжди актуальні
		gcTime: Infinity, // Дані залишаються в кеші без очищення
		refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
	});
}

// Використання useMutation для мутацій
export function useCreateWareCategory3() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newWareCategory3: WareCategory3PostDTO) => postWareCategory3(newWareCategory3),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wareCategories3'] }); // Інвалідуємо кеш після мутації
			},
		}
	);
}

export function useUpdateWareCategory3() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newWareCategory3: WareCategory3PutDTO) => putWareCategory3(newWareCategory3),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wareCategories3'] }); // Інвалідуємо кеш після мутації
			},
		}
	);
}

export function useDeleteWareCategory3() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (id) => deleteWareCategory3(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wareCategories3'] }); // Інвалідуємо кеш після видалення
			},
		}
	);
}
