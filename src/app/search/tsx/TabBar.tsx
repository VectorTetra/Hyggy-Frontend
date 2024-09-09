import styles from "../css/TabBar.module.css";
import { useRouter, useSearchParams } from "next/navigation";

export default function TabBar({ waresQuantity, articlesQuantity, activeTab, setActiveTab, query }: any) {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Функція для оновлення URL з параметрами
	const updateUrl = (type: string) => {
		// Створюємо нові параметри, зберігаючи існуючі
		const params = new URLSearchParams(searchParams as any);

		// Додаємо або змінюємо тип і кількість
		params.set("type", type);

		// Залишаємо інші параметри, зберігаючи query
		if (query) {
			params.set("query", query);
		}

		// Пушимо новий URL з оновленими параметрами
		router.push(`?${params.toString()}`);
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
					{articlesQuantity > 0 && (
						<li className={styles.tabBarItem}>
							<a
								className={`${styles.tabBarLink} ${activeTab === "articles" ? styles.activeLink : styles.nonActiveLink}`}
								onClick={() => {
									setActiveTab("articles");
									updateUrl("articles");
								}}
							>
								Сторінки ({articlesQuantity})
							</a>
						</li>
					)}
				</ul>
			</div>
		</div>
	);
}
