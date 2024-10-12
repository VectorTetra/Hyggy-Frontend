import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from '../../styles/MainPageHeader-styles.module.css';
function MainPageHeaderBasket(props) {

  return (
    <Link href="/cart" className={styles.mainPageHeaderItem}>
      <Image
        className={styles.mainPageHeaderBasketPhoto}
        src={props.basketPhotoUrl}
        alt="logo"
        width={props.basketPhotoWidth}
        height={props.basketPhotoHeight}
        priority={true}
      />
      <div className={styles.disappearOnAdapt}>Кошик</div>
    </Link>
  );
}
export default MainPageHeaderBasket;
