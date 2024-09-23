import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from '../../styles/MainPageHeader-styles.module.css';
function MainPageHeaderBasket(props) {

  return (
    <div id={styles.mainPageHeaderLogoContainer}>
      <Image
        className={styles.mainPageHeaderBasketPhoto}
        src={props.basketPhotoUrl}
        alt="logo"
        width={props.basketPhotoWidth}
        height={props.basketPhotoHeight}
        priority={true}
      />
      <Link href="/">Кошик</Link>
    </div>
  );
}
export default MainPageHeaderBasket;
