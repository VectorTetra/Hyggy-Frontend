import styles from "../css/TabBar.module.css";
import { useQueryState } from 'nuqs';

export default function TabBar({ waresQuantity, blogsQuantity, activeTab, setActiveTab, query }: any) {
	// Використовуємо useQueryState з nuqs для роботи з параметрами URL
	// Якщо вказати { scroll: false }, то параметр не буде впливати на прокрутку
	const [type, setType] = useQueryState('type', { scroll: false });
	const [searchQuery, setSearchQuery] = useQueryState('query', { scroll: false });

	// Функція для оновлення URL з параметрами
	const updateUrl = (newType: string) => {
		// Оновлюємо параметр типу в URL
		setType(newType, { history: "replace" });

		// Якщо є query, оновлюємо і його
		if (query) {
			setSearchQuery(query, { history: "replace" });
		}
	};

	return (
		<div id={styles.tabBarContainer}>
			<div id={styles.tabBar}>
				<ul id={styles.tabBarList}>
					{waresQuantity > 0 && (
						<li className={styles.tabBarItem}>
							<a
								className={`${styles.tabBarLink} 
								${activeTab === "wares" ? styles.activeLink : styles.nonActiveLink}`}
								onClick={() => {
									setActiveTab("wares");
									updateUrl("wares");
								}}
							>
								Товари ({waresQuantity})
							</a>
						</li>
					)}
					{blogsQuantity > 0 && (
						<li className={styles.tabBarItem}>
							<a
								className={`${styles.tabBarLink} ${activeTab === "blogs" ? styles.activeLink : styles.nonActiveLink}`}
								onClick={() => {
									setActiveTab("blogs");
									updateUrl("blogs");
								}}
							>
								Сторінки ({blogsQuantity})
							</a>
						</li>
					)}
				</ul>
			</div>
		</div>
	);
}
