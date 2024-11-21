import React from 'react';
import styles from '../../styles/MainPageFooter-styles.module.css';
function MainPageFooterAddress(props) {

  return (
    <div className={`${styles["footer-address"]} ${styles["flexItem"]}`}>
      <div className={`${styles["footer-itemB"]}`}>{props.caption1}</div>

      <div>{props.city1}</div>
      <div>{props.address1}</div>
    </div>
  );
}
export default MainPageFooterAddress;