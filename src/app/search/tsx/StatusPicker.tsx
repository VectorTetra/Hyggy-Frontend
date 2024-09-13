// File: StatusPicker.tsx
import useSearchStore from "@/store/search";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../css/StatusPicker.module.css";

function StatusPicker(props: any) {
	const { isStatusOpen, setIsStatusOpen } = useSearchStore();
	const searchParams = useSearchParams();
	const router = useRouter();
	const filters = (searchParams?.get("f_3")?.split("|") || []).filter(Boolean);

	const onChange = (e: any) => {
		const value = e.target.value;
		const params = new URLSearchParams(searchParams as any);

		if (e.target.checked) {
			params.set("f_3", [...filters, value].join("|"));
		} else {
			params.set("f_3", filters.filter((filter: any) => filter !== value).join("|"));
		}
		router.push(`?${params.toString()}`);
	};

	return (
		<div className={styles.container}>
			<h2 onClick={() => setIsStatusOpen(!isStatusOpen)} className={styles.header}>
				Спец. пропозиції
			</h2>
			<div className={isStatusOpen ? styles.statusOpen : styles.statusClosed}>
				{props.statuses.map((Status: any, index: any) => (
					<div key={index} className={styles.statusItem}>
						<span className={styles.statusName}>{Status.name}</span>
						<div>
							<span className={styles.statusCount}>{Status.count}</span>
							<input
								type="checkbox"
								className={styles.checkbox}
								value={Status.name}
								onChange={onChange}
								checked={filters.includes(Status.name)}
								disabled={Status.count === 0}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default StatusPicker;
