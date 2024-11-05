// File: StatusPicker.tsx
import useSearchStore from "@/store/search";
import { parseAsArrayOf, parseAsJson, useQueryState } from 'nuqs';
import styles from "../css/StatusPicker.module.css";
interface Filter {
	id: string; // або number, в залежності від типу вашого id
	name: string;
}

function StatusPicker(props: any) {
	const { isStatusOpen, setIsStatusOpen } = useSearchStore();
	const [filters, setFilters] = useQueryState<Filter[] | null>("f_3", parseAsArrayOf(parseAsJson()));

	const onChange = (e: any) => {
		const value = e.target.value;
		const currentFilters: Filter[] = filters || []; // Змінюємо на масив

		if (e.target.checked) {
			// Додаємо новий фільтр
			const newFilter: Filter = { id: value, name: props.statuses.find(c => c.id === Number(value))?.name };
			console.log("newStatus", newFilter);
			setFilters([...currentFilters, newFilter], { history: "replace" });
		} else {
			// Видаляємо фільтр
			const updatedFilters = currentFilters.filter((filter: Filter) => filter.id !== value);
			setFilters(updatedFilters.length === 0 ? null : updatedFilters, { history: "replace" });
		}
	};

	return (
		<div className={styles.container}>
			<h2 onClick={() => setIsStatusOpen(!isStatusOpen)} className={styles.header}>
				Спец. пропозиції
			</h2>
			<div className={isStatusOpen ? styles.statusOpen : styles.statusClosed}>
				{props.statuses.map((status: any, index: any) => (
					<div key={index} className={styles.statusItem}>
						<span className={styles.statusName}>{status.name}</span>
						<div>
							<span className={styles.statusCount}>{status.count}</span>
							<input
								type="checkbox"
								className={styles.checkbox}
								value={status.id}
								onChange={onChange}
								checked={filters !== null && filters?.some((filter: Filter) => Number(filter.id) === status.id)} // Перевірка, чи фільтр вибраний
								disabled={status.count === 0}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default StatusPicker;
