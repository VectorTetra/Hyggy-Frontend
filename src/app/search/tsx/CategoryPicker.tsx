// File: CategoryPicker.tsx
import useSearchStore from "@/store/search";
import { parseAsArrayOf, parseAsJson, useQueryState } from 'nuqs';
import styles from "../css/CategoryPicker.module.css";
import SidebarBlockHeader from "@/app/sharedComponents/SidebarBlockHeader";
import { Checkbox } from "@mui/material";

interface Filter {
	id: string; // або number, в залежності від типу вашого id
	name: string;
}

function CategoryPicker(props: any) {
	const { isCategoryOpen, setIsCategoryOpen } = useSearchStore();
	const [filters, setFilters] = useQueryState<Filter[] | null>("f_1", parseAsArrayOf(parseAsJson()));

	const onChange = (e: any) => {
		const value = e.target.value;
		const currentFilters: Filter[] = filters || []; // Змінюємо на масив

		if (e.target.checked) {
			// Додаємо новий фільтр
			const newFilter: Filter = { id: value, name: props.categories.find(c => c.id === Number(value))?.name };
			console.log("newCategory", newFilter);
			setFilters([...currentFilters, newFilter], { history: "replace" });
		} else {
			// Видаляємо фільтр
			const updatedFilters = currentFilters.filter((filter: Filter) => filter.id !== value);
			setFilters(updatedFilters.length === 0 ? null : updatedFilters, { history: "replace" });
		}
	};

	return (
		<div className={styles.container}>
			<SidebarBlockHeader title="Категорія" setIsSidebarBlockOpen={setIsCategoryOpen} isSidebarBlockOpen={isCategoryOpen} />
			<div className={isCategoryOpen ? styles.categoryOpen : styles.categoryClosed}>
				{props.categories.map((category: any, index: any) => (
					<div key={index} className={styles.categoryItem}>
						<span className={styles.categoryName} style={{ opacity: category.isDisabled ? "0.5" : "1" }}>{category.name}</span>
						<div>
							<span className={styles.categoryCount}>{category.count}</span>
							<Checkbox
								sx={{
								marginLeft: '10px',
								padding: '0px',
								color: '#00AAAD',
								'&.Mui-checked': {
									color: '#00AAAD',
								},
								}}
								size="small"
								value={category.id}
								onChange={onChange}
								checked={filters !== null && filters?.some((filter: Filter) => Number(filter.id) === category.id)} // Перевірка, чи фільтр вибраний
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