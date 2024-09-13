export interface Ware {
	id: number;
	shortName: string;
	longName: string;
	price: number;
	tag: string[];
	discount: number;
	deliveryOption: string;
	storeAvailability: string;
	rating: number;
	imageSrc: string;
	category: string;
	trademark: string;
}

export interface Article {
	title: string;
	keywords: string[];
}