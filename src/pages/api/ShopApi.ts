// import axios from 'axios';
// import type { NextApiRequest, NextApiResponse } from 'next';

// export async function getShops(pageNumber: number = 1, pageSize: number = 1000, searchParameter: string = 'Query') {
//   try {
//     const response = await axios.get('http://localhost:5263/api/Shop', {
//       params: {
//         SearchParameter: searchParameter,
//         PageNumber: pageNumber,
//         PageSize: pageSize,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error('Error fetching shops:', error);
//     throw new Error('Failed to fetch shops');
//   }
// }

// export async function CreateShop(name: string, photoUrl: string, workHours: string, addressId: number, storageId: number ) {
//   try {
//     const response = await axios.post('http://localhost:5263/api/Shop', {
//         Name: name,
//         PhotoUrl: photoUrl,
//         WorkHours: workHours,
//         AddressId: addressId,
//         StorageId: storageId
//     });

//     return response.data;
//   } catch (error) {
//     console.error('Error fetching shops:', error);
//     throw new Error('Failed to fetch shops');
//   }
// }

import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface ShopQueryParams {
	SearchParameter?: "Query";
	Id?: number;
	AddressId?: number;
	Street?: string;
	HouseNumber?: string;
	City?: string;
	Name?: string;
	State?: string;
	PostalCode?: string;
  Latitude?:number;
  Longitude?:number;
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
	Name?: string ;
	WorkHours?: string ;
	PhotoUrl?: string ;
	OrderIds?: number[] | null;
	ShopEmployeeIds?: string[] | null;
}

// GET запит (вже реалізований)
export async function getShops(params: ShopQueryParams = {}) {
	try {
		const response = await axios.get('http://www.hyggy.somee.com/api/Shop', {
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
		const response = await axios.post('http://www.hyggy.somee.com/api/Shop', Shop);
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

		const response = await axios.put(`http://www.hyggy.somee.com/api/Shop`, Shop);
		return response.data;
	} catch (error) {
		console.error('Error updating Shop:', error);
		throw new Error('Failed to update Shop');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteShop(id: number) {
	try {
		const response = await axios.delete(`http://www.hyggy.somee.com/api/Shop/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting Shop:', error);
		throw new Error('Failed to delete Shop');
	}
}
