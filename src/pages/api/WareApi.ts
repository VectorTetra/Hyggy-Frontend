import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export class WareQueryParams {
	SearchParameter: string = "Query";
	PageNumber?: number;
	PageSize?: number;
	Id?: number;
	Article?: number;
	Category1Id?: number;
	Category2Id?: number;
	Category3Id?: number;
	NameSubstring?: string;
	DescriptionSubstring?: string;
	Category1NameSubstring?: string;
	Category2NameSubstring?: string;
	Category3NameSubstring?: string;
	TrademarkId?: number;
	TrademarkNameSubstring?: string;
	MinPrice?: number;
	MaxPrice?: number;
	MinDiscount?: number;
	MaxDiscount?: number;
	IsDeliveryAvailable?: boolean;
	StatusId?: number;
	StatusName?: string;
	StatusDescription?: string;
	CustomerId?: string;
	ImagePath?: string;
	Sorting?: string;
	StringIds?: string;
	StringTrademarkIds?: string;
	StringStatusIds?: string;
	StringCategory1Ids?: string;
	StringCategory2Ids?: string;
	StringCategory3Ids?: string;
	QueryAny?: string;
}

export class WarePostDTO {
	Article: number;
	Name: string;
	Description: string;
	StructureFilePath?: string;
	Price: number;
	Discount?: number;
	IsDeliveryAvailable: boolean;
	WareCategory3Id: number;
	StatusIds?: number[];
	//PriceHistoryIds: number[];
	//WareItemIds: number[];
	//OrderItemIds: number[];
	//ReviewIds: number[];
	TrademarkId: number | null;
	//CustomerFavoriteIds: string[];
}
export class WarePutDTO {
	Id: number;
	Article: number;
	Name: string;
	Description: string;
	StructureFilePath?: string;
	Price: number;
	Discount?: number;
	IsDeliveryAvailable: boolean;
	WareCategory3Id: number;
	StatusIds?: number[] = [];
	PriceHistoryIds: number[] = [];
	WareItemIds: number[] = [];
	OrderItemIds: number[] = [];
	ReviewIds: number[] = [];
	TrademarkId: number | null;
	CustomerFavoriteIds: string[] = [];
}

// GET запит (вже реалізований)
export async function getWares(params: WareQueryParams = { SearchParameter: "Query" }) {
	try {
		const response = await axios.get('http://www.hyggy.somee.com/api/Ware', {
			params,
		});

		return response.data;
	} catch (error) {
		console.error('Error fetching Wares:', error);
		throw new Error('Failed to fetch Wares');
	}
}

// POST запит для створення нового складу
export async function postWare(Ware: WarePostDTO) {
	try {
		const response = await axios.post('http://www.hyggy.somee.com/api/Ware', Ware);
		return response.data;
	} catch (error) {
		console.error('Error creating Ware:', error);
		throw new Error('Failed to create Ware');
	}
}

// PUT запит для оновлення існуючого складу
export async function putWare(Ware: WarePutDTO) {
	try {
		if (!Ware.Id) {
			throw new Error('Id is required for updating a Ware');
		}

		const response = await axios.put(`http://www.hyggy.somee.com/api/Ware`, Ware);
		return response.data;
	} catch (error) {
		console.error('Error updating Ware:', error);
		throw new Error('Failed to update Ware');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteWare(id: number) {
	try {
		const response = await axios.delete(`http://www.hyggy.somee.com/api/Ware/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting Ware:', error);
		throw new Error('Failed to delete Ware');
	}
}

// Використання useQuery для отримання списку складів (wares)
export function useWares(params: WareQueryParams = { SearchParameter: "Query" }) {
	return useQuery(['wares', params], () => getWares(params), {
		staleTime: 5000, // Дані залишаються свіжими протягом 5 секунд
		cacheTime: 10000, // Дані залишаються в кеші протягом 10 секунд після того, як стають неактуальними
		refetchOnWindowFocus: false, // Не рефетчити при фокусуванні вікна
	});
}

// Використання useMutation для створення нового складу (ware)
export function useCreateWare() {
	const queryClient = useQueryClient();
	return useMutation((newWare: WarePostDTO) => postWare(newWare), {
		onSuccess: () => {
			queryClient.invalidateQueries('wares'); // Оновлює кеш даних після створення нового складу
		},
	});
}

// Використання useMutation для оновлення існуючого складу (ware)
export function useUpdateWare() {
	const queryClient = useQueryClient();
	return useMutation((updatedWare: WarePutDTO) => putWare(updatedWare), {
		onSuccess: () => {
			queryClient.invalidateQueries('wares'); // Оновлює кеш даних після оновлення складу
		},
	});
}

// Використання useMutation для видалення складу (ware)
export function useDeleteWare() {
	const queryClient = useQueryClient();
	return useMutation((id: number) => deleteWare(id), {
		onSuccess: () => {
			queryClient.invalidateQueries('wares'); // Оновлює кеш даних після видалення складу
		},
	});
}
