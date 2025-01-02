// File: TrademarkPicker.tsx

import useSearchStore from "@/store/search";
import { parseAsArrayOf, parseAsJson, useQueryState } from 'nuqs';
import styles from "../css/TrademarkPicker.module.css";
import SidebarBlockHeader from "@/app/sharedComponents/SidebarBlockHeader";
import { Checkbox } from "@mui/material";
interface Filter {
	id: string; // або number, в залежності від типу вашого id
	name: string;
}

function TrademarkPicker(props: any) {
	const { isTrademarksOpen, setIsTrademarksOpen } = useSearchStore();
	const [filters, setFilters] = useQueryState<Filter[] | null>("f_2", parseAsArrayOf(parseAsJson()));

	const onChange = (e: any) => {
		const value = e.target.value;
		const currentFilters: Filter[] = filters || []; // Змінюємо на масив

		if (e.target.checked) {
			// Додаємо новий фільтр
			const newFilter: Filter = { id: value, name: props.trademarks.find(c => c.id === Number(value))?.name };
			console.log("newTrademark", newFilter);
			setFilters([...currentFilters, newFilter], { history: "replace" });
		} else {
			// Видаляємо фільтр
			const updatedFilters = currentFilters.filter((filter: Filter) => filter.id !== value);
			setFilters(updatedFilters.length === 0 ? null : updatedFilters, { history: "replace" });
		}
	};

	return (
		<div className={styles.container}>
			<SidebarBlockHeader title="Торгова марка" setIsSidebarBlockOpen={setIsTrademarksOpen} isSidebarBlockOpen={isTrademarksOpen} />
			<div className={isTrademarksOpen ? styles.trademarkOpen : styles.trademarkClosed}>
				{props.trademarks.map((trademark: any, index: any) => (
					<div key={index} className={styles.trademarkItem}>
						<span className={styles.trademarkName}>{trademark.name}</span>
						<div>
							<span className={styles.trademarkCount}>{trademark.count}</span>
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
								value={trademark.id}
								onChange={onChange}
								checked={filters !== null && filters?.some((filter: Filter) => Number(filter.id) === trademark.id)} // Перевірка, чи фільтр вибраний
								disabled={trademark.count === 0}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default TrademarkPicker;
