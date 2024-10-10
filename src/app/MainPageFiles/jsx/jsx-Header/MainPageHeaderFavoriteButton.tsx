import Link from 'next/link';
import React from 'react';
import styles from '../../styles/MainPageHeader-styles.module.css';
function MainPageHeaderFavoriteButton(props: any) {
    return (
        <Link href="/PageAuthentication" className={styles.mainPageHeaderItem}>
            <img id={styles.mainPageHeaderUserPhoto} src={props.favoritePhotoUrl} alt="logo" />
            <div className={styles.disappearOnAdapt}>Вхід</div>
        </Link>
    );
}
export default MainPageHeaderFavoriteButton;