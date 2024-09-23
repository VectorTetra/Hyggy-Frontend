import Link from 'next/link';
import React from 'react';
import styles from '../../styles/MainPageHeader-styles.module.css';
function MainPageHeaderUser(props) {
    return (
        <div id={styles.mainPageHeaderLogoContainer}>
            <img id={styles.mainPageHeaderUserPhoto} src={props.userPhotoUrl} alt="logo" />
            <Link href="/PageAuthentication">
                Вхід
            </Link>
        </div>
    );
}
export default MainPageHeaderUser;