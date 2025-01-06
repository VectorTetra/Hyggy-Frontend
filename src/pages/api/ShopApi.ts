import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


export interface ShopQueryParams {
	SearchParameter?: string;
	Id?: number | null;
	AddressId?: number;
	Street?: string;
	HouseNumber?: string;
	City?: string;
	Name?: string;
	State?: string;
	PostalCode?: string;
	Latitude?: number;
	Longitude?: number;
	StorageId?: number;
	OrderId?: number;
	PageNumber?: number;
	PageSize?: number;
	NearestCount?: number;
	StringIds?: string;
	Sorting?: string;
	QueryAny?: string | null;
}
export interface ShopDTO {
	AddressId?: number;
	Id?: number;
	StorageId?: number;
	Name?: string;
	WorkHours?: string;
	PhotoUrl?: string;
	OrderIds?: number[] | null;
	ShopEmployeeIds?: string[] | null;
}
export interface ShopGetDTO {
	id: number;
	photoUrl?: string;
	workHours?: string;
	name?: string;
	street?: string;
	houseNumber?: string;
	city?: string;
	state?: string;
	postalCode?: string;
	latitude?: number;
	longitude?: number;
	addressId?: number;
	storageId: number;
	executedOrdersSum?: number;
	orderIds?: number[] | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_SHOP;
if (!API_BASE_URL) {
	console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_SHOP in your environment variables.");
	throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_SHOP in your environment variables.");
}

// GET запит (вже реалізований)
export async function getShops(params: ShopQueryParams = {}) {
	try {
		const response = await axios.get(API_BASE_URL!, {
			params,
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching Shops:', error);
		throw new Error('Failed to fetch Shops');
	}
}

// POST запит для створення нового складу
export async function postShop(Shop: ShopDTO) {
	try {
		const response = await axios.post(API_BASE_URL!, Shop);
		return response.data;
	} catch (error) {
		console.error('Error creating Shop:', error);
		throw new Error('Failed to create Shop');
	}
}

// PUT запит для оновлення існуючого складу
export async function putShop(Shop: ShopDTO) {
	try {
		if (!Shop.Id) {
			throw new Error('Id is required for updating a Shop');
		}
		const response = await axios.put(API_BASE_URL!, Shop);
		return response.data;
	} catch (error) {
		console.error('Error updating Shop:', error);
		throw new Error('Failed to update Shop');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteShop(id: number) {
	try {
		const response = await axios.delete(`${API_BASE_URL!}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting Shop:', error);
		throw new Error('Failed to delete Shop');
	}
}

// Використання useQuery для отримання списку складів (Shops)
export function useShops(params: ShopQueryParams = { SearchParameter: "Query" }, isEnabled: boolean = true) {
	return useQuery({
		queryKey: ['Shops', params],
		queryFn: () => getShops(params),
		staleTime: 60 * 1000,
		gcTime: 60 * 1000 * 5,
		refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
		enabled: isEnabled,
	});
}

// Використання useMutation для створення нового складу (Shop)
export function useCreateShop() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newShop: ShopDTO) => postShop(newShop),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['Shops'] }); // Оновлює кеш даних після створення складу
				queryClient.invalidateQueries({ queryKey: ['storages'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для оновлення існуючого складу (Shop)
export function useUpdateShop() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newShop: ShopDTO) => putShop(newShop),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['Shops'] }); // Оновлює кеш даних після оновлення складу
				queryClient.invalidateQueries({ queryKey: ['storages'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для видалення складу (Shop)
export function useDeleteShop() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (id: number) => deleteShop(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['Shops'] }); // Оновлює кеш даних після видалення складу
				queryClient.invalidateQueries({ queryKey: ['storages'] }); // Оновлює кеш даних після створення складу
			}
		});
}
