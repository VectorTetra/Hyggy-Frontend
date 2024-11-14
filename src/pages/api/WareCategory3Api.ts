import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export class WareCategory3QueryParams {
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
	wareCategory2Id: number;
	name: string;
}
// GET запит (вже реалізований)
export async function getWareCategories3(params: WareCategory3QueryParams = { SearchParameter: "Query" }) {
	try {
		const response = await axios.get('http://www.hyggy.somee.com/api/WareCategory3', {
			params,
		});

		return response.data;
	} catch (error) {
		console.error('Error fetching WareCategory3s:', error);
		throw new Error('Failed to fetch WareCategory3s');
	}
}

// POST запит для створення нового складу
export async function postWareCategory3(WareCategory3: WareCategory3PostDTO) {
	try {
		const response = await axios.post('http://www.hyggy.somee.com/api/WareCategory3', WareCategory3);
		return response.data;
	} catch (error) {
		console.error('Error creating WareCategory3:', error);
		throw new Error('Failed to create WareCategory3');
	}
}

// PUT запит для оновлення існуючого складу
export async function putWareCategory3(WareCategory3: WareCategory3PutDTO) {
	try {
		if (!WareCategory3.Id) {
			throw new Error('Id is required for updating a WareCategory3');
		}

		const response = await axios.put(`http://www.hyggy.somee.com/api/WareCategory3`, WareCategory3);
		return response.data;
	} catch (error) {
		console.error('Error updating WareCategory3:', error);
		throw new Error('Failed to update WareCategory3');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteWareCategory3(id: number) {
	try {
		const response = await axios.delete(`http://www.hyggy.somee.com/api/WareCategory3/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting WareCategory3:', error);
		throw new Error('Failed to delete WareCategory3');
	}
}

// Використання useQuery для отримання списку складів (wareCategories3)
export function useWareCategories3(params: WareCategory3QueryParams = { SearchParameter: "Query" }) {
	return useQuery(['wareCategories3', params], () => getWareCategories3(params), {
		staleTime: Infinity, // Дані залишаються актуальними завжди
		cacheTime: Infinity, // Дані залишаються в кеші без очищення
		refetchOnWindowFocus: false, // Не рефетчити при фокусуванні вікна
	});
}

// Використання useMutation для створення нового складу (ware)
export function useCreateWareCategory3() {
	const queryClient = useQueryClient();
	return useMutation((newWareCategory3: WareCategory3PostDTO) => postWareCategory3(newWareCategory3), {
		onSuccess: () => {
			queryClient.invalidateQueries('wareCategories3'); // Оновлює кеш даних після створення нового складу
		},
	});
}

// Використання useMutation для оновлення існуючого складу (ware)
export function useUpdateWareCategory3() {
	const queryClient = useQueryClient();
	return useMutation((updatedWareCategory3: WareCategory3PutDTO) => putWareCategory3(updatedWareCategory3), {
		onSuccess: () => {
			queryClient.invalidateQueries('wareCategories3'); // Оновлює кеш даних після оновлення складу
		},
	});
}

// Використання useMutation для видалення складу (ware)
export function useDeleteWareCategory3() {
	const queryClient = useQueryClient();
	return useMutation((id: number) => deleteWareCategory3(id), {
		onSuccess: () => {
			queryClient.invalidateQueries('wareCategories3'); // Оновлює кеш даних після видалення складу
		},
	});
}
