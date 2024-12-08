import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

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
	DTOType?: string | null;
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
	ImageIds: number[] = [];
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
	wareCategory2Id: number;
	wareCategory1Id: number;
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
	wareCategory2Name: string;
	wareCategory1Name: string;
	wareItems: any[];
	totalWareItemsQuantity: number;
	totalWareItemsSum: number;
}
export class Ware2 {
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
	wareCategory2Id: number;
	wareCategory1Id: number;
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
	wareCategory2Name: string;
	wareCategory1Name: string;
	totalWareItemsQuantity: number;
	totalWareItemsSum: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SOMEE_API_WARE;
if (!API_BASE_URL) {
	console.error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_WARE in your environment variables.");
	throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_BACKEND_SOMEE_API_WARE in your environment variables.");
}

// GET запит (вже реалізований)
export async function getWares(params: WareQueryParams = { SearchParameter: "Query" }) {
	try {
		const response = await axios.get(API_BASE_URL!, {
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
		const response = await axios.post(API_BASE_URL!, Ware);
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

		const response = await axios.put(API_BASE_URL!, Ware);
		return response.data;
	} catch (error) {
		console.error('Error updating Ware:', error);
		throw new Error('Failed to update Ware');
	}
}

// DELETE запит для видалення складу за Id
export async function deleteWare(id: number) {
	try {
		const response = await axios.delete(`${API_BASE_URL!}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting Ware:', error);
		throw new Error('Failed to delete Ware');
	}
}

export async function postJsonConstructorFile(wareDetails: string | null, wareProperties: any[] | null) {
	let arrayToJSON: { type: string; value: string | any[] }[] = [];

	if (wareDetails != null) {
		const wareDetailsObj = {
			"type": "details",
			"value": wareDetails
		};
		arrayToJSON.push(wareDetailsObj);
	}

	if (wareProperties != null) {
		const warePropertiesObj = {
			"type": "properties",
			"value": wareProperties
		};
		arrayToJSON.push(warePropertiesObj);
	}

	const jsonString = JSON.stringify(arrayToJSON);
	const formData = new FormData();
	formData.append('JsonConstructorItems', jsonString);

	try {
		const response = await axios.post<string>("http://www.hyggy.somee.com/api/Ware/PostJsonConstructorFile", formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		// Повертаємо дані відповіді
		return response.data;
	} catch (error) {
		// Обробка помилки
		toast.error("Error posting JSON constructor file:", error);
		// Можна додати додаткову логіку для обробки помилок (наприклад, повідомлення користувачу)
		throw new Error("Failed to post JSON constructor file");
	}
}

export async function putJsonConstructorFile(wareDetails: string | null, wareProperties: any[] | null, oldConstructorFilePath: string) {
	let arrayToJSON: { type: string; value: string | any[] }[] = [];

	if (wareDetails != null) {
		const wareDetailsObj = {
			"type": "details",
			"value": wareDetails
		};
		arrayToJSON.push(wareDetailsObj);
	}

	if (wareProperties != null) {
		const warePropertiesObj = {
			"type": "properties",
			"value": wareProperties
		};
		arrayToJSON.push(warePropertiesObj);
	}

	const jsonString = JSON.stringify(arrayToJSON);
	const formData = new FormData();
	formData.append('oldConstructorFilePath', oldConstructorFilePath);
	formData.append('JsonConstructorItems', jsonString);

	try {
		const response = await axios.put<string>("http://www.hyggy.somee.com/api/Ware/PutJsonConstructorFile", formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		// Повертаємо дані відповіді
		return response.data;
	} catch (error) {
		// Обробка помилки
		toast.error("Error posting JSON constructor file:", error);
		// Можна додати додаткову логіку для обробки помилок (наприклад, повідомлення користувачу)
		throw new Error("Failed to post JSON constructor file");
	}
}

export async function getJsonConstructorFile(filePath: string) {
	try {
		const response = await axios.get(`${filePath}?timestamp=${new Date().getTime()}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching JSON constructor file:', error);
		throw new Error('Failed to fetch JSON constructor file');
	}
}


// Використання useQuery для отримання списку складів (wares)
export function useWares(params: WareQueryParams = { SearchParameter: "Query" }) {
	return useQuery({
		queryKey: ['wares', params],
		queryFn: () => getWares(params),
		staleTime: Infinity, // Дані завжди актуальні
		gcTime: Infinity, // Дані залишаються в кеші без очищення
		refetchOnWindowFocus: false, // Не робити рефетч при фокусуванні вікна
	});
}

// Використання useMutation для створення нового складу (ware)
export function useCreateWare() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newWare: WarePostDTO) => postWare(newWare),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wares'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для оновлення існуючого складу (ware)
export function useUpdateWare() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (newWare: WarePutDTO) => putWare(newWare),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wares'] }); // Оновлює кеш даних після створення складу
			},
		});
}

// Використання useMutation для видалення складу (ware)
export function useDeleteWare() {
	const queryClient = useQueryClient();
	return useMutation(
		{
			mutationFn: (id: number) => deleteWare(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['wares'] }); // Оновлює кеш даних після видалення складу
			},
		});
}
