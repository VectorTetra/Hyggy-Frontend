import React from "react";
import Image from "next/image";
import styles from '../../styles/MainPageHeader-styles.module.css';

function MainPageHeaderMenu(props) {

  const handleMenuClick = () => {
    console.log('Меню нажато');
    onMenuClick(); // Вызовите переданную функцию
  };

  const { onMenuClick, photoUrl, photoWidth, photoHeight } = props;
  return (
    <div onClick={handleMenuClick} className={styles.mainPageHeaderItem}>
      <Image
        id={styles.mainPageHeaderMenu}
        src={photoUrl}
        alt="logo"
        style={{
          cursor: "pointer"
        }}
        width={photoWidth}
        height={photoHeight}
        priority
      />
      <div className={styles.disappearOnAdapt} style={{ cursor: "pointer" }}>Меню</div>
    </div>
  );
}
export default MainPageHeaderMenu;
