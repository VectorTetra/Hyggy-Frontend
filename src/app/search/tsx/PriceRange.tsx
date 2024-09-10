import { useState, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";
import { useRouter, useSearchParams } from 'next/navigation';
import useSearchStore from "@/store/search";
import styles from "../css/PriceRange.module.css";
import debounce from 'lodash/debounce'; // Використаємо lodash для debounce

const PriceRange = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { minPossible, maxPossible, setIsPriceRangeOpen, isPriceRangeOpen } = useSearchStore();

	const [values, setValues] = useState([minPossible, maxPossible]);

	// Ініціалізуємо значення слайдера з URL або з Zustand при першому рендері
	useEffect(() => {
		const priceParams = searchParams?.get("f_0");
		if (priceParams) {
			const [min, max] = priceParams.split("_").map(Number);
			setValues([min, max]);
		}
	}, [searchParams, minPossible, maxPossible]);

	// Дебаунсимо зміну URL щоб не було миттєвого оновлення
	const updateUrlWithDebounce = debounce((newValues: number[]) => {
		const params = new URLSearchParams(searchParams as any);
		params.set("f_0", `${newValues[0]}_${newValues[1]}`);
		router.push(`?${params.toString()}`);
	}, 300); // Затримка в 300 мс

	// Оновлюємо URL тільки при втраті фокусу (blur)
	const handleBlur = () => {
		updateUrlWithDebounce(values);
	};

	const MIN = minPossible;
	const MAX = maxPossible;

	return (
		<div className={styles.container}>
			<h2 onClick={() => { setIsPriceRangeOpen(!isPriceRangeOpen) }} className={styles.priceRangeHeader}>Ціна</h2>

			<div className={`${isPriceRangeOpen ? styles.priceRangeOpen : styles.priceRange}`}>
				<Range
					disabled={!isPriceRangeOpen}
					values={values}
					step={1}
					min={MIN}
					max={MAX}
					onChange={setValues} // Оновлюємо тільки локальний стан
					onFinalChange={handleBlur} // Оновлюємо URL при втраті фокусу
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
					renderThumb={({ props }) => (
						<div
							{...props}
							className={styles.thumb}
						/>
					)}
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
