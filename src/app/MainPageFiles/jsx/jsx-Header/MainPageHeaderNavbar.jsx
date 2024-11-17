import React from 'react';
import Link from "next/link";
import styles from '../../styles/MainPageHeader-styles.module.css';
function MainPageHeaderNavbar(props) {
	return (
		<div className='navbarmenu'>
			{
				props.navBar.map((item, index) => (
					<Link prefetch={true} key={index} className={styles.menuText} href={item.url}>
						{item.nameMenu}
					</Link>
				))
			}
		</div>
	);
}
export default MainPageHeaderNavbar;