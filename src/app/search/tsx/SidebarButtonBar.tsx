import styles from '../css/SidebarButtonBar.module.css';
import { useQueryState } from 'nuqs';
import useSearchStore from "@/store/search"; // Імпортуємо Zustand store  

export default function SidebarButtonBar(props: any) {
	const { setIsSortingSidebarOpen, setIsSidebarOpen } = useSearchStore();
	const [f_0, setf_0] = useQueryState('f_0', { scroll: false });
	const [f_1, setf_1] = useQueryState('f_1', { scroll: false });
	const [f_2, setf_2] = useQueryState('f_2', { scroll: false });
	const [f_3, setf_3] = useQueryState('f_3', { scroll: false });
	const [f_4, setf_4] = useQueryState('f_4', { scroll: false });
	const clearAllFilters = () => {
		setf_0(null, { history: "replace" });
		setf_1(null, { history: "replace" });
		setf_2(null, { history: "replace" });
		setf_3(null, { history: "replace" });
		setf_4(null, { history: "replace" });
	};
	const onClose = () => { setIsSidebarOpen(false); setIsSortingSidebarOpen(false); };

	const hasActiveFilters = [f_0, f_1, f_2, f_3, f_4].some(filter => filter !== null);
	return (
		<div className={styles.sidebarButtonBar}>
			<div className={styles.sidebarButtonContainer}>
				<div className={styles.removeFiltersButton} style={{
					opacity: hasActiveFilters ? 1 : 0.5,
					cursor: hasActiveFilters ? 'pointer' : 'not-allowed'
				}}
					onClick={clearAllFilters}>Прибрати все</div>
				<div className={styles.showResultsButton} onClick={onClose}>Показати всі результати</div>

			</div>
		</div>);
}