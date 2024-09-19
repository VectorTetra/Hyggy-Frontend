import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from '../../styles/MainPageHeader-styles.module.css';
function MainPageHeaderMenu(props) {
  return (
    <div id={styles.mainPageHeaderLogoContainer}>
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
      <Link href="/page">Меню</Link>
    </div>
  );
}
export default MainPageHeaderMenu;
