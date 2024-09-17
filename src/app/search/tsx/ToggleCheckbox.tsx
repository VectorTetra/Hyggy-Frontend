import { useRouter, useSearchParams } from "next/navigation";
import styles from "../css/ToggleCheckbox.module.css";
import React from "react";
import useSearchStore from "@/store/search";
// Apply React Memo to prevent re-rendering

const ToggleCheckbox = React.memo(() => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filter = searchParams?.get("f_4");

  const onChange = (e: any) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams as any);

    if (e.target.checked) {
      params.set("f_4", value);
    } else {
      params.delete("f_4");
    }
    router.push(`?${params.toString()}`);
  };

  const handleSpanClick = () => {
    const params = new URLSearchParams(searchParams as any);
    const isChecked = filter === "sale";

    if (!isChecked) {
      params.set("f_4", "sale");
    } else {
      params.delete("f_4");
    }
    router.push(`?${params.toString()}`);
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
});

export default ToggleCheckbox;
