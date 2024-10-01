import React from "react";
import Link from "next/link";
import styles from '../../styles/MainPageHeader-styles.module.css';

function MainPageHeaderGeo(props) {
  return (
    <div className={styles.geoblock} >
      <img
        className={styles.mainPageHeaderGeoPhoto}
        src={props.GeoPhotoUrl}
        alt="GeoPhoto"
      />
      <Link className={styles.geoText} href="/">
        Виберіть магазин Hyggy
      </Link>
      <img
        className={styles.mainPageHeaderGeoKursor}
        src={props.GeoKursorUrl}
        alt="GeoPhoto"
      />
    </div>
  );
}

export default MainPageHeaderGeo;
