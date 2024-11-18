import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface AddressQueryParams {
	SearchParameter: string;
	Id?: number | null;
	Street?: string | null;
	HouseNumber?: string | null;
	City?: string | null;
	State?: string | null;
	PostalCode?: string | null;
	Latitude?: number | null;
	Longitude?: number | null;
	ShopId?: number | null;
	StorageId?: number | null;
	OrderId?: number | null;
	PageNumber?: number | null;
	PageSize?: number | null;
	StringIds?: string | null;
	Sorting?: string | null;
	QueryAny?: string | null;
}

export interface AddressDTO {
	AddressId?: number;
	Id?: number | null;
	ShopId?: number | null;
	StorageId?: number | null;
	Street?: string | null;
	HouseNumber?: string | null;
	City?: string | null;
	State?: string | null;
	PostalCode?: string | null;
	Latitude?: number | null;
	Longitude?: number | null;
	OrderIds?: number[];
	StringIds?: string;
}


// GET запит для отримання адрес за параметрами
export async function getAddresses(params: AddressQueryParams = { SearchParameter: "Query" }) {
	try {
		const response = await axios.get("http://www.hyggy.somee.com/api/Address", { params });
		return response.data;
	} catch (error) {
		console.error('Error fetching addresses:', error);
		throw error;
	}
}

// POST запит для створення нового складу
export async function postAddress(address: AddressDTO) {
	try {
		const response = await axios.post("http://www.hyggy.somee.com/api/Address", address);
		return response.data;
	} catch (error) {
		console.error('Error creating address:', error);
		throw error;
	}
}

// PUT запит для оновлення існуючого складу
export async function putAddress(address: AddressDTO) {
	try {
		const response = await axios.put("http://www.hyggy.somee.com/api/Address", address);
		return response.data;
	} catch (error) {
		console.error('Error updating address:', error);
		throw error;
	}
}

// DELETE запит для видалення складу за Id
export async function deleteAddress(id: number) {
	try {
		const response = await axios.delete(`http://www.hyggy.somee.com/api/Address/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting address:', error);
		throw error;
	}
}

// Використання useQuery для отримання списку складів (wares)
export function useAddresses(params: AddressQueryParams = { SearchParameter: "Query" }) {
	return useQuery({
		queryKey: ['addresses', params],
		queryFn: () => getAddresses(params),
		// staleTime: Infinity, // Дані завжди актуальні
		// gcTime: Infinity, // Дані залишаються в кеші без очищення
		refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
	});
}

// Використання useMutation для створення нового складу (ware)
export function useCreateAddress() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newAddress: AddressDTO) => postAddress(newAddress),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['addresses'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для оновлення існуючого складу (ware)
export function useUpdateAddress() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (updatedAddress: AddressDTO) => putAddress(updatedAddress),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['addresses'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для видалення складу (ware)
export function useDeleteAddress() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (id: number) => deleteAddress(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['addresses'] }); // Оновлює кеш даних після створення складу
			},
		});
}
