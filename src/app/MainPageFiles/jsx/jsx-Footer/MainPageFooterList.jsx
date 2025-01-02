import React from "react";
import styles from '../../styles/MainPageFooter-styles.module.css';
import MainPageFooterMessenger from "./MainPageFooterMessenger";
import MainPageFooterAddress from "./MainPageFooterAddress";
import Link from "next/link";
import { isUser } from "@/pages/api/TokenApi";

export default function MainPageFooterList(props) {
  const userStatus = isUser();
  return (
    <div className={styles.flexContainer}>
      <div className={styles["footer-container"]}>
        {props.text.map((item, index) => (
          <div key={item.nameCategory} className={styles.flexItem}>
            <div className={styles["footer-item"]}>{item.nameCategory}</div>
            {item.listCategory.map((subItem) => (
              (userStatus && subItem.alt === "admin panel") ? null : (
                <div key={subItem.name}>
                  <Link prefetch={true}
                    className={styles["footer-itemA"]}
                    href={subItem.urlcategory}
                  >
                    {subItem.name}
                  </Link>
                </div>
              )
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
