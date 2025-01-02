import { useState, useEffect } from "react";
import { useQueryState } from 'nuqs';
import 'react-range-slider-input/dist/style.css';
import useSearchStore from "@/store/search";
import styles from "../css/PriceRange.module.css";
import debounce from 'lodash/debounce';
import SidebarBlockHeader from "@/app/sharedComponents/SidebarBlockHeader";
import { Slider, ThemeProvider } from "@mui/material";

import themeFrame from "@/app/AdminPanel/tsx/ThemeFrame";

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

	const handleSliderChange = (event, newValues) => {
		console.log("newValues", newValues);
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
			<SidebarBlockHeader title="Ціна" setIsSidebarBlockOpen={setIsPriceRangeOpen} isSidebarBlockOpen={isPriceRangeOpen} />
			<div className={`${isPriceRangeOpen ? styles.priceRangeOpen : styles.priceRange}`}>
				{isRangeValid && (
					// <RangeSlider
					// 	className={styles.customSlider}
					// 	disabled={!isPriceRangeOpen}
					// 	value={values}
					// 	step={1}
					// 	min={MIN}
					// 	defaultValue={[MIN, MAX]}
					// 	max={MAX}
					// 	onInput={handleSliderChange}
					// 	onThumbDragEnd={handleBlur}
					// />
					<ThemeProvider theme={themeFrame}>
						<Slider
							value={values}
							onChange={handleSliderChange}
							onChangeCommitted={handleBlur}
							min={MIN}
							max={MAX}
							step={1}
							disabled={!isPriceRangeOpen}
							valueLabelDisplay="auto"
						/>
					</ThemeProvider>
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
