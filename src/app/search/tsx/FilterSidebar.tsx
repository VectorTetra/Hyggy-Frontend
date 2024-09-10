import { useEffect } from "react";
import styles from "../css/FilterSidebar.module.css";
import useSearchStore from "@/store/search"; // Імпортуємо Zustand store
import PriceRange from "./PriceRange";
import CategoryPicker from "./CategoryPicker";

function FilterSidebar(props: any) {
	const { isSidebarOpen, setIsSidebarOpen, selectedFilters, removeFilter } = useSearchStore();

	// Групуємо wares по категоріям і рахуємо кількість товарів у кожній категорії
	let categories = Object.values(
		props.wares.reduce((acc: any, ware: any) => {
			const categoryName = ware.category;
			if (!acc[categoryName]) {
				acc[categoryName] = { name: categoryName, count: 0 };
			}
			acc[categoryName].count += 1;
			return acc;
		}, {})
	);

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
			</div>
		</>
	);
};

export default FilterSidebar;
