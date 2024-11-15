import Link from 'next/link';
import React, { useEffect } from 'react';
import styles from '../../styles/MainPageHeader-styles.module.css';
import { useWares } from '@/pages/api/WareApi';
import { getDecodedToken } from '@/pages/api/TokenApi';
import useQueryStore from '@/store/query';

export default function MainPageHeaderFavoriteButton(props: any) {
    //console.log("Favorite button clicked with props:", props);
    const { RefetchFavoriteWares, setRefetchFavoriteWares } = useQueryStore();
    // Отримуємо дані через useWares
    const { data: favoriteWares = [], isLoading, isSuccess, refetch } = useWares({
        SearchParameter: "GetFavoritesByCustomerId",
        CustomerId: getDecodedToken()?.nameid
    });
    useEffect(() => {
        if (RefetchFavoriteWares) {
            refetch();  // Перезапуск запиту при зміні RefetchFavoriteWares
            setRefetchFavoriteWares(false);  // Скидаємо стан refetch після виконання запиту
        }
    }, [RefetchFavoriteWares, refetch, setRefetchFavoriteWares]);
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