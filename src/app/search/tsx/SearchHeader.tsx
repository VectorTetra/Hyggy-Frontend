import styles from "../css/SearchHeader.module.css";

export default function SearchHeader(props: any) {
  // Встановлюємо стан для відстеження активної вкладки
  return (
    <div id={styles.searchHeader}>
      {(props.foundWaresQuantity > 0 && props.query !== "" && props.activeTab === "wares") && (
        <h1 id={styles.resultsFound}>
          {props.foundWaresQuantity} результатів для: {props.query}
        </h1>
      )}
      {(props.foundWaresQuantity > 0 && props.query === "" && props.activeTab === "wares") && (
        <h1 id={styles.resultsFound}>
          Знайдено {props.foundWaresQuantity} результатів
        </h1>
      )}
      {(props.foundWaresQuantity === 0 && !props.loading && props.activeTab === "wares") && (
        <h1 id={styles.resultsFound}>
          Не знайдено результатів. Спробуйте змінити параметри пошуку
        </h1>
      )}
      {(props.foundBlogsQuantity > 0 && props.query !== "" && props.activeTab === "blogs") && (
        <h1 id={styles.resultsFound}>
          {props.foundBlogsQuantity} результатів для: {props.query}
        </h1>
      )}
      {(props.foundBlogsQuantity > 0 && props.query === "" && props.activeTab === "blogs") && (
        <h1 id={styles.resultsFound}>
          Знайдено {props.foundBlogsQuantity} результатів
        </h1>
      )}
      {(!props.loading && (props.foundWaresQuantity === 0 && props.foundBlogsQuantity === 0)) && (
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
