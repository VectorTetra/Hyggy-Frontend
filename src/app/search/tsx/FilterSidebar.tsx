// File: FilterSidebar.tsx
import React from "react";
import { useEffect } from "react";
import { Ware } from "@/types/searchTypes";
import styles from "../css/FilterSidebar.module.css";
import useSearchStore from "@/store/search"; // Імпортуємо Zustand store
import PriceRange from "./PriceRange";
import CategoryPicker from "./CategoryPicker";
import TrademarkPicker from "./TrademarkPicker";
import StatusPicker from "./StatusPicker";

const FilterSidebar = React.memo(({ wares, foundWares }: { wares: Ware[], foundWares: Ware[] }) => {
	const { isSidebarOpen, setIsSidebarOpen } = useSearchStore();

	// Групуємо wares по категоріям і рахуємо кількість товарів у кожній категорії
	type Category = {
		name: string;
		count: number;
		isDisabled?: boolean;
	};

	let categories: Category[] = Object.values(
		wares.reduce((acc: Record<string, Category>, ware: Ware) => {
			const categoryName = ware.category;
			if (!acc[categoryName]) {
				acc[categoryName] = { name: categoryName, count: 0 };
			}
			acc[categoryName].count += 1;
			return acc;
		}, {})
	);

	// Групуємо wares по торговим маркам
	type Trademark = {
		name: string;
		count: number;
		isDisabled?: boolean;
	};

	let trademarks: Trademark[] = Object.values(
		wares.reduce((acc: Record<string, Trademark>, ware: Ware) => {
			const trademarkName = ware.trademark;
			if (!acc[trademarkName]) {
				acc[trademarkName] = { name: trademarkName, count: 0 };
			}
			return acc;
		}, {})
	);

	// Групуємо wares по статусам
	type Status = {
		name: string;
		count: number;
		isDisabled?: boolean;
	};

	let statuses: Status[] = Object.values(
		wares.reduce((acc: Record<string, Status>, ware: Ware) => {
			ware.tag.forEach((statusName: string) => {
				if (!acc[statusName]) {
					acc[statusName] = { name: statusName, count: 0 };
				}
				//acc[statusName].count += 1;
			});
			return acc;
		}, {})
	);


	// Оновлюємо кількість і стан доступності для торгових марок і статусів
	foundWares.forEach((ware: Ware) => {
		const trademark = trademarks.find((trademark: any) => trademark.name === ware.trademark);
		if (trademark) {
			trademark.count = (trademark.count || 0) + 1;
			trademark.isDisabled = false;
		}

		ware.tag.forEach((statusName: string) => {
			const status = statuses.find((status: any) => status.name === statusName);
			if (status) {
				status.count = (status.count || 0) + 1;
				status.isDisabled = false;
			}
		});
	});

	// Прибираємо пусті та null значення з торгових марок і статусів
	trademarks = trademarks.filter((trademark: any) => trademark.name);
	trademarks = trademarks.sort((a: any, b: any) => a.name.localeCompare(b.name));

	statuses = statuses.filter((status: any) => status.name);
	statuses = statuses.sort((a: any, b: any) => a.name.localeCompare(b.name));

	// Сортуємо категорії по алфавіту за іменем (назвою)
	categories = categories.sort((a: any, b: any) => a.name.localeCompare(b.name));
	console.log("categories", categories);

	const onClose = () => setIsSidebarOpen(false);

	// Використовуємо useEffect для блокування/розблокування скролу
	useEffect(() => {
		if (isSidebarOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isSidebarOpen]);

	return (
		<>
			<div
				className={`${styles.backdrop} ${isSidebarOpen ? styles.open : ""}`}
				onClick={onClose}
			></div>
			<div
				className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}
			>
				<h2 className={styles.sidebarHeader}>Фільтри</h2>
				<hr className={styles.sidebarHr} />
				<PriceRange />
				<hr className={styles.sidebarHr} />
				<CategoryPicker categories={categories} />
				<hr className={styles.sidebarHr} />
				<TrademarkPicker trademarks={trademarks} />
				<hr className={styles.sidebarHr} />
				<StatusPicker statuses={statuses} />
				<hr className={styles.sidebarHr} />
			</div>
		</>
	);
});

export default FilterSidebar;
