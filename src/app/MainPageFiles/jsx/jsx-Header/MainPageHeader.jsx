"use client";
import React from 'react';
import MainPageHeaderLogo from './MainPageHeaderLogo';
import MainPageHeaderMenu from './MainPageHeaderMenu';
import MainPageHeaderSearch from './MainPageHeaderSearch';
import MainPageHeaderUser from './MainPageHeaderUser';
import MainPageHeaderFavoriteButton from './MainPageHeaderFavoriteButton';
import MainPageHeaderBasket from './MainPageHeaderBasket';
import MainPageHeaderGeo from './MainPageHeaderGeo';
import MainPageHeaderNavbar from './MainPageHeaderNavbar';
import MainPageSale from './MainPageSale';
import styles from '../../styles/MainPageHeader-styles.module.css';
import useAuthorizeStore from '@/store/authorize';

function MainPageHeader({ headerData }) {  // Передаем onMenuClick через пропсы
	const { isAuthorized } = useAuthorizeStore();

	return (
		<div id={styles.mainPageHeader}>
			<MainPageSale infoSales={headerData.info} />
			<div id={styles.mainPageHeaderLogoContainer}>
				<div style={{ display: "flex" }}>
					<MainPageHeaderLogo
						logoHeight={headerData.hyggyLogo.height}
						logoWidth={headerData.hyggyLogo.width}
						logoUrl={headerData.hyggyLogo.url}
					/>
					{/* Передаем onMenuClick в MainPageHeaderMenu */}
					<MainPageHeaderMenu
						photoHeight={headerData.menuPhoto.height}
						photoWidth={headerData.menuPhoto.width}
						photoUrl={headerData.menuPhoto.url}
					/>
				</div>
				<MainPageHeaderSearch searchText={headerData.menuSearch.text} />
				<div style={{ display: "flex" }}>
					{isAuthorized && (
						<MainPageHeaderFavoriteButton
							favoritePhotoHeight={headerData.favoritePhoto.height}
							favoritePhotoWidth={headerData.favoritePhoto.width}
							favoritePhotoUrl={headerData.favoritePhoto.url}
						/>
					)}
					<MainPageHeaderUser
						userPhotoHeight={headerData.userPhoto.height}
						userPhotoWidth={headerData.userPhoto.width}
						userPhotoUrl={headerData.userPhoto.url}
					/>
					<MainPageHeaderBasket
						basketPhotoHeight={headerData.basketPhoto.height}
						basketPhotoWidth={headerData.basketPhoto.width}
						basketPhotoUrl={headerData.basketPhoto.url}
					/>
				</div>
			</div>
			<hr id={styles.horizontalBar} />

			<div className={styles.navbarcontainer}>
				<MainPageHeaderGeo
					GeoPhotoHeight={headerData.GeoPhoto.height}
					GeoPhotoWidth={headerData.GeoPhoto.width}
					GeoPhotoUrl={headerData.GeoPhoto.url}
					GeoKursorHeight={headerData.GeoKursor.height}
					GeoKursorWidth={headerData.GeoKursor.width}
					GeoKursorUrl={headerData.GeoKursor.url}
				/>
				<MainPageHeaderNavbar navBar={headerData.navBar} />
			</div>
			<hr id={styles.horizontalBar2} />
		</div>
	)
}

export default MainPageHeader;
