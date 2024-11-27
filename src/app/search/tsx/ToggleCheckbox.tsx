import { useQueryState } from 'nuqs';
import styles from "../css/ToggleCheckbox.module.css";
import React from "react";
// Apply React Memo to prevent re-rendering

export default function ToggleCheckbox() {
  const [filter, setFilter] = useQueryState("f_4", { scroll: false });

  const onChange = (e: any) => {
    const value = e.target.value;
    if (e.target.checked) {
      setFilter(value, { history: "replace" });
    } else {
      setFilter(null, { history: "replace" });
    }
  };

  const handleSpanClick = () => {
    const isChecked = filter === "sale";
    if (!isChecked) {
      setFilter("sale", { history: "replace" });
    } else {
      setFilter(null, { history: "replace" });
    }
  };

  return (
    <div className={styles.toggleContainer}>
      <span className={styles.toggleText} onClick={handleSpanClick}>
        Товари на акції
      </span>
      <label className={styles.toggleLabel}>
        <input
          type="checkbox"
          value="sale"
          checked={filter === "sale"}
          onChange={onChange}
          className={styles.toggleCheckbox}
        />
        <span className={styles.toggleSlider}></span>
      </label>
    </div>
  );
};

