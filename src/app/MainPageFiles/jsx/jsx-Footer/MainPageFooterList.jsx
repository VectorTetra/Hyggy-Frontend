import React from "react";
import styles from '../../styles/MainPageFooter-styles.module.css';
import MainPageFooterMessenger from "./MainPageFooterMessenger";
import MainPageFooterAddress from "./MainPageFooterAddress";
import Link from "next/link";

export default function MainPageFooterList(props) {
  return (
    <div className={styles.flexContainer}>
      <div className={styles["footer-container"]}>
        {props.text.map((item, index) => (
          <div key={item.nameCategory} className={styles.flexItem}>
            <div className={styles["footer-item"]}>{item.nameCategory}</div>
            {item.listCategory.map((subItem) => (
              <div key={subItem.name}>
                <Link
                  className={styles["footer-itemA"]}
                  href={subItem.urlcategory}
                >
                  {subItem.name}
                </Link>
              </div>
            ))}
          </div>
        ))}
        <MainPageFooterAddress
          caption1={props.footerData.address.caption}
          city1={props.footerData.address.city}
          address1={props.footerData.address.address}
        />
      </div>
      <div className={styles["footer-messenger"]}>
        <MainPageFooterMessenger messenger={props.footerData.messenger} />
      </div>
    </div>
  );
}
