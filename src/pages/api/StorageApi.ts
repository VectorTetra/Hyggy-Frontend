import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export interface StorageQueryParams {
	SearchParameter?: "Query";
	AddressId?: number;
	Id?: number;
	ShopId?: number;
	WareItemId?: number;
	StorageEmployeeId?: string;
	ShopEmployeeId?: string;
	IsGlobal?: boolean;
	StringIds?: string;
	Sorting?: string;
	PageNumber?: number;
	PageSize?: number;
	QueryAny?: string | null;
}
export interface StorageDTO {
	AddressId?: number | null;
	Id?: number | null;
	ShopId?: number | null;
}

// GET запит (вже реалізований)
export async function getStorages(params: StorageQueryParams = {}) {
	try {
		const response = await axios.get('http://www.hyggy.somee.com/api/Storage', {
			params,
		});

		return response.data;
	} catch (error) {
		console.error('Error fetching storages:', error);
		throw new Error('Failed to fetch storages');
	}
}

// POST запит для створення нового складу
export async function postStorage(storage: StorageDTO) {
	try {
		const response = await axios.post('http://www.hyggy.somee.com/api/Storage', storage);
		return response.data;
	} catch (error) {
		console.error('Error creating storage:', error);
		throw new Error('Failed to create storage');
	}
}

// PUT запит для оновлення існуючого складу
export async function putStorage(storage: StorageDTO) {
	try {
		if (!storage.Id) {
			throw new Error('Id is required for updating a storage');
		}

		const response = await axios.put(`http://www.hyggy.somee.com/api/Storage`, storage);
		return response.data;
	} catch (error) {
		console.error('Error updating storage:', error);
		throw new Error('Failed to update storage');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteStorage(id: number) {
	try {
		const response = await axios.delete(`http://www.hyggy.somee.com/api/Storage/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting storage:', error);
		throw new Error('Failed to delete storage');
	}
}

// Використання useQuery для отримання списку складів (wares)
export function useStorages(params: StorageQueryParams = { SearchParameter: "Query" }) {
	return useQuery(['storages', params], () => getStorages(params), {
		staleTime: Infinity, // Дані залишаються актуальними завжди
		cacheTime: Infinity, // Дані залишаються в кеші без очищення
		refetchOnWindowFocus: false,
	});
}

// Використання useMutation для створення нового складу (ware)
export function useCreateStorage() {
	const queryClient = useQueryClient();
	return useMutation((newStorage: StorageDTO) => postStorage(newStorage), {
		onSuccess: () => {
			queryClient.invalidateQueries('storages'); // Оновлює кеш даних після створення нового складу
		},
	});
}

// Використання useMutation для оновлення існуючого складу (ware)
export function useUpdateStorage() {
	const queryClient = useQueryClient();
	return useMutation((updatedStorage: StorageDTO) => putStorage(updatedStorage), {
		onSuccess: () => {
			queryClient.invalidateQueries('storages'); // Оновлює кеш даних після оновлення складу
		},
	});
}

// Використання useMutation для видалення складу (ware)
export function useDeleteStorage() {
	const queryClient = useQueryClient();
	return useMutation((id: number) => deleteStorage(id), {
		onSuccess: () => {
			queryClient.invalidateQueries('storages'); // Оновлює кеш даних після видалення складу
		},
	});
}