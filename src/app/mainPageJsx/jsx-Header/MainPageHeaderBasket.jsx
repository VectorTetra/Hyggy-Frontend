import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../../mainPageStyles/MainPageHeader-styles.module.css";
function MainPageHeaderBasket(props) {
  
  return (
    <div id={styles.mainPageHeaderLogoContainer}>
      <img
        className={styles.mainPageHeaderBasketPhoto}
        src={props.basketPhotoUrl}
        alt="logo"
        width={props.basketPhotoWidth}
        height={props.basketPhotoHeight}
      />
      <Link href="/">Кошик</Link>
    </div>
  );
}
export default MainPageHeaderBasket;
