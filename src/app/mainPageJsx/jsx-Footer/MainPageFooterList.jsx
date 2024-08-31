import React from "react";
import styles from "../../mainPageStyles/MainPageFooter-styles.module.css";
import MainPageFooterMessenger from "./MainPageFooterMessenger";
import MainPageFooterAddress from "./MainPageFooterAddress";
import Link from "next/link";
function MainPageFooterList(props) {
  return (
    <div className={styles.flexContainer}>
      <div className={styles["footer-container"]}>
      {props.text.map((item) => (
        <div key={item.nameCategory} className={styles.flexItem}>
          <div className={styles["footer-item"]}>{item.nameCategory}</div>
          {item.listCategory.map((subItem) => (
            <div>
              <Link
                className={styles["footer-itemA"]}
                href={subItem.urlcategory}
                key={subItem.name}
              >
                {subItem.name}
              </Link>
            </div>
          ))}
        </div>
        
      ))}
      <MainPageFooterAddress 
			caption1={props.footerData.address.caption}
			city1 = {props.footerData.address.city}
			address1 = {props.footerData.address.address}/>
    </div>
      <div className={styles["footer-messenger"]}>
			<MainPageFooterMessenger messenger={props.footerData.messenger}/>
			</div>
    </div>
    
  );
}
export default MainPageFooterList;
