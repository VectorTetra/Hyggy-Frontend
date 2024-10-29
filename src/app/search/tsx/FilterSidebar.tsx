// File: FilterSidebar.tsx
import React from "react";
import { useEffect } from "react";
import { Ware } from "@/pages/api/WareApi";
import styles from "../css/FilterSidebar.module.css";
import useSearchStore from "@/store/search"; // Імпортуємо Zustand store
import PriceRange from "./PriceRange";
import CategoryPicker from "./CategoryPicker";
import TrademarkPicker from "./TrademarkPicker";
import StatusPicker from "./StatusPicker";
import SaleCheckbox from "./SaleCheckbox";
import SidebarButtonBar from "./SidebarButtonBar";
import { WareCategory3 } from "@/pages/api/WareCategory3Api";

const FilterSidebar = (({ wares, foundWares, categories }: { wares: Ware[], foundWares: Ware[], categories: WareCategory3[] }) => {
	const { isSidebarOpen, setIsSidebarOpen, setCategoriesMap, setTrademarksMap, setStatusesMap } = useSearchStore();



	// Групуємо wares по категоріям і рахуємо кількість товарів у кожній категорії
	type Category = {
		id: number;
		name: string;
		count: number;
		isDisabled?: boolean;
	};

	// Групуємо wares по категоріям та рахуємо кількість товарів у кожній категорії
	let filterSidebarCategories = categories.map(category => {
		const count = wares.filter(ware => ware.wareCategory3Id === category.id).length;
		return {
			id: category.id,
			name: category.name,
			count: count
		};
	});
	filterSidebarCategories = filterSidebarCategories.filter(fsc => fsc.count > 0);

	// Групуємо wares по торговим маркам
	type Trademark = {
		id: number | null;
		name: string;
		count: number;
		isDisabled?: boolean;
	};

	let trademarks: Trademark[] = Object.values(
		wares.reduce((acc: Record<string, Trademark>, ware: Ware) => {
			const trademarkName = ware.trademarkName;
			const trademarkId = ware.trademarkId;
			if (trademarkName && !acc[trademarkName]) {
				acc[trademarkName] = { id: trademarkId, name: trademarkName, count: 0 };
			}
			return acc;
		}, {})
	);

	// Групуємо wares по статусам
	type Status = {
		id: number;
		name: string;
		count: number;
		isDisabled?: boolean;
	};

	let statuses: Status[] = Object.values(
		wares.reduce((acc: Record<string, Status>, ware: Ware) => {
			ware.statusNames.forEach((statusName: string, index) => {
				if (!acc[statusName]) {
					acc[statusName] = { id: ware.statusIds[index], name: statusName, count: 0 };
				}
			});
			return acc;
		}, {})
	);


	// Оновлюємо кількість і стан доступності для торгових марок і статусів
	foundWares.forEach((ware: Ware) => {
		const trademark = trademarks.find((trademark: any) => trademark.name === ware.trademarkName);
		if (trademark) {
			trademark.count = (trademark.count || 0) + 1;
			trademark.isDisabled = false;
		}

		ware.statusNames.forEach((statusName: string) => {
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
	filterSidebarCategories = filterSidebarCategories.sort((a: any, b: any) => a.name.localeCompare(b.name));
	console.log("filterSidebarCategories", filterSidebarCategories);

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
				<CategoryPicker categories={filterSidebarCategories} />
				<hr className={styles.sidebarHr} />
				<TrademarkPicker trademarks={trademarks} />
				<hr className={styles.sidebarHr} />
				<StatusPicker statuses={statuses} />
				<hr className={styles.sidebarHr} />
				<SaleCheckbox />
				<hr className={styles.sidebarHr} />

				<SidebarButtonBar />
			</div>
		</>
	);
});

export default FilterSidebar;
