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
import { WareTrademark } from "@/pages/api/WareTrademarkApi";
import { WareStatus } from "@/pages/api/WareStatusApi";

const FilterSidebar = (({ wares, foundWares, categories, trademarks, statuses }: {
	wares: Ware[], foundWares: Ware[],
	categories: WareCategory3[], trademarks: WareTrademark[], statuses: WareStatus[]
}) => {
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

	let filterSidebarTrademarks = trademarks.map(trademark => {
		const count = wares.filter(ware => ware.trademarkId === trademark.id).length;
		return {
			id: trademark.id,
			name: trademark.name,
			count: count
		};
	});
	filterSidebarTrademarks = filterSidebarTrademarks.filter(fsc => fsc.count > 0);

	// Групуємо wares по статусам
	type Status = {
		id: number;
		name: string;
		count: number;
		isDisabled?: boolean;
	};

	let filterSidebarStatuses = statuses.map(status => {
		const count = wares.filter(ware => ware.statusIds.includes(status.id)).length;
		return {
			id: status.id,
			name: status.name,
			count: count
		};
	});
	filterSidebarStatuses = filterSidebarStatuses.filter(fsc => fsc.count > 0);

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
			<div className={`${styles.backdrop} ${isSidebarOpen ? styles.open : ""}`}
				onClick={onClose}
			></div>
			<div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
				<h2 className={styles.sidebarHeader}>Фільтри</h2>
				<div className={styles.sidebarFilters}>
					<hr className={styles.sidebarHr} />
					<PriceRange />
					<hr className={styles.sidebarHr} />
					<CategoryPicker categories={filterSidebarCategories} />
					<hr className={styles.sidebarHr} />
					<TrademarkPicker trademarks={filterSidebarTrademarks} />
					<hr className={styles.sidebarHr} />
					<StatusPicker statuses={filterSidebarStatuses} />
					<hr className={styles.sidebarHr} />
					<SaleCheckbox />
					<hr className={styles.sidebarHr} />
				</div>
				<SidebarButtonBar />
			</div>
		</>
	);
});

export default FilterSidebar;
