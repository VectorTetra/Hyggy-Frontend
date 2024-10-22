import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface StorageQueryParams {
	SearchParameter?: string | "Query";
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

export async function getStorages(params: StorageQueryParams = {}) {
	try {
		const response = await axios.get('http://www.hyggy.somee.com/api/Storage', {
			params,
		});

		return response.data;
	} catch (error) {
		console.error('Error fetching shops:', error);
		throw new Error('Failed to fetch shops');
	}
}
