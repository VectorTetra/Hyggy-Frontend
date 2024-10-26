import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

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
	AddressId?: number;
	Id?: number;
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
