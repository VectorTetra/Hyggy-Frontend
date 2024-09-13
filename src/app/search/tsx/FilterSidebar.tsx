//File: FilterSidebar.tsx
import React from "react";
import { useEffect } from "react";
import { Ware } from "@/types/searchTypes";
import styles from "../css/FilterSidebar.module.css";
import useSearchStore from "@/store/search"; // Імпортуємо Zustand store
import PriceRange from "./PriceRange";
import CategoryPicker from "./CategoryPicker";
import TrademarkPicker from "./TrademarkPicker";

const FilterSidebar = React.memo(({ wares, foundWares }: { wares: Ware[], foundWares: Ware[] }) => {
	const { isSidebarOpen, setIsSidebarOpen } = useSearchStore();

	// Групуємо wares по категоріям і рахуємо кількість товарів у кожній категорії
	let categories = Object.values(
		wares.reduce((acc: any, ware: any) => {
			const categoryName = ware.category;
			if (!acc[categoryName]) {
				acc[categoryName] = { name: categoryName, count: 0 };
			}
			acc[categoryName].count += 1;
			return acc;
		}, {})
	);

	// Групуємо wares по торговим маркам і рахуємо кількість товарів у кожній торговій марці
	let trademarks = Object.values(
		wares.reduce((acc: any, ware: any) => {
			const trademarkName = ware.trademark;
			if (!acc[trademarkName]) {
				acc[trademarkName] = { name: trademarkName, count: 0 };
			}
			acc[trademarkName].count += 1;
			return acc;
		}, {})
	);


	// Прибираємо null і пусті значення з торгових марок 
	trademarks = trademarks.filter((trademark: any) => trademark.name);
	trademarks = trademarks.sort((a: any, b: any) => a.name.localeCompare(b.name));

	// Сортуємо категорії по алфавіту за іменем (назвою)
	categories = categories.sort((a: any, b: any) => a.name.localeCompare(b.name));
	console.log("categories", categories);
	const onClose = () => setIsSidebarOpen(false);

	// Використовуємо useEffect для блокування/розблокування скролу
	useEffect(() => {
		if (isSidebarOpen) {
			// Блокуємо скрол
			document.body.style.overflow = "hidden";
		} else {
			// Відновлюємо скрол
			document.body.style.overflow = "";
		}

		// Повертаємо початковий стан при розмонтуванні компонента
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
			</div>
		</>
	);
});

export default FilterSidebar;
