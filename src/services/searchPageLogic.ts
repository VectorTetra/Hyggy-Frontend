import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Ware, Article } from "@/types/searchTypes";
import { translateText, spellCheck } from "@/services/searchPageApi"; // Імпортуємо API функції
import jsonWares from "../app/search/wares.json"; // Імпортуємо дані товарів
import jsonArticles from "../app/search/articles.json"; // Імпортуємо дані статей
import { getWares, WareQueryParams } from '../pages/api/WareApi'; // Використовуємо getWares замість хуків
import { useState } from "react";

// Функція пошуку товарів та статей за ключовим запитом
export async function searchWaresAndArticles(query: string) {
	const params: WareQueryParams = { SearchParameter: "Query", QueryAny: query };
	const foundWares = await getWares(params); // Викликаємо API для отримання товарів

	const foundArticles: Article[] = jsonArticles.filter((article) =>
		article.title.toLowerCase().includes(query.toLowerCase()) ||
		article.keywords.includes(query.toLowerCase())
	);

	return { foundWares, foundArticles };
}

// Основна логіка пошуку
export async function handleSearch(query: string): Promise<{
	foundWares: Ware[];
	foundArticles: Article[];
}> {
	let foundWares: Ware[] = [];
	let foundArticles: Article[] = [];

	if (!query) {
		const params: WareQueryParams = { SearchParameter: "Query", PageNumber: 1, PageSize: 1000 };
		foundWares = await getWares(params); // Викликаємо API для отримання всіх товарів
		foundArticles = jsonArticles; // Використовуємо всі статті
	} else {
		const initialResults = await searchWaresAndArticles(query);
		foundWares = [...initialResults.foundWares];
		foundArticles = [...initialResults.foundArticles];

		if (foundWares.length === 0 && foundArticles.length === 0) {
			const translatedText = await translateText(query, "uk");
			const translatedResults = await searchWaresAndArticles(translatedText);
			foundWares = translatedResults.foundWares;
			foundArticles = translatedResults.foundArticles;
		}

		if (foundWares.length === 0 && foundArticles.length === 0) {
			const correctedResults = await spellCheck(query);
			let additionalWares: Ware[] = [];
			let additionalArticles: Article[] = [];

			for (const item of correctedResults) {
				const iteratedResults = await searchWaresAndArticles(item);
				additionalWares = [...additionalWares, ...iteratedResults.foundWares];
				additionalArticles = [...additionalArticles, ...iteratedResults.foundArticles];
			}

			foundWares = [...foundWares, ...additionalWares];
			foundArticles = [...foundArticles, ...additionalArticles];
		}

		// Видалення дублікатів
		foundWares = Array.from(new Set(foundWares.map((item) => item.id)))
			.map((id) => foundWares.find((item) => item.id === id)!);

		foundArticles = Array.from(new Set(foundArticles.map((item) => item.title)))
			.map((title) => foundArticles.find((item) => item.title === title)!);
	}

	return { foundWares, foundArticles };
}

// Функція для сортування масиву перед порівнянням
export function sortWares(wares: Ware[], sorting: string = "default"): Ware[] {
	return wares.slice().sort((a, b) => {
		switch (sorting) {
			case "rating_desc":
				return (b.averageRating ?? 0) - (a.averageRating ?? 0); // Highest rating first
			case "price_asc":
				return a.price - b.price; // Lowest price first
			case "price_desc":
				return b.price - a.price; // Highest price first
			case "alphabet_asc":
				return a.name.localeCompare(b.name); // Alphabetical A-Z
			case "alphabet_desc":
				return b.name.localeCompare(a.name); // Alphabetical Z-A
			default:
				return a.id - b.id; // Default sorting by ID
		}
	});
}
