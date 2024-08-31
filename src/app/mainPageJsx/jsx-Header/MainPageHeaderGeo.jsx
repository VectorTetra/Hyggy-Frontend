import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../../mainPageStyles/MainPageHeader-styles.module.css";

function MainPageHeaderGeo(props) {
  return (
    <div id={styles.mainPageHeaderLogoContainer}>
      <img
        id={styles.mainPageHeaderGeoPhoto}
        src={props.GeoPhotoUrl}
        alt="GeoPhoto"
      />
      <Link className={styles.geoText} href="/">
        Виберіть магазин Hyggy
      </Link>
      <img
        id={styles.mainPageHeaderGeoKursor}
        src={props.GeoKursorUrl}
        alt="GeoPhoto"
      />
    </div>
  );
}

export default MainPageHeaderGeo;
