import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export class WareCategory1QueryParams {
	SearchParameter: string = "Query";
	Id?: number | null;
	NameSubstring?: string | null;
	WareCategory2Id?: number | null;
	WareCategory2NameSubstring?: string | null;
	WareCategory3Id?: number | null;
	WareCategory3NameSubstring?: string | null;
	PageNumber?: number | null;
	PageSize?: number | null;
	Sorting?: string | null;
	StringIds?: string | null;
	QueryAny?: string | null;
}

export class WareCategory1PostDTO {
	Name: string;
}
export class WareCategory1PutDTO {
	Id: number;
	Name: string;
	WaresCategory2Ids?: number[] = [];
}

export class WareCategory1 {
	id: number;
	waresCategory2Ids: number[];
	name: string;
	waresCategories2: any[];
}
// GET запит (вже реалізований)
export async function getWareCategories1(params: WareCategory1QueryParams = { SearchParameter: "Query" }) {
	try {
		const response = await axios.get('http://www.hyggy.somee.com/api/WareCategory1', {
			params,
		});

		return response.data;
	} catch (error) {
		console.error('Error fetching WareCategory1s:', error);
		throw new Error('Failed to fetch WareCategory1s');
	}
}

// POST запит для створення нового складу
export async function postWareCategory1(WareCategory1: WareCategory1PostDTO) {
	try {
		const response = await axios.post('http://www.hyggy.somee.com/api/WareCategory1', WareCategory1);
		return response.data;
	} catch (error) {
		console.error('Error creating WareCategory1:', error);
		throw new Error('Failed to create WareCategory1');
	}
}

// PUT запит для оновлення існуючого складу
export async function putWareCategory1(WareCategory1: WareCategory1PutDTO) {
	try {
		if (!WareCategory1.Id) {
			throw new Error('Id is required for updating a WareCategory1');
		}

		const response = await axios.put(`http://www.hyggy.somee.com/api/WareCategory1`, WareCategory1);
		return response.data;
	} catch (error) {
		console.error('Error updating WareCategory1:', error);
		throw new Error('Failed to update WareCategory1');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteWareCategory1(id: number) {
	try {
		const response = await axios.delete(`http://www.hyggy.somee.com/api/WareCategory1/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting WareCategory1:', error);
		throw new Error('Failed to delete WareCategory1');
	}
}

// Використання useQuery для отримання списку складів (wareCategories1)
export function useWareCategories1(params: WareCategory1QueryParams = { SearchParameter: "Query" }) {
	return useQuery({
		queryKey: ['wareCategories1', params],
		queryFn: () => getWareCategories1(params),
		// staleTime: Infinity, // Дані завжди актуальні
		// gcTime: Infinity, // Дані залишаються в кеші без очищення
		refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
	});
}

// Використання useMutation для створення нового складу (ware)
export function useCreateWareCategory1() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newWareCategory1: WareCategory1PostDTO) => postWareCategory1(newWareCategory1),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wareCategories1'] }); // Інвалідуємо кеш після мутації
			},
		}
	);
}

// Використання useMutation для оновлення існуючого складу (ware)
export function useUpdateWareCategory1() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newWareCategory1: WareCategory1PutDTO) => putWareCategory1(newWareCategory1),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wareCategories1'] }); // Інвалідуємо кеш після мутації
			},
		}
	);
}

// Використання useMutation для видалення складу (ware)
export function useDeleteWareCategory1() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (id: number) => deleteWareCategory1(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wareCategories1'] }); // Інвалідуємо кеш після мутації
			},
		}
	);
}
