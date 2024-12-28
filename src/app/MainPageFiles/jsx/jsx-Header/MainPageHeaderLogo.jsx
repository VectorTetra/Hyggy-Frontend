import React from 'react';
import Link from "next/link";
import styles from '../../styles/MainPageHeader-styles.module.css';

function MainPageHeaderLogo(props) {
	return (
		<div className={`${styles.mainPageHeaderItem} ${styles.notransform}`} id={styles.mainPageHeaderLogoMyContainer}>
			<Link prefetch={true} href="/">
				<img id={styles.mainPageHeaderLogo} src={props.logoUrl} alt="logo"
				/>
			</Link>
		</div>
	);
}

export default MainPageHeaderLogo;