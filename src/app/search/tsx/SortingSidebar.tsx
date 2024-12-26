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
	// Встановлюємо "Найкращий відгук" за замовчуванням, якщо значення не задано
    useEffect(() => {
        if (!sort) {
            setSort("Rating", { history: "replace", scroll: false });
        }
    }, [sort, setSort]);
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
						id="Rating"
						value="Rating"
						checked={sort === "Rating"} // Перевірка для активного радіобокса
						onChange={() => setSort("Rating", { history: "replace", scroll: false })} // Зміна стану при зміні радіобокса
					/>
					<label htmlFor="Rating">Найкращий відгук</label>
				</div>
				<div className={styles.sortingSidebarContent}>
					<input
						type="radio"
						name="sorting"
						id="PriceAsc"
						value="PriceAsc"
						checked={sort === "PriceAsc"}
						onChange={() => setSort("PriceAsc", { history: "replace", scroll: false })}
					/>
					<label htmlFor="PriceAsc">Найменша ціна</label>
				</div>
				<div className={styles.sortingSidebarContent}>
					<input
						type="radio"
						name="sorting"
						id="PriceDesc"
						value="PriceDesc"
						checked={sort === "PriceDesc"}
						onChange={() => setSort("PriceDesc", { history: "replace", scroll: false })}
					/>
					<label htmlFor="PriceDesc">Найбільша ціна</label>
				</div>
				<div className={styles.sortingSidebarContent}>
					<input
						type="radio"
						name="sorting"
						id="NameAsc"
						value="NameAsc"
						checked={sort === "NameAsc"}
						onChange={() => setSort("NameAsc", { history: "replace", scroll: false })}
					/>
					<label htmlFor="NameAsc">За алфавітом (А-Я)</label>
				</div>
				<div className={styles.sortingSidebarContent}>
					<input
						type="radio"
						name="sorting"
						id="NameDesc"
						value="NameDesc"
						checked={sort === "NameDesc"}
						onChange={() => setSort("NameDesc", { history: "replace", scroll: false })}
					/>
					<label htmlFor="NameDesc">За алфавітом (Я-А)</label>
				</div>
				<SidebarButtonBar />
			</div>
		</>
	);
}
