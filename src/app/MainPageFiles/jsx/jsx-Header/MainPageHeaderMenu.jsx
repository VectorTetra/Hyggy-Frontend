import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from '../../styles/MainPageHeader-styles.module.css';
function MainPageHeaderMenu(props) {
  return (
    <Link href="/page" className={styles.mainPageHeaderItem}>
      <Image
        id={styles.mainPageHeaderMenu}
        src={props.photoUrl}
        alt="logo"
        style={{
          cursor: "pointer"
        }}
        width={props.photoWidth}
        height={props.photoHeight}
        priority
      />
      <div className={styles.disappearOnAdapt}>Меню</div>
    </Link>
  );
}
export default MainPageHeaderMenu;
