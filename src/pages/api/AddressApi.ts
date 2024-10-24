import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface AddressQueryParams {
	SearchParameter: string;
	Id?: number;
	Street?: string;
	HouseNumber?: string;
	City?: string;
	State?: string;
	PostalCode?: string;
	Latitude?: number | null;
	Longitude?: number | null;
	ShopId?: number;
	StorageId?: number;
	OrderId?: number;
	PageNumber?: number;
	PageSize?: number;
	StringIds?: string;
	Sorting?: string;
	QueryAny?: string;
}

export interface AddressDTO {
	AddressId?: number;
	Id?: number;
	ShopId?: number | null;
	StorageId?: number | null;
	Street?: string;
	HouseNumber?: string;
	City?: string;
	State?: string;
	PostalCode?: string;
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
