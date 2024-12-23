"use client";
import React, { useEffect } from "react";
import styles from '../page.module.css';
import WareGrid from "@/app/search/tsx/WareGrid";
import { useWares } from "@/pages/api/WareApi";
import { getDecodedToken } from '@/pages/api/TokenApi';
import { toast } from "react-toastify";
import { Padding } from "@mui/icons-material";

export default function FavoriteWaresUser(props) {

    // Отримуємо дані через useWares
    const { data: favoriteWares = [], isLoading, isSuccess, refetch } = useWares({
        SearchParameter: "GetFavoritesByCustomerId",
        CustomerId: getDecodedToken()?.nameid
    });

    // Явно фетчимо дані при завантаженні компоненту
    useEffect(() => {
        if (isSuccess) {
            refetch(); // Явно викликаємо фетчинг даних після успішного отримання
        }
    }, [isSuccess, refetch]); // Додаємо isSuccess, щоб запит відбувався після того, як дані успішно отримано

    return (
        <div style={{ padding: "0 clamp(0px,4rem,10vw)" }}>
            <h2 className={styles.h2}>Обране</h2>
            {isLoading && <div>Завантаження...</div>}
            {isSuccess && favoriteWares.length === 0 && "У Вас ще немає обраних товарів"}
            {isSuccess && favoriteWares.length > 0 && <WareGrid wares={favoriteWares} itemsPerPage={8} />}
        </div>
    );
}
