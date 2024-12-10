//src\app\sharedComponents\RecentWares.tsx
"use client";
import React from "react";
import WareCarousel from "./WareCarousel";
import useLocalStorageStore from "@/store/localStorage";
import { useWares } from "@/pages/api/WareApi"; // Ваш хук для запитів товарів
import styles from "./css/RecentWares.module.css";

export default function RecentWares() {
    const { recentWareIds } = useLocalStorageStore();
    const { data: recentWares = [], isLoading: dataLoading, isSuccess: success } = useWares({
        SearchParameter: "StringIds",
        StringIds: recentWareIds.join("|"),
        PageNumber: 1,
        PageSize: 20
    }, recentWareIds.length > 0);

    // Повертаємо null, якщо recentWares не масив або порожній масив
    if (!Array.isArray(recentWares) || recentWares.length === 0) {
        return null;
    }

    return (
        <div id={styles.recentWaresWrapper}>
            <h2 style={{
                fontSize: "1.75rem",
                marginBottom: "20px",
                textAlign: "center"
            }}>Нещодавно переглянуті товари</h2>
            <WareCarousel wares={recentWares} />
        </div>
    );
}
