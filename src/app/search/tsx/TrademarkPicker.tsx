// File: TrademarkPicker.tsx
import useSearchStore from "@/store/search";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../css/TrademarkPicker.module.css";

function TrademarkPicker(props: any) {
	const { isTrademarksOpen, setIsTrademarksOpen } = useSearchStore();
	const searchParams = useSearchParams();
	const router = useRouter();
	const filters = (searchParams?.get("f_2")?.split("|") || []).filter(Boolean);

	const onChange = (e: any) => {
		const value = e.target.value;
		const params = new URLSearchParams(searchParams as any);

		if (e.target.checked) {
			params.set("f_2", [...filters, value].join("|"));
		} else {
			params.set("f_2", filters.filter((filter: any) => filter !== value).join("|"));
		}
		router.push(`?${params.toString()}`);
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
								checked={filters.includes(trademark.name)}
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
