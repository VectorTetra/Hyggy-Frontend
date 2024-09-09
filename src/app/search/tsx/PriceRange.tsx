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
		const minFromUrl = searchParams?.get("min") ?? minPossible;
		const maxFromUrl = searchParams?.get("max") ?? maxPossible;
		setValues([Number(minFromUrl), Number(maxFromUrl)]);
	}, [searchParams, minPossible, maxPossible]);

	// Дебаунсимо зміну URL щоб не було миттєвого оновлення
	const updateUrlWithDebounce = debounce((newValues: number[]) => {
		const params = new URLSearchParams(searchParams as any);
		params.set("min", newValues[0].toString());
		params.set("max", newValues[1].toString());
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

			<div className={`${isPriceRangeOpen ? styles.priceRangeOpen : styles.priceRange}`}
			>
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
							onChange={(e) => setValues([Math.min(Number(e.target.value), values[1]), values[1]])} // Оновлюємо локальний стан
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
							onChange={(e) => setValues([values[0], Math.max(Number(e.target.value), values[0])])} // Оновлюємо локальний стан
							onBlur={handleBlur} // Оновлюємо URL при блюрі
						/>
					</div>
				</div>
			</div>
			<hr style={{ width: "100%", color: "rgb(163, 163, 163)", margin: "0" }}></hr>
		</div>
	);
};

export default PriceRange;
