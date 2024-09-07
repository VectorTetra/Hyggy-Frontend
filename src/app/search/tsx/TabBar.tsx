import styles from "../css/TabBar.module.css";
import Link from "next/link";

export default function TabBar({ waresQuantity, articlesQuantity, activeTab, setActiveTab, query }: any) {
	// Об'єкти для Link з шляхами та параметрами
	const waresLink = {
		pathname: "/search",
		query: { type: "wares", quantity: waresQuantity, query: query },
	};

	const articlesLink = {
		pathname: "/search",
		query: { type: "articles", quantity: articlesQuantity, query: query },
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
					{articlesQuantity > 0 && (
						<li className={styles.tabBarItem}>
							<Link
								href={articlesLink}
								className={`${styles.tabBarLink} ${activeTab === "articles" ? styles.activeLink : styles.nonActiveLink
									}`}
								onClick={() => setActiveTab("articles")}
							>
								Сторінки ({articlesQuantity})
							</Link>
						</li>
					)}
				</ul>
			</div>
		</div>
	);
}
