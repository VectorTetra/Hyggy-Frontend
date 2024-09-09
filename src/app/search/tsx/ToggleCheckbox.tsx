import { useState } from 'react';
import styles from "../css/ToggleCheckbox.module.css";

const ToggleCheckbox = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      console.log('Товари на акції: Включено');
      // Додайте код для відображення акційних товарів
    } else {
      console.log('Товари на акції: Вимкнено');
      // Додайте код для приховування акційних товарів
    }
  };

  return (
    <div className={styles.toggleContainer}>
      <label className={styles.toggleLabel}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
          className={styles.toggleCheckbox}
        />
        <span className={styles.toggleSlider}></span>
      </label>
      <span className={styles.toggleText}>Товари на акції</span>
    </div>
  );
};

export default ToggleCheckbox;
