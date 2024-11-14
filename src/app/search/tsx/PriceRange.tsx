// import { useState, useEffect } from "react";
// import { useQueryState } from 'nuqs';
// import { Range, getTrackBackground } from "react-range";
// import useSearchStore from "@/store/search";
// import styles from "../css/PriceRange.module.css";
// import debounce from 'lodash/debounce';

// const PriceRange = () => {
// 	const [f_0, setf_0] = useQueryState('f_0', { scroll: false, shallow: true, throttleMs: 500 });
// 	const { minPossible, maxPossible, setIsPriceRangeOpen, isPriceRangeOpen } = useSearchStore();
// 	const [values, setValues] = useState([minPossible, maxPossible]);
// 	const [isInitialLoad, setIsInitialLoad] = useState(true);

// 	useEffect(() => {
// 		if (f_0) {
// 			const [min, max] = f_0.split("_").map(Number);
// 			setValues([min, max]);
// 		} else if (isInitialLoad) {
// 			setValues([minPossible, maxPossible]);
// 			setIsInitialLoad(false);
// 		} else if (!f_0) {
// 			setValues([minPossible, maxPossible]);
// 		}
// 	}, [f_0, minPossible, maxPossible, isInitialLoad]);

// 	// Дебаунсимо оновлення параметра f_0 в URL
// 	const updateUrlWithDebounce = debounce((newValues) => {
// 		if (newValues[0] === minPossible && newValues[1] === maxPossible) {
// 			setf_0(null, { history: "replace", scroll: false });
// 		} else {
// 			setf_0(`${newValues[0]}_${newValues[1]}`, { history: "replace", scroll: false });
// 		}
// 	}, 300);

// 	const handleBlur = () => {
// 		updateUrlWithDebounce(values);
// 	};

// 	// Перевірка, щоб уникнути некоректних значень
// 	const MIN = Math.min(minPossible, maxPossible);
// 	const MAX = Math.max(minPossible, maxPossible);
// 	const isRangeValid = MIN < MAX && !isNaN(MIN) && !isNaN(MAX);

// 	return (
// 		<div className={styles.container}>
// 			<h2 onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)} className={styles.priceRangeHeader}>
// 				Ціна
// 			</h2>
// 			<div className={`${isPriceRangeOpen ? styles.priceRangeOpen : styles.priceRange}`}>
// 				{isRangeValid && (
// 					<Range
// 						disabled={!isPriceRangeOpen}
// 						values={values}
// 						step={10}
// 						min={MIN}
// 						max={MAX}
// 						onChange={setValues}
// 						onFinalChange={handleBlur}
// 						renderTrack={({ props, children }) => (
// 							<div
// 								{...props}
// 								className={styles.track}
// 								style={{
// 									background: getTrackBackground({
// 										values,
// 										colors: ["#ccc", "#548BF4", "#ccc"],
// 										min: MIN,
// 										max: MAX,
// 									}),
// 								}}
// 							>
// 								{children}
// 							</div>
// 						)}
// 						renderThumb={({ props, index }) => <div {...props} className={styles.thumb} />
// 							// renderThumb={({ props, index }) => (
// 							// 	<div
// 							// 		{...props}
// 							// 		className={styles.thumb}
// 							// 		style={{
// 							// 			...props.style,          // залишаємо існуючі стилі
// 							// 			position: "relative",       // скасовуємо absolute
// 							// 			transform: index === 0 ? "translateX(-10%)" : "translate(311px, -27px)", // зсув для кожного thumb
// 							// 			left: index === 0 ? "0" : "auto" // робимо статичне вирівнювання для першого thumb

// 							// 		}}
// 							// 	/>

// 						}
// 					/>
// 				)}
// 				<div className={styles.inputs}>
// 					<div className={styles.formGroup}>
// 						<label className={styles.inputLabel}>Мін</label>
// 						<input
// 							className={styles.inputPrice}
// 							type="number"
// 							value={values[0]}
// 							min={MIN}
// 							max={MAX}
// 							onChange={(e) => {
// 								const value = Math.max(Number(e.target.value), MIN);
// 								setValues([Math.min(value, values[1]), values[1]]);
// 							}}
// 							onBlur={handleBlur}
// 						/>
// 					</div>
// 					<div className={styles.formGroup}>
// 						<label className={styles.inputLabel}>Макс</label>
// 						<input
// 							className={styles.inputPrice}
// 							type="number"
// 							value={values[1]}
// 							min={MIN}
// 							max={MAX}
// 							onChange={(e) => {
// 								const value = Math.min(Number(e.target.value), MAX);
// 								setValues([values[0], Math.max(value, values[0])]);
// 							}}
// 							onBlur={handleBlur}
// 						/>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };
// export default PriceRange;

import { useState, useEffect } from "react";
import { useQueryState } from 'nuqs';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import useSearchStore from "@/store/search";
import styles from "../css/PriceRange.module.css";
import debounce from 'lodash/debounce';

const PriceRange = () => {
	const [f_0, setf_0] = useQueryState('f_0', { scroll: false, shallow: true, throttleMs: 500 });
	const { minPossible, maxPossible, setIsPriceRangeOpen, isPriceRangeOpen } = useSearchStore();
	const [values, setValues] = useState([minPossible, maxPossible]);
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	useEffect(() => {
		if (f_0) {
			const [min, max] = f_0.split("_").map(Number);
			setValues([min, max]);
		} else if (isInitialLoad) {
			setValues([minPossible, maxPossible]);
			setIsInitialLoad(false);
		} else if (!f_0) {
			setValues([minPossible, maxPossible]);
		}
	}, [f_0, minPossible, maxPossible, isInitialLoad]);

	const updateUrlWithDebounce = debounce((newValues) => {
		if (newValues[0] === minPossible && newValues[1] === maxPossible) {
			setf_0(null, { history: "replace", scroll: false });
		} else {
			setf_0(`${newValues[0]}_${newValues[1]}`, { history: "replace", scroll: false });
		}
	}, 300);

	const handleBlur = () => {
		updateUrlWithDebounce(values);
	};

	const MIN = Math.min(minPossible, maxPossible);
	const MAX = Math.max(minPossible, maxPossible);
	const isRangeValid = MIN < MAX && !isNaN(MIN) && !isNaN(MAX);

	const handleSliderChange = (newValues) => {
		setValues(newValues);
	};

	const handleMinInputChange = (e) => {
		const value = Math.max(Number(e.target.value), MIN);
		setValues([Math.min(value, values[1]), values[1]]);
	};

	const handleMaxInputChange = (e) => {
		const value = Math.min(Number(e.target.value), MAX);
		setValues([values[0], Math.max(value, values[0])]);
	};

	return (
		<div className={styles.container}>
			<h2 onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)} className={styles.priceRangeHeader}>
				Ціна
			</h2>
			<div className={`${isPriceRangeOpen ? styles.priceRangeOpen : styles.priceRange}`}>
				{isRangeValid && (
					<RangeSlider
						disabled={!isPriceRangeOpen}
						value={values}
						step={10}
						min={MIN}
						defaultValue={[MIN, MAX]}
						max={MAX}
						onInput={handleSliderChange}
						onThumbDragEnd={handleBlur}
					/>
				)}
				<div className={styles.inputs}>
					<div className={styles.formGroup}>
						<label className={styles.inputLabel}>Мін</label>
						<input
							className={styles.inputPrice}
							type="number"
							value={values[0]}
							min={MIN}
							max={MAX}
							onChange={handleMinInputChange}
							onBlur={handleBlur}
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
							onChange={handleMaxInputChange}
							onBlur={handleBlur}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PriceRange;
