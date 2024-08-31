import React from 'react';
import styles from '../../styles/MainPageFooter-styles.module.css';
import MainPageFooterList from "./MainPageFooterList";
function MainPageFooter(props) {
	return (
		<div className={styles.footer}>
			<div>
			<MainPageFooterList text={props.footerData.category} footerData={props.footerData}/>
			</div>
		</div>		
	)
}
export default MainPageFooter;
  