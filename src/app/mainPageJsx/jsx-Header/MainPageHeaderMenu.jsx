import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../../mainPageStyles/MainPageHeader-styles.module.css";
function MainPageHeaderMenu(props) {
  return (
    <div id={styles.mainPageHeaderLogoContainer}>
      <img
        id={styles.mainPageHeaderMenu}
        src={props.photoUrl}
        alt="logo"
        width={props.photoWidth}
        height={props.photoHeight}
      />
      <Link href="../MainPage/index.html">Меню</Link>
    </div>
  );
}
export default MainPageHeaderMenu;
