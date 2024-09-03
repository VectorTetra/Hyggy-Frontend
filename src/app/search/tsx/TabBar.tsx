import styles from "../page.module.css";
import Link from "next/link";

export default function TabBar({ waresQuantity, pagesQuantity, activeTab, setActiveTab, query }: any) {
	// Об'єкти для Link з шляхами та параметрами
	const waresLink = {
		pathname: "/search",
		query: { type: "wares", quantity: waresQuantity, query: query },
	};

	const pagesLink = {
		pathname: "/search",
		query: { type: "pages", quantity: pagesQuantity, query: query },
	};

	return (
		<div id={styles.tabBarContainer}>
			<div id={styles.tabBar}>
				<ul id={styles.tabBarList}>
					{waresQuantity > 0 && (
						<li className={styles.tabBarItem}>
							<Link
								href={waresLink}
								className={`${styles.tabBarLink} 
								${activeTab === "wares" ? styles.activeLink : styles.nonActiveLink}`}
								onClick={() => setActiveTab("wares")}
							>
								Товари ({waresQuantity})
							</Link>
						</li>
					)}
					{pagesQuantity > 0 && (
						<li className={styles.tabBarItem}>
							<Link
								href={pagesLink}
								className={`${styles.tabBarLink} ${
									activeTab === "pages" ? styles.activeLink : styles.nonActiveLink
								}`}
								onClick={() => setActiveTab("pages")}
							>
								Сторінки ({pagesQuantity})
							</Link>
						</li>
					)}
				</ul>
			</div>
		</div>
	);
}
