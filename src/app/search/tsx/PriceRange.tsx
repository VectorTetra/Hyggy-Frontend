import { useState, useEffect } from "react";
import { useQueryState } from 'nuqs';
import { Range, getTrackBackground } from "react-range";
import useSearchStore from "@/store/search";
import styles from "../css/PriceRange.module.css";
import debounce from 'lodash/debounce'; // Використаємо lodash для debounce

const PriceRange = () => {
	const [f_0, setf_0] = useQueryState('f_0', { scroll: false });
	const { minPossible, maxPossible, setIsPriceRangeOpen, isPriceRangeOpen } = useSearchStore();
	const [values, setValues] = useState([minPossible, maxPossible]);

	useEffect(() => {
		if (f_0) {
			const [min, max] = f_0.split("_").map(Number);
			setValues([min, max]);
		}
	}, [f_0, minPossible, maxPossible]);

	// Дебаунсимо оновлення параметра f_0 в URL
	const updateUrlWithDebounce = debounce((newValues: number[]) => {
		if (newValues[0] === minPossible && newValues[1] === maxPossible) {
			setf_0(null, { history: "replace" }); // Видаляємо параметр, якщо значення є мінімальними і максимальними
		} else {
			setf_0(`${newValues[0]}_${newValues[1]}`, { history: "replace" }); // Оновлюємо параметр
		}
	}, 300);

	const handleBlur = () => {
		updateUrlWithDebounce(values);
	};

	const MIN = minPossible;
	const MAX = maxPossible;

	return (
		<div className={styles.container}>
			<h2 onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)} className={styles.priceRangeHeader}>
				Ціна
			</h2>
			<div className={`${isPriceRangeOpen ? styles.priceRangeOpen : styles.priceRange}`}>
				<Range
					disabled={!isPriceRangeOpen}
					values={values}
					step={1}
					min={MIN}
					max={MAX}
					onChange={setValues}
					onFinalChange={handleBlur}
					renderTrack={({ props, children }) => (
						<div
							{...props}
							className={styles.track}
							style={{
								background: getTrackBackground({
									values,
									colors: ["#ccc", "#548BF4", "#ccc"],
									min: MIN,
									max: MAX,
								}),
							}}
						>
							{children}
						</div>
					)}
					renderThumb={({ props }) => <div {...props} className={styles.thumb} />}
				/>
				<div className={styles.inputs}>
					<div className={styles.formGroup}>
						<label className={styles.inputLabel}>Мін</label>
						<input
							className={styles.inputPrice}
							type="number"
							value={values[0]}
							min={MIN}
							max={MAX}
							onChange={(e) => {
								const value = Math.max(Number(e.target.value), MIN);
								setValues([Math.min(value, values[1]), values[1]]);
							}}
							onBlur={handleBlur} // Оновлюємо URL при блюрі
						/>
					</div>
					<div className={styles.formGroup}>
						<label className={styles.inputLabel}>Макс</label>
						<input
							className={styles.inputPrice}
							type="number"
							value={values[1]}
							min={MIN}
							max={MAX}
							onChange={(e) => {
								const value = Math.min(Number(e.target.value), MAX);
								setValues([values[0], Math.max(value, values[0])]);
							}}
							onBlur={handleBlur} // Оновлюємо URL при блюрі
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PriceRange;
