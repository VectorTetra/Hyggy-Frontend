// File: StatusPicker.tsx
import useSearchStore from "@/store/search";
import { useQueryState } from 'nuqs';
import styles from "../css/StatusPicker.module.css";

function StatusPicker(props: any) {
	const { isStatusOpen, setIsStatusOpen } = useSearchStore();
	const [filters, setFilters] = useQueryState("f_3", { scroll: false });

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
								value={status.name}
								onChange={onChange}
								checked={(filters || "").split("|").includes(status.name)}
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
