// File: CategoryPicker.tsx
import useSearchStore from "@/store/search";
import { useQueryState } from 'nuqs';
import styles from "../css/CategoryPicker.module.css";

function CategoryPicker(props: any) {
	const { isCategoryOpen, setIsCategoryOpen } = useSearchStore();
	const [filters, setFilters] = useQueryState("f_1", { scroll: false });

	const onChange = (e: any) => {
		const value = e.target.value;
		const currentFilters = (filters || "").split("|").filter(Boolean);

		if (e.target.checked) {
			// Add new filter
			setFilters([...currentFilters, value].join("|"), { history: "replace" });
		} else {
			// Remove filter
			const updatedFilters = currentFilters.filter((filter: any) => filter !== value);
			if (updatedFilters.length === 0) {
				// Remove the parameter if no filters
				setFilters(null, { history: "replace" });
			} else {
				// Update parameter with new filters
				setFilters(updatedFilters.join("|"), { history: "replace" });
			}
		}
	};

	return (
		<div className={styles.container}>
			<h2 onClick={() => setIsCategoryOpen(!isCategoryOpen)} className={styles.header}>
				Категорія
			</h2>
			<div className={isCategoryOpen ? styles.categoryOpen : styles.categoryClosed}>
				{props.categories.map((category: any, index: any) => (
					<div key={index} className={styles.categoryItem}>
						<span className={styles.categoryName} style={{ opacity: category.isDisabled ? "0.5" : "1" }}>{category.name}</span>
						<div>
							<span className={styles.categoryCount}>{category.count}</span>
							<input
								type="checkbox"
								className={styles.checkbox}
								value={category.name}
								onChange={onChange}
								checked={(filters || "").split("|").includes(category.name)}
								disabled={category.isDisabled}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default CategoryPicker;
