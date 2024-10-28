export interface Ware {
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
export interface Article {
	title: string;
	keywords: string[];
}