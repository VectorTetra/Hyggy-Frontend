import React from 'react';
import MainPageHeaderLogo from './MainPageHeaderLogo';
import MainPageHeaderMenu from './MainPageHeaderMenu';
import MainPageHeaderSearch from './MainPageHeaderSearch';
import MainPageHeaderUser from './MainPageHeaderUser';
import MainPageHeaderBasket from './MainPageHeaderBasket';
import MainPageHeaderGeo from './MainPageHeaderGeo';
import MainPageHeaderNavbar from './MainPageHeaderNavbar';
import MainPageSale from './MainPageSale';
import styles from '../../styles/MainPageHeader-styles.module.css';

function MainPageHeader(props) {
	//console.log("MainPageHeader props header data:",props.headerData.headerData.hyggyLogo);
	return (
	 	<div id={styles.mainPageHeader}>
	 		<MainPageSale infoSales = {props.headerData.info}/>
			<div id={styles.mainPageHeaderLogoContainer}>			 
				<MainPageHeaderLogo logoHeight={props.headerData.hyggyLogo.height}
				logoWidth={props.headerData.hyggyLogo.width}
				logoUrl={props.headerData.hyggyLogo.url} />
				<MainPageHeaderMenu photoHeight={props.headerData.menuPhoto.height}
				photoWidth={props.headerData.menuPhoto.width}
				photoUrl={props.headerData.menuPhoto.url} />
				<MainPageHeaderSearch searchText={props.headerData.menuSearch.text} />
				<MainPageHeaderUser userPhotoHeight={props.headerData.userPhoto.height}
				userPhotoWidth={props.headerData.userPhoto.width}
				userPhotoUrl={props.headerData.userPhoto.url}/>
				<MainPageHeaderBasket basketPhotoHeight={props.headerData.basketPhoto.height}
				basketPhotoWidth={props.headerData.basketPhoto.width}
				basketPhotoUrl={props.headerData.basketPhoto.url}/>
			</div>
				<hr id={styles.horizontalBar} />
			<div id={styles.mainPageHeaderLogoContainer}>
				<MainPageHeaderGeo GeoPhotoHeight={props.headerData.GeoPhoto.height}
				GeoPhotoWidth={props.headerData.GeoPhoto.width}
				GeoPhotoUrl={props.headerData.GeoPhoto.url}
				GeoKursorHeight={props.headerData.GeoKursor.height}
				GeoKursorWidth={props.headerData.GeoKursor.width}
				GeoKursorUrl={props.headerData.GeoKursor.url}/>
				<MainPageHeaderNavbar navBar={props.headerData.navBar}/>
			</div>
				<hr id={styles.horizontalBar2} />
		</div>			
	)
}
export default MainPageHeader;