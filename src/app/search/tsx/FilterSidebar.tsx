import { useEffect } from "react";
import { FC } from "react";
import styles from "../css/FilterSidebar.module.css";
import useSearchStore from "@/store/search"; // Імпортуємо Zustand store
import PriceRange from "./PriceRange";

const FilterSidebar: FC = () => {
	const { isSidebarOpen, setIsSidebarOpen, selectedFilters, removeFilter } = useSearchStore();

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
			</div>
		</>
	);
};

export default FilterSidebar;
