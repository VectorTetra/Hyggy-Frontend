import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { useMutation, useQuery, useQueryClient } from 'react-query';

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
// GET запит (вже реалізований)
export async function getWareStatuses(params: WareStatusQueryParams = { SearchParameter: "Query" }) {
	try {
		const response = await axios.get('http://www.hyggy.somee.com/api/WareStatus', {
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
		const response = await axios.post('http://www.hyggy.somee.com/api/WareStatus', WareStatus);
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

		const response = await axios.put(`http://www.hyggy.somee.com/api/WareStatus`, WareStatus);
		return response.data;
	} catch (error) {
		console.error('Error updating WareStatus:', error);
		throw new Error('Failed to update WareStatus');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteWareStatus(id: number) {
	try {
		const response = await axios.delete(`http://www.hyggy.somee.com/api/WareStatus/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting WareStatus:', error);
		throw new Error('Failed to delete WareStatus');
	}
}

// Використання useQuery для отримання списку складів (wareStatuses)
export function useWareStatuses(params: WareStatusQueryParams = { SearchParameter: "Query" }) {
	return useQuery(['wareStatuses', params], () => getWareStatuses(params), {
		staleTime: Infinity, // Дані залишаються актуальними завжди
		cacheTime: Infinity, // Дані залишаються в кеші без очищення
		refetchOnWindowFocus: false, // Не рефетчити при фокусуванні вікна
	});
}

// Використання useMutation для створення нового складу (ware)
export function useCreateWareStatus() {
	const queryClient = useQueryClient();
	return useMutation((newWareStatus: WareStatusPostDTO) => postWareStatus(newWareStatus), {
		onSuccess: () => {
			queryClient.invalidateQueries('wareStatuses'); // Оновлює кеш даних після створення нового складу
		},
	});
}

// Використання useMutation для оновлення існуючого складу (ware)
export function useUpdateWareStatus() {
	const queryClient = useQueryClient();
	return useMutation((updatedWareStatus: WareStatusPutDTO) => putWareStatus(updatedWareStatus), {
		onSuccess: () => {
			queryClient.invalidateQueries('wareStatuses'); // Оновлює кеш даних після оновлення складу
		},
	});
}

// Використання useMutation для видалення складу (ware)
export function useDeleteWareStatus() {
	const queryClient = useQueryClient();
	return useMutation((id: number) => deleteWareStatus(id), {
		onSuccess: () => {
			queryClient.invalidateQueries('wareStatuses'); // Оновлює кеш даних після видалення складу
		},
	});
}
