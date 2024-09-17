// File: SaleCheckbox.tsx
import { useQueryState } from 'nuqs';
import styles from "../css/SaleCheckbox.module.css";

function SaleCheckbox() {
	const [filter, setFilter] = useQueryState("f_4", { scroll: false });

	const onChange = (e: any) => {
		const value = e.target.value;
		if (e.target.checked) {
			setFilter(value, { history: "replace" });
		} else {
			setFilter(null, { history: "replace" });
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.saleCheckboxItem}>
				<h2 className={styles.saleCheckboxName}>Товари на акції</h2>
				<div>
					<input
						type="checkbox"
						className={styles.checkbox}
						value="sale"
						onChange={onChange}
						checked={filter === "sale"}
					/>
				</div>
			</div>
		</div>
	);
}

export default SaleCheckbox;
