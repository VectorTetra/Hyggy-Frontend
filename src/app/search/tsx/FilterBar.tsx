import { useState } from "react";
import styles from "../css/FilterBar.module.css";
import Link from "next/link";
import FilterButton from "./FilterButton";
import ToggleCheckbox from "./ToggleCheckbox";
export default function FilterBar(props: any) {
  // Встановлюємо стан для відстеження активної вкладки
  return (
    <div id={styles.filterToggleBar}>
      <div id={styles.filterBar}>
        <FilterButton
          text="Ціна"
          afterImageSrc="/images/search/kursor.png"
          dissappearOnAdapt={true}
        />
        <FilterButton
          text="Категорія"
          afterImageSrc="/images/search/kursor.png"
          dissappearOnAdapt={true}
        />
        <FilterButton
          text="Торгова марка"
          afterImageSrc="/images/search/kursor.png"
          dissappearOnAdapt={true}
        />
        <FilterButton
          text="Сортувати"
          afterImageSrc="/images/search/kursor.png"
          dissappearOnAdapt={false}
        />
        <FilterButton
          text="Всі фільтри"
          beforeImageSrc="/images/search/filter.png"
          dissappearOnAdapt={false}
        />
      </div>
      <div id={styles.toggleBar}>
        <ToggleCheckbox />
      </div>
    </div>
  );
}
