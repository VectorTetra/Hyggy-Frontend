import { FC, useState } from "react";
import styles from "./FilterSidebar.module.css";

interface FilterSidebarProps {
	isOpen: boolean;
	onClose: () => void;
	selectedFilters: string[];
	onFilterRemove: (filter: string) => void;
}

const FilterSidebar: FC<FilterSidebarProps> = ({ isOpen, onClose, selectedFilters, onFilterRemove }) => {
	if (!isOpen) return null;

	return (
		<>
			<div className={styles.backdrop} onClick={onClose}></div> {/* Затемнення фону */}
			<div className={styles.sidebar}>
				<h2>Фільтри</h2>
				<div>
					{/* Тут можна відобразити вибрані фільтри */}
					{selectedFilters.length > 0 ? (
						<ul>
							{selectedFilters.map((filter, index) => (
								<li key={index}>
									{filter}
									<button onClick={() => onFilterRemove(filter)}>Видалити</button>
								</li>
							))}
						</ul>
					) : (
						<p>Фільтри не вибрані</p>
					)}
				</div>
				<button onClick={onClose}>Закрити фільтри</button>
			</div>
		</>
	);
};

export default FilterSidebar;
