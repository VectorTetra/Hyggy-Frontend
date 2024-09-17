import React, { useEffect } from "react";
import styles from "../css/SortingSidebar.module.css";
import filterStyles from "../css/FilterSidebar.module.css";

import { useQueryState } from 'nuqs';
import useSearchStore from "@/store/search"; // Імпортуємо Zustand store
import SidebarButtonBar from "./SidebarButtonBar";

export default function SortingSidebar(props: any) {
	const { isSortingSidebarOpen, setIsSortingSidebarOpen } = useSearchStore();
	const [sort, setSort] = useQueryState('sort', { scroll: false });
	// Використовуємо useEffect для блокування/розблокування скролу
	useEffect(() => {
		if (isSortingSidebarOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isSortingSidebarOpen]);
	return (
		<>
			<div
				className={`${styles.backdrop} ${isSortingSidebarOpen ? styles.open : ""}`}
				onClick={() => setIsSortingSidebarOpen(false)}
			></div>
			<div className={`${styles.sidebar} ${isSortingSidebarOpen ? styles.open : ""}`}>
				<div>
					<h2 className={filterStyles.sidebarHeader}>Сортування</h2>
					<hr className={filterStyles.sidebarHr} />
				</div>
				<div className={styles.sortingSidebarContent}>
					<input
						type="radio"
						name="sorting"
						id="rating_desc"
						value="rating_desc"
						checked={sort === "rating_desc"} // Перевірка для активного радіобокса
						onChange={() => setSort("rating_desc")}
					/>
					<label htmlFor="rating_desc">Найкращий відгук</label>
				</div>
				<div className={styles.sortingSidebarContent}>
					<input
						type="radio"
						name="sorting"
						id="price_asc"
						value="price_asc"
						checked={sort === "price_asc"}
						onChange={() => setSort("price_asc")}
					/>
					<label htmlFor="price_asc">Найменша ціна</label>
				</div>
				<div className={styles.sortingSidebarContent}>
					<input
						type="radio"
						name="sorting"
						id="price_desc"
						value="price_desc"
						checked={sort === "price_desc"}
						onChange={() => setSort("price_desc")}
					/>
					<label htmlFor="price_desc">Найбільша ціна</label>
				</div>
				<div className={styles.sortingSidebarContent}>
					<input
						type="radio"
						name="sorting"
						id="alphabet_asc"
						value="alphabet_asc"
						checked={sort === "alphabet_asc"}
						onChange={() => setSort("alphabet_asc")}
					/>
					<label htmlFor="alphabet_asc">За алфавітом (А-Я)</label>
				</div>
				<div className={styles.sortingSidebarContent}>
					<input
						type="radio"
						name="sorting"
						id="alphabet_desc"
						value="alphabet_desc"
						checked={sort === "alphabet_desc"}
						onChange={() => setSort("alphabet_desc")}
					/>
					<label htmlFor="alphabet_desc">За алфавітом (Я-А)</label>
				</div>
				<SidebarButtonBar />
			</div>
		</>
	);
}
