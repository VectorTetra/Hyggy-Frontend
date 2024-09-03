import { useState } from "react";
import styles from "../page.module.css";
import Link from "next/link";

export default function SearchHeader(props: any) {
  // Встановлюємо стан для відстеження активної вкладки
  return (
    <div id={styles.searchHeader}>
      {props.resultsQuantity > 0 && (
        <h1 id={styles.resultsFound}>
          {props.resultsQuantity} результатів для: {props.query}
        </h1>
      )}
      {props.resultsQuantity === 0 && (
        <div>
          <h2>Вибачте, ми не знайшли результатів пошуку по {props.query}</h2>
          <div>Поради з пошуку:</div>
          <ul>
            <li>Перевірте Вашу орфографію</li>
            <li>Спробуйте використовувати прості слова (наприклад: матрац, ковдра, подушка)</li>
            <li>Спробуйте пошук для елемента, який є менш специфічним</li>
          </ul>
        </div>
      )}
    </div>
  );
}
