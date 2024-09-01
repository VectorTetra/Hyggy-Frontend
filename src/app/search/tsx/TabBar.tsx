import { useState } from "react";
import styles from "../page.module.css";
import Link from "next/link";

export default function TabBar(props: any) {
  // Встановлюємо стан для відстеження активної вкладки
  const [activeTab, setActiveTab] = useState("wares");

  // Об'єкти для Link з шляхами та параметрами
  const waresLink = {
    pathname: '/search',
    query: { type: 'wares', quantity: props.waresQuantity }
  };

  const pagesLink = {
    pathname: '/search',
    query: { type: 'pages', quantity: props.pagesQuantity }
  };

  return (
    <div id={styles.tabBarContainer}>
      <div id={styles.tabBar}>
        <ul id={styles.tabBarList}>
          {props.waresQuantity > 0 && (
            <li className={styles.tabBarItem}>
              <Link href={waresLink} className={`${styles.tabBarLink} ${activeTab === "wares" ? styles.activeLink : styles.nonActiveLink}`}
                  onClick={() => setActiveTab("wares")}>

                  Товари ({props.waresQuantity})
               
              </Link>
            </li>
          )}
          {props.pagesQuantity > 0 && (
            <li className={styles.tabBarItem}>
              <Link href={pagesLink}  className={`${styles.tabBarLink} ${activeTab === "pages" ? styles.activeLink : styles.nonActiveLink}`}
                  onClick={() => setActiveTab("pages")}>
                  Сторінки ({props.pagesQuantity})
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
