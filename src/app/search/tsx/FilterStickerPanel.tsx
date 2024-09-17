import styles from "../css/FilterStickerPanel.module.css";
import CrossIcon from "@/app/sharedComponents/CrossIcon";
import { useQueryState } from 'nuqs';

function FilterStickerPanel() {
	const [f_0, setf_0] = useQueryState('f_0', { scroll: false });
	const [f_1, setf_1] = useQueryState('f_1', { scroll: false });
	const [f_2, setf_2] = useQueryState('f_2', { scroll: false });
	const [f_3, setf_3] = useQueryState('f_3', { scroll: false });
	const [f_4, setf_4] = useQueryState('f_4', { scroll: false });

	const deletePriceSticker = () => {
		setf_0(null, { history: "replace" });
	};

	const deleteCategorySticker = (category: string) => {
		const updatedCategories = (f_1 ? f_1.split("|") : []).filter((c) => c !== category);
		setf_1(updatedCategories.length === 0 ? null : updatedCategories.join("|"), { history: "replace" });
	};

	const deleteTrademarkSticker = (trademark: string) => {
		const updatedTrademarks = (f_2 ? f_2.split("|") : []).filter((t) => t !== trademark);
		setf_2(updatedTrademarks.length === 0 ? null : updatedTrademarks.join("|"), { history: "replace" });
	};

	const deleteStatusSticker = (status: string) => {
		const updatedStatuses = (f_3 ? f_3.split("|") : []).filter((s) => s !== status);
		setf_3(updatedStatuses.length === 0 ? null : updatedStatuses.join("|"), { history: "replace" });
	};

	const deleteSaleSticker = () => {
		setf_4(null, { history: "replace" });
	};

	const clearAllFilters = () => {
		setf_0(null, { history: "replace" });
		setf_1(null, { history: "replace" });
		setf_2(null, { history: "replace" });
		setf_3(null, { history: "replace" });
		setf_4(null, { history: "replace" });
	};

	// Calculate the number of active filters
	const hasActiveFilters = [f_0, f_1, f_2, f_3, f_4].some(filter => filter !== null);
	const filterCount = [
		f_0 ? 1 : 0,
		f_1 ? (f_1.split("|").length || 0) : 0,
		f_2 ? (f_2.split("|").length || 0) : 0,
		f_3 ? (f_3.split("|").length || 0) : 0,
		f_4 ? 1 : 0
	].reduce((acc, count) => acc + count, 0);

	return (
		<div>
			{
				hasActiveFilters && (
					<div className={styles.filterStickerPanel}>
						{f_0 && <span className={styles.filterStickerItem} onClick={deletePriceSticker}><div className={styles.text}>Ціна: {f_0.split("_")[0]} - {f_0.split("_")[1]}</div> <CrossIcon width="22px" height="22px" /></span>}
						{f_1 && (f_1.split("|") || []).map((category, index) => (
							<span key={index} className={styles.filterStickerItem} onClick={() => { deleteCategorySticker(category) }}><div className={styles.text}>{category}</div> <CrossIcon width="22px" height="22px" /></span>
						))}
						{f_2 && (f_2.split("|") || []).map((trademark, index) => (
							<span key={index} className={styles.filterStickerItem} onClick={() => { deleteTrademarkSticker(trademark) }}><div className={styles.text}>{trademark}</div> <CrossIcon width="22px" height="22px" /></span>
						))}
						{f_3 && (f_3.split("|") || []).map((status, index) => (
							<span key={index} className={styles.filterStickerItem} onClick={() => { deleteStatusSticker(status) }}><div className={styles.text}>{status}</div> <CrossIcon width="22px" height="22px" /></span>
						))}
						{f_4 && <span className={styles.filterStickerItem} onClick={deleteSaleSticker}> <div className={styles.text}>Товари на акції</div> <CrossIcon width="22px" height="22px" /></span>}
						{filterCount > 1 && (
							<span className={styles.filterStickerItem} style={{ border: "1px solid red" }} onClick={clearAllFilters}>
								Прибрати все
							</span>
						)}
					</div>
				)
			}

		</div>
	);
}

export default FilterStickerPanel;
