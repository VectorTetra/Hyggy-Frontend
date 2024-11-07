import styles from "../css/FilterStickerPanel.module.css";
import CrossIcon from "@/app/sharedComponents/CrossIcon";
import useSearchStore from "@/store/search";
import { useQueryState, parseAsArrayOf, parseAsJson } from 'nuqs';

interface Filter {
	id: string; // або number, в залежності від типу вашого id
	name: string;
}

function FilterStickerPanel() {
	const { categoriesMap, trademarksMap, statusesMap } = useSearchStore();
	const [f_0, setf_0] = useQueryState('f_0', { scroll: false });
	const [f_1, setf_1] = useQueryState<Filter[] | null>("f_1", parseAsArrayOf(parseAsJson()));
	const [f_2, setf_2] = useQueryState<Filter[] | null>("f_2", parseAsArrayOf(parseAsJson()));
	const [f_3, setf_3] = useQueryState<Filter[] | null>("f_3", parseAsArrayOf(parseAsJson()));
	const [f_4, setf_4] = useQueryState('f_4', { scroll: false });

	const deletePriceSticker = () => {
		setf_0(null, { history: "replace" });
	};

	const deleteCategorySticker = (categoryId: string) => {
		const updatedCategories = f_1?.filter((c) => c.id !== categoryId) || []; // Видалення категорії
		setf_1(updatedCategories.length === 0 ? null : updatedCategories, { history: "replace", scroll: false });
	};

	const deleteTrademarkSticker = (trademarkId: string) => {
		const updatedTrademarks = f_2?.filter((c) => c.id !== trademarkId) || [];
		setf_2(updatedTrademarks.length === 0 ? null : updatedTrademarks, { history: "replace", scroll: false });
	};

	const deleteStatusSticker = (statusId: string) => {
		const updatedStatuses = f_3?.filter((c) => c.id !== statusId) || [];
		setf_3(updatedStatuses.length === 0 ? null : updatedStatuses, { history: "replace", scroll: false });
	};

	const deleteSaleSticker = () => {
		setf_4(null, { history: "replace", scroll: false });
	};

	const clearAllFilters = () => {
		setf_0(null, { history: "replace", scroll: false });
		setf_1(null, { history: "replace", scroll: false });
		setf_2(null, { history: "replace", scroll: false });
		setf_3(null, { history: "replace", scroll: false });
		setf_4(null, { history: "replace", scroll: false });
	};

	// Calculate the number of active filters
	const hasActiveFilters = [f_0, f_1, f_2, f_3, f_4].some(filter => filter !== null);
	const filterCount = [
		f_0 ? 1 : 0,
		f_1 ? (f_1.length || 0) : 0,
		f_2 ? (f_2.length || 0) : 0,
		f_3 ? (f_3.length || 0) : 0,
		f_4 ? 1 : 0
	].reduce((acc, count) => acc + count, 0);

	return (
		<div>
			{hasActiveFilters && (
				<div className={styles.filterStickerPanel}>
					{f_0 && <span className={styles.filterStickerItem} onClick={deletePriceSticker}><div className={styles.text}>Ціна: {f_0.split("_")[0]} - {f_0.split("_")[1]}</div> <CrossIcon width="22px" height="22px" /></span>}
					{f_1 && f_1.map((category, index) => (
						<span key={index} className={styles.filterStickerItem} onClick={() => deleteCategorySticker(category.id)}>
							<div className={styles.text}>{category.name}</div> {/* Відображаємо name */}
							<CrossIcon width="22px" height="22px" />
						</span>
					))}
					{f_2 && f_2.map((trademark, index) => (
						<span key={index} className={styles.filterStickerItem} onClick={() => deleteTrademarkSticker(trademark.id)}>
							<div className={styles.text}>{trademark.name}</div>
							<CrossIcon width="22px" height="22px" />
						</span>
					))}
					{f_3 && f_3.map((status, index) => (
						<span key={index} className={styles.filterStickerItem} onClick={() => deleteStatusSticker(status.id)}>
							<div className={styles.text}>{status.name}</div>
							<CrossIcon width="22px" height="22px" />
						</span>
					))}
					{f_4 && <span className={styles.filterStickerItem} onClick={deleteSaleSticker}> <div className={styles.text}>Товари на акції</div> <CrossIcon width="22px" height="22px" /></span>}
					{filterCount > 1 && (
						<span className={styles.filterStickerItem} style={{ border: "1px solid red" }} onClick={clearAllFilters}>
							Прибрати все
						</span>
					)}
				</div>
			)}
		</div>
	);
}

export default FilterStickerPanel;
