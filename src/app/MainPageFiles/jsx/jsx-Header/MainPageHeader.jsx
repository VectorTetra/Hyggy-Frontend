"use client";
import { isUser, validateToken } from '@/pages/api/TokenApi';
import styles from '../../styles/MainPageHeader-styles.module.css';
import MainPageHeaderBasket from './MainPageHeaderBasket';
import MainPageHeaderFavoriteButton from './MainPageHeaderFavoriteButton';
import MainPageHeaderGeo from './MainPageHeaderGeo';
import MainPageHeaderLogo from './MainPageHeaderLogo';
import MainPageHeaderMenu from './MainPageHeaderMenu';
import MainPageHeaderNavbar from './MainPageHeaderNavbar';
import MainPageHeaderSearch from './MainPageHeaderSearch';
import MainPageHeaderUser from './MainPageHeaderUser';
import MainPageSale from './MainPageSale';

function MainPageHeader(props) {

	const isAuthorized = validateToken().status === 200 && isUser();

	return (
		<div id={styles.mainPageHeader}>
			<MainPageSale infoSales={props.headerData.info} />
			<div id={styles.mainPageHeaderLogoContainer}>
				<div style={{ display: "flex" }}>
					<MainPageHeaderLogo
						className={styles.notransform}
						logoHeight={props.headerData.hyggyLogo.height}
						logoWidth={props.headerData.hyggyLogo.width}
						logoUrl={props.headerData.hyggyLogo.url} />
					<MainPageHeaderMenu photoHeight={props.headerData.menuPhoto.height}
						photoWidth={props.headerData.menuPhoto.width}
						photoUrl={props.headerData.menuPhoto.url} />
				</div>
				<MainPageHeaderSearch searchText={props.headerData.menuSearch.text} />
				<div className={styles.mainPageHeaderButtonsWrapper} >
					{isAuthorized && <MainPageHeaderFavoriteButton
						favoritePhotoHeight={props.headerData.favoritePhoto.height}
						favoritePhotoWidth={props.headerData.favoritePhoto.width}
						favoritePhotoUrl={props.headerData.favoritePhoto.url}
					/>}
					<MainPageHeaderUser
						userPhotoHeight={props.headerData.userPhoto.height}
						userPhotoWidth={props.headerData.userPhoto.width}
						userPhotoUrl={props.headerData.userPhoto.url} />
					<MainPageHeaderBasket basketPhotoHeight={props.headerData.basketPhoto.height}
						basketPhotoWidth={props.headerData.basketPhoto.width}
						basketPhotoUrl={props.headerData.basketPhoto.url} />
				</div>
			</div>
			<hr id={styles.horizontalBar} />

			<div className={styles.navbarcontainer}>

				<MainPageHeaderGeo GeoPhotoHeight={props.headerData.GeoPhoto.height}
					GeoPhotoWidth={props.headerData.GeoPhoto.width}
					GeoPhotoUrl={props.headerData.GeoPhoto.url}
					GeoKursorHeight={props.headerData.GeoKursor.height}
					GeoKursorWidth={props.headerData.GeoKursor.width}
					GeoKursorUrl={props.headerData.GeoKursor.url} />
				<MainPageHeaderNavbar navBar={props.headerData.navBar} />

			</div>
			<hr id={styles.horizontalBar2} />
		</div>
	)
}
export default MainPageHeader; 