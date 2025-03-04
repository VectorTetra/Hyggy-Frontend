import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


export interface StorageQueryParams {
	SearchParameter?: string;
	AddressId?: number;
	Id?: number | null;
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
export interface Storage {
	id: number;
	shopId?: number | null;
	addressId?: number | null;
	// Для результатів Get-запитів
	shopName?: string | null; // Назва магазину
	street?: string | null; // Назва вулиці
	houseNumber?: string | null; // Номер будинку
	city?: string | null; // Місто
	state?: string | null; // Область або штат
	postalCode?: string | null; // Поштовий індекс
	latitude?: number | null; // Географічна широта
	longitude?: number | null; // Географічна довгота
	storedWaresSum?: number | null; // Загальна сума товарів
}


const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_STORAGE;
if (!API_BASE_URL) {
	console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_STORAGE in your environment variables.");
	throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_STORAGE in your environment variables.");
}

// GET запит (вже реалізований)
export async function getStorages(params: StorageQueryParams = {}) {
	try {
		const response = await axios.get(API_BASE_URL!, {
			params,
		});
		// const response = await axios.get('http://localhost:5263/api/Storage', {
		// 		params,
		// 	});

		return response.data;
	} catch (error) {
		console.error('Error fetching storages:', error);
		throw new Error('Failed to fetch storages');
	}
}

// POST запит для створення нового складу
export async function postStorage(storage: StorageDTO) {
	try {
		const response = await axios.post(API_BASE_URL!, storage);
		//const response = await axios.post('http://localhost:5263/api/Storage', storage);
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

		const response = await axios.put(API_BASE_URL!, storage);
		return response.data;
	} catch (error) {
		console.error('Error updating storage:', error);
		throw new Error('Failed to update storage');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteStorage(id: number) {
	try {
		const response = await axios.delete(`${API_BASE_URL!}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting storage:', error);
		throw new Error('Failed to delete storage');
	}
}

// Використання useQuery для отримання списку складів (wares)
export function useStorages(params: StorageQueryParams = { SearchParameter: "Query" }, isEnabled: boolean = true) {
	return useQuery({
		queryKey: ['storages', params],
		queryFn: () => getStorages(params),
		staleTime: 60 * 1000,
		gcTime: 60 * 1000 * 5,
		refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
		enabled: isEnabled,
	});
}

// Використання useMutation для створення нового складу (ware)
export function useCreateStorage() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newStorage: StorageDTO) => postStorage(newStorage),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['storages'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для оновлення існуючого складу (ware)
export function useUpdateStorage() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (updatedStorage: StorageDTO) => putStorage(updatedStorage),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['storages'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для видалення складу (ware)
export function useDeleteStorage() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (id: number) => deleteStorage(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['storages'] }); // Оновлює кеш даних після видалення складу
			},
		});
}