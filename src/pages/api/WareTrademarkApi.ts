import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { useMutation, useQuery, useQueryClient } from 'react-query';

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
// GET запит (вже реалізований)
export async function getWareTrademarks(params: WareTrademarkQueryParams = { SearchParameter: "Query" }) {
	try {
		const response = await axios.get('http://www.hyggy.somee.com/api/WareTrademark', {
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
		const response = await axios.post('http://www.hyggy.somee.com/api/WareTrademark', WareTrademark);
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

		const response = await axios.put(`http://www.hyggy.somee.com/api/WareTrademark`, WareTrademark);
		return response.data;
	} catch (error) {
		console.error('Error updating WareTrademark:', error);
		throw new Error('Failed to update WareTrademark');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteWareTrademark(id: number) {
	try {
		const response = await axios.delete(`http://www.hyggy.somee.com/api/WareTrademark/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting WareTrademark:', error);
		throw new Error('Failed to delete WareTrademark');
	}
}

// Використання useQuery для отримання списку складів (wareTrademarks)
export function useWareTrademarks(params: WareTrademarkQueryParams = { SearchParameter: "Query" }) {
	return useQuery(['wareTrademarks', params], () => getWareTrademarks(params), {
		staleTime: Infinity, // Дані залишаються актуальними завжди
		cacheTime: Infinity, // Дані залишаються в кеші без очищення
		refetchOnWindowFocus: false, // Не рефетчити при фокусуванні вікна
	});
}

// Використання useMutation для створення нового складу (ware)
export function useCreateWareTrademark() {
	const queryClient = useQueryClient();
	return useMutation((newWareTrademark: WareTrademarkPostDTO) => postWareTrademark(newWareTrademark), {
		onSuccess: () => {
			queryClient.invalidateQueries('wareTrademarks'); // Оновлює кеш даних після створення нового складу
		},
	});
}

// Використання useMutation для оновлення існуючого складу (ware)
export function useUpdateWareTrademark() {
	const queryClient = useQueryClient();
	return useMutation((updatedWareTrademark: WareTrademarkPutDTO) => putWareTrademark(updatedWareTrademark), {
		onSuccess: () => {
			queryClient.invalidateQueries('wareTrademarks'); // Оновлює кеш даних після оновлення складу
		},
	});
}

// Використання useMutation для видалення складу (ware)
export function useDeleteWareTrademark() {
	const queryClient = useQueryClient();
	return useMutation((id: number) => deleteWareTrademark(id), {
		onSuccess: () => {
			queryClient.invalidateQueries('wareTrademarks'); // Оновлює кеш даних після видалення складу
		},
	});
}
