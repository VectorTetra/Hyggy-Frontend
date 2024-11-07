import Link from 'next/link';
import React from 'react';
import styles from '../../styles/MainPageHeader-styles.module.css';
import { useWares } from '@/pages/api/WareApi';
import { getDecodedToken } from '@/pages/api/TokenApi';

export default function MainPageHeaderFavoriteButton(props: any) {
    console.log("Favorite button clicked with props:", props);
    // Отримуємо дані через useWares
    const { data: favoriteWares = [], isLoading, isSuccess, refetch } = useWares({
        SearchParameter: "GetFavoritesByCustomerId",
        CustomerId: getDecodedToken()?.nameid
    });
    return (
        <Link href={{ pathname: "../PageProfileUser", query: { tab: 'favorites' } }} className={styles.mainPageHeaderItem}>

            <div style={{ position: "relative" }}>
                <img id={styles.mainPageHeaderUserPhoto} src={props.favoritePhotoUrl} alt="logo" />
                {/* Відображаємо кількість товарів, якщо вона більша за 0 */}
                {favoriteWares.length > 0 && (
                    <div className={styles.favoriteQuantityBadge}>
                        {favoriteWares.length}
                    </div>
                )}
            </div>
            <div className={styles.disappearOnAdapt}>Обране</div>
        </Link>
    );
}