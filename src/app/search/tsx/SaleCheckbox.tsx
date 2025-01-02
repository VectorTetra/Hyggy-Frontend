// File: SaleCheckbox.tsx
import { useQueryState } from 'nuqs';
import styles from "../css/SaleCheckbox.module.css";
import { Checkbox } from "@mui/material";

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
					<Checkbox
						sx={{
						padding: '0px',
						color: '#00AAAD',
						'&.Mui-checked': {
							color: '#00AAAD',
						},
						}}
						size="small"
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
