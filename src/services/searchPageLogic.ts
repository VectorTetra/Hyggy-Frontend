// import axios from 'axios';
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { Ware, Article } from "@/types/searchTypes";
// import { translateText, spellCheck } from "@/services/searchPageApi"; // Імпортуємо API функції
// import jsonArticles from "../app/search/articles.json"; // Імпортуємо дані статей
// import { useWares, getWares, WareQueryParams } from '../pages/api/WareApi'; // Використовуємо getWares замість хуків
// import { useState, useEffect } from 'react';

// // Функція пошуку товарів та статей за ключовим запитом
// export async function searchWaresAndArticles(query: string) {
// 	const params: WareQueryParams = { SearchParameter: "Query", QueryAny: query };
// 	const foundWares = await getWares(params); // Викликаємо API для отримання товарів

// 	const foundArticles: Article[] = jsonArticles.filter((article) =>
// 		article.title.toLowerCase().includes(query.toLowerCase()) ||
// 		article.keywords.includes(query.toLowerCase())
// 	);

// 	return { foundWares, foundArticles };
// }

// export function useHandleSearch(query: string) {
// 	const [foundWares, setFoundWares] = useState<Ware[]>([]);
// 	const [foundArticles, setFoundArticles] = useState<Article[]>([]);

// 	const wareQueryParams: WareQueryParams = query
// 		? { SearchParameter: "Query", QueryAny: query }
// 		: { SearchParameter: "Query", PageNumber: 1, PageSize: 1000 };

// 	// Використання хука useWares для отримання даних товарів
// 	const { data: waresData, refetch } = useWares(wareQueryParams);

// 	useEffect(() => {
// 		const searchArticles = async () => {
// 			if (!query) {
// 				// Якщо запиту немає, повертаємо всі товари та статті
// 				setFoundArticles(jsonArticles);
// 				setFoundWares(waresData || []);
// 				return;
// 			}

// 			// Початковий пошук товарів та статей
// 			const initialArticles = jsonArticles.filter(
// 				(article) =>
// 					article.title.toLowerCase().includes(query.toLowerCase()) ||
// 					article.keywords.includes(query.toLowerCase())
// 			);

// 			setFoundArticles(initialArticles);
// 			setFoundWares(waresData || []);

// 			// Додатковий пошук за перекладеним текстом, якщо не знайдено збігів
// 			if (initialArticles.length === 0 && (waresData?.length || 0) === 0) {
// 				const translatedText = await translateText(query, 'uk');
// 				const translatedArticles = jsonArticles.filter(
// 					(article) =>
// 						article.title.toLowerCase().includes(translatedText.toLowerCase()) ||
// 						article.keywords.includes(translatedText.toLowerCase())
// 				);

// 				setFoundArticles(translatedArticles);
// 				refetch(); // Оновлюємо запит з новими параметрами
// 			}

// 			// Додатковий пошук за коректованим текстом, якщо все ще немає збігів
// 			if (initialArticles.length === 0 && (waresData?.length || 0) === 0) {
// 				const correctedResults = await spellCheck(query);

// 				let additionalArticles: Article[] = [];
// 				let additionalWares: Ware[] = [];

// 				for (const item of correctedResults) {
// 					const correctedArticles = jsonArticles.filter(
// 						(article) =>
// 							article.title.toLowerCase().includes(item.toLowerCase()) ||
// 							article.keywords.includes(item.toLowerCase())
// 					);
// 					additionalArticles = [...additionalArticles, ...correctedArticles];
// 				}

// 				setFoundArticles((prev) => [...prev, ...additionalArticles]);
// 				refetch(); // Повторний запит на сервер
// 			}
// 		};

// 		searchArticles();
// 	}, [query, waresData, refetch]);

// 	return { foundWares, foundArticles };
// }

// // Функція для сортування масиву перед порівнянням
// export function sortWares(wares: Ware[], sorting: string = "default"): Ware[] {
// 	return wares.slice().sort((a, b) => {
// 		switch (sorting) {
// 			case "rating_desc":
// 				return (b.averageRating ?? 0) - (a.averageRating ?? 0); // Highest rating first
// 			case "price_asc":
// 				return a.price - b.price; // Lowest price first
// 			case "price_desc":
// 				return b.price - a.price; // Highest price first
// 			case "alphabet_asc":
// 				return a.name.localeCompare(b.name); // Alphabetical A-Z
// 			case "alphabet_desc":
// 				return b.name.localeCompare(a.name); // Alphabetical Z-A
// 			default:
// 				return a.id - b.id; // Default sorting by ID
// 		}
// 	});
// }
