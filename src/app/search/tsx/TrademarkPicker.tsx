// File: TrademarkPicker.tsx

import useSearchStore from "@/store/search";
import { useQueryState } from 'nuqs';
import styles from "../css/TrademarkPicker.module.css";

function TrademarkPicker(props: any) {
	const { isTrademarksOpen, setIsTrademarksOpen } = useSearchStore();
	const [filters, setFilters] = useQueryState("f_2", { scroll: false });

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
			<h2 onClick={() => setIsTrademarksOpen(!isTrademarksOpen)} className={styles.header}>
				Торгова марка
			</h2>
			<div className={isTrademarksOpen ? styles.trademarkOpen : styles.trademarkClosed}>
				{props.trademarks.map((trademark: any, index: any) => (
					<div key={index} className={styles.trademarkItem}>
						<span className={styles.trademarkName}>{trademark.name}</span>
						<div>
							<span className={styles.trademarkCount}>{trademark.count}</span>
							<input
								type="checkbox"
								className={styles.checkbox}
								value={trademark.name}
								onChange={onChange}
								checked={(filters || "").split("|").includes(trademark.name)}
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
