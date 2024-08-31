import React from 'react';
import Link from "next/link";
import Image from "next/image";
import styles from "../../mainPageStyles/MainPageHeader-styles.module.css";

function MainPageHeaderLogo(props) {
	return (
		<div className={styles.mainPageHeaderLogoContainer}>
			<Link href="/">
				<img id={styles.mainPageHeaderLogo} src={props.logoUrl} alt="logo" 		
				/>
			</Link>
		</div>
	);
}

export default MainPageHeaderLogo;