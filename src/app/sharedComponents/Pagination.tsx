import { FC, useRef, useEffect } from "react";
import styles from "./css/Pagination.module.css";

interface PaginationProps {
	totalItems: number;
	itemsPerPage: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
	totalItems,
	itemsPerPage,
	currentPage,
	onPageChange,
}) => {
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const prevFilteredItemsCount = useRef(totalItems);
	useEffect(() => {
		if (prevFilteredItemsCount.current !== totalItems) {
			// Якщо кількість товарів змінилась, переходимо на першу сторінку
			onPageChange(1);
		}
		// Оновлюємо попереднє значення
		prevFilteredItemsCount.current = totalItems;
	}, [totalItems, onPageChange]);

	const handlePageClick = (page: number) => {
		onPageChange(page);
	};

	const renderPageNumbers = () => {
		const pages: (JSX.Element | string)[] = [];

		if (currentPage > 2) {
			pages.push(
				<button
					key={1}
					onClick={() => handlePageClick(1)}
					className={`${styles.paginationButton} ${currentPage === 1 ? styles.activePage : ""}`}
				>
					1
				</button>
			);
			if (currentPage > 3) {
				pages.push(
					<span key="dots-1" className={styles.paginationButton}>...</span>
				);
			}
		}

		for (let i = Math.max(1, currentPage - 1); i <= Math.min(currentPage + 1, totalPages); i++) {
			pages.push(
				<button
					key={i}
					onClick={() => handlePageClick(i)}
					className={`${styles.paginationButton} ${currentPage === i ? styles.activePage : ""}`}
				>
					{i}
				</button>
			);
		}

		if (currentPage < totalPages - 1) {
			if (currentPage < totalPages - 2) {
				pages.push(
					<span key="dots-2" className={styles.paginationButton}>...</span>
				);
			}
			pages.push(
				<button
					key={totalPages}
					onClick={() => handlePageClick(totalPages)}
					className={`${styles.paginationButton} ${currentPage === totalPages ? styles.activePage : ""}`}
				>
					{totalPages}
				</button>
			);
		}

		return pages;
	};


	return (
		<div className={styles.paginationContainer}>
			<button
				onClick={() => handlePageClick(currentPage - 1)}
				disabled={currentPage === 1}
				className={styles.paginationArrow}
			>
				&lt;
			</button>
			{renderPageNumbers()}
			<button
				onClick={() => handlePageClick(currentPage + 1)}
				disabled={currentPage === totalPages}
				className={styles.paginationArrow}
			>
				&gt;
			</button>
		</div>
	);
};

export default Pagination;
