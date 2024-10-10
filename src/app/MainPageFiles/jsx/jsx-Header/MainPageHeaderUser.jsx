import Link from 'next/link';
import React from 'react';
import styles from '../../styles/MainPageHeader-styles.module.css';
function MainPageHeaderUser(props) {
    return (
        <Link href="/PageAuthentication" className={styles.mainPageHeaderItem}>
            <img id={styles.mainPageHeaderUserPhoto} src={props.userPhotoUrl} alt="logo" />
            <div className={styles.disappearOnAdapt}>Вхід</div>
        </Link>
    );
}
export default MainPageHeaderUser;