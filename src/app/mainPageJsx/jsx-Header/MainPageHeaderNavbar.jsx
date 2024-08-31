import React from 'react';
import Link from "next/link";
import styles from "../../mainPageStyles/MainPageHeader-styles.module.css";
function MainPageHeaderNavbar(props) {
    return (
			<div style={{ marginLeft: 'auto' }} > 
				{
					props.navBar.map(item => (
					<Link className={styles.menuText} href = {item.url}>
                    {item.nameMenu}
                    </Link>
					))
				}		
            </div>
    );
}
export default MainPageHeaderNavbar;