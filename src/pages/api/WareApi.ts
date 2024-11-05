import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export class WareQueryParams {
	SearchParameter: string = "Query";
	PageNumber?: number | null;
	PageSize?: number | null;
	Id?: number | null;
	Article?: number | null;
	Category1Id?: number | null;
	Category2Id?: number | null;
	Category3Id?: number | null;
	NameSubstring?: string | null;
	DescriptionSubstring?: string | null;
	Category1NameSubstring?: string | null;
	Category2NameSubstring?: string | null;
	Category3NameSubstring?: string | null;
	TrademarkId?: number | null;
	TrademarkNameSubstring?: string | null;
	MinPrice?: number | null;
	MaxPrice?: number | null;
	MinDiscount?: number | null;
	MaxDiscount?: number | null;
	IsDeliveryAvailable?: boolean | null;
	StatusId?: number | null;
	StatusName?: string | null;
	StatusDescription?: string | null;
	CustomerId?: string | null;
	ImagePath?: string | null;
	Sorting?: string | null;
	StringIds?: string | null;
	StringTrademarkIds?: string | null;
	StringStatusIds?: string | null;
	StringCategory1Ids?: string | null;
	StringCategory2Ids?: string | null;
	StringCategory3Ids?: string | null;
	QueryAny?: string | null;
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
export class Ware {
	id: number;
	article: number;
	name: string;
	description: string;
	structureFilePath: string;
	price: number;
	discount: number;
	finalPrice: number;
	isDeliveryAvailable: boolean;
	wareCategory3Id: number;
	statusIds: number[];
	imageIds: number[];
	priceHistoryIds: number[];
	wareItemIds: number[];
	orderItemIds: number[];
	reviewIds: number[];
	trademarkId: number | null;
	averageRating: number;
	previewImagePath: string;
	customerFavoriteIds: string[];
	statusNames: string[];
	imagePaths: string[];
	trademarkName: string;
	wareCategory3Name: string;
	wareItems: any[];
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
		staleTime: Infinity, // Дані залишаються актуальними завжди
		cacheTime: Infinity, // Дані залишаються в кеші без очищення
		refetchOnWindowFocus: false,
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
