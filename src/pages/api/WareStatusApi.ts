import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


export class WareStatusQueryParams {
	SearchParameter: string = "Query";
	Id?: number | null;
	PageNumber?: number | null;
	PageSize?: number | null;
	WareId?: number | null;
	WareArticle?: number | null;
	NameSubstring?: string | null;
	Sorting?: string | null;
	StringIds?: string | null;
	QueryAny?: string | null;
}

export class WareStatusPostDTO {
	Name: string;
	Description?: string | null;
}
export class WareStatusPutDTO {
	Id: number;
	Name: string;
	Description?: string | null;
	WareIds?: number[] = [];
}

export class WareStatus {
	id: number;
	name: string;
	description: string;
	wareIds: number[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_WARE_STATUS;
if (!API_BASE_URL) {
	console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_WARE_STATUS in your environment variables.");
	throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_WARE_STATUS in your environment variables.");
}

// GET запит (вже реалізований)
export async function getWareStatuses(params: WareStatusQueryParams = { SearchParameter: "Query" }) {
	try {
		const response = await axios.get(API_BASE_URL!, {
			params,
		});

		return response.data;
	} catch (error) {
		console.error('Error fetching WareStatuses:', error);
		throw new Error('Failed to fetch WareStatuses');
	}
}

// POST запит для створення нового складу
export async function postWareStatus(WareStatus: WareStatusPostDTO) {
	try {
		const response = await axios.post(API_BASE_URL!, WareStatus);
		return response.data;
	} catch (error) {
		console.error('Error creating WareStatus:', error);
		throw new Error('Failed to create WareStatus');
	}
}

// PUT запит для оновлення існуючого складу
export async function putWareStatus(WareStatus: WareStatusPutDTO) {
	try {
		if (!WareStatus.Id) {
			throw new Error('Id is required for updating a WareStatus');
		}

		const response = await axios.put(API_BASE_URL!, WareStatus);
		return response.data;
	} catch (error) {
		console.error('Error updating WareStatus:', error);
		throw new Error('Failed to update WareStatus');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteWareStatus(id: number) {
	try {
		const response = await axios.delete(`${API_BASE_URL!}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting WareStatus:', error);
		throw new Error('Failed to delete WareStatus');
	}
}

// Використання useQuery для отримання списку складів (wareStatuses)
export function useWareStatuses(params: WareStatusQueryParams = { SearchParameter: "Query" }, isEnabled: boolean = true) {

	return useQuery({
		queryKey: ['wareStatuses', params],
		queryFn: () => getWareStatuses(params),
		staleTime: 60 * 1000,
		gcTime: 60 * 1000 * 5,
		refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
		enabled: isEnabled,
	});
}

// Використання useMutation для створення нового складу (ware)
export function useCreateWareStatus() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newWareStatus: WareStatusPostDTO) => postWareStatus(newWareStatus),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wareStatuses'] }); // Інвалідуємо кеш після мутації
			},
		}
	);
}

// Використання useMutation для оновлення існуючого складу (ware)
export function useUpdateWareStatus() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newWareStatus: WareStatusPutDTO) => putWareStatus(newWareStatus),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wareStatuses'] }); // Інвалідуємо кеш після мутації
			},
		}
	);
}

// Використання useMutation для видалення складу (ware)
export function useDeleteWareStatus() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (id: number) => deleteWareStatus(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wareStatuses'] }); // Інвалідуємо кеш після мутації
			},
		}
	);
}
