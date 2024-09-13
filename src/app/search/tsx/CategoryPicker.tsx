//File: CategoryPicker.tsx
import useSearchStore from "@/store/search";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../css/CategoryPicker.module.css";

function CategoryPicker(props: any) {
	const { isCategoryOpen, setIsCategoryOpen } = useSearchStore();
	const searchParams = useSearchParams();
	const router = useRouter();
	const filters = (searchParams?.get("f_1")?.split("|") || []).filter(Boolean);

	const onChange = (e: any) => {
		const value = e.target.value;
		const params = new URLSearchParams(searchParams as any);

		if (e.target.checked) {
			params.set("f_1", [...filters, value].join("|"));
		} else {
			params.set("f_1", filters.filter((filter: any) => filter !== value).join("|"));
		}
		router.push(`?${params.toString()}`);
	};

	return (
		<div className={styles.container}>
			<h2 onClick={() => setIsCategoryOpen(!isCategoryOpen)} className={styles.header}>
				Категорія
			</h2>
			<div className={isCategoryOpen ? styles.categoryOpen : styles.categoryClosed}>
				{props.categories.map((category: any, index: any) => (
					<div key={index} className={styles.categoryItem}>
						<span className={styles.categoryName}>{category.name}</span>
						<div>
							<span className={styles.categoryCount}>{category.count}</span>
							<input
								type="checkbox"
								className={styles.checkbox}
								value={category.name}
								onChange={onChange}
								checked={filters.includes(category.name)}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default CategoryPicker;
