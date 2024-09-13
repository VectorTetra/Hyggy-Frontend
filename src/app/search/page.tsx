// src/app/search/page.tsx
"use client"; // Завжди на стороні клієнта
import styles from "./page.module.css";
import { Ware, Article } from "@/types/searchTypes";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from "../sharedComponents/Layout";
import TabBar from "./tsx/TabBar";
import SearchHeader from "./tsx/SearchHeader";
import FilterBar from "./tsx/FilterBar";
import Loading from "./loading";
import WareGrid from "./tsx/WareGrid";
import ArticleGrid from "./tsx/ArticleGrid";
import FilterSidebar from "./tsx/FilterSidebar";
import { handleSearch, sortWares } from "@/services/searchPageLogic";
import useSearchStore, { Filter } from "@/store/search"; // Імпортуємо Zustand store
import { isEqual } from "lodash";

export default function SearchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{
    foundWares: Ware[];
    foundArticles: Article[];
  }>({
    foundWares: [],
    foundArticles: [],
  });

  const searchParams = useSearchParams();

  const { setMinPossible, setMaxPossible, waresBeforeCategories, setWaresBeforeCategories, activeTab, setActiveTab } = useSearchStore(); // Додаємо стан для мін і макс можливих цін
  const [query, setQuery] = useState<string>("");


  // useEffect(() => {
  //   // Сховати стандартну поведінку прокрутки при зміні URL
  //   router.beforePopState(() => {
  //     return false;
  //   });
  // }, [router]);

  useEffect(() => {
    async function performSearch() {
      if (!loading) {
        setLoading(true);
      }
      try {
        const receivedQuery = searchParams?.get("query") ?? "";
        if (query !== receivedQuery) setQuery(receivedQuery);
        const receivedType = searchParams?.get("type") ?? "wares";
        if (activeTab !== receivedType) setActiveTab(receivedType);

        let { foundWares, foundArticles } = await handleSearch(query);

        // Визначення мінімальної та максимальної ціни з результатів пошуку
        const prices = foundWares.map((ware) => Math.ceil(ware.price * ((100 - ware.discount) / 100)));
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Встановлення мінімальних та максимальних можливих цін у Zustand
        setMinPossible(minPrice);
        setMaxPossible(maxPrice);

        // Отримуємо ціновий діапазон з URL параметрів
        const priceFromUrl = searchParams?.get("f_0");

        // Фільтруємо товари на основі цінового діапазону з URL
        if (priceFromUrl) {
          const minUrlPrice = Number(priceFromUrl.split("_")[0]);
          const maxUrlPrice = Number(priceFromUrl.split("_")[1]);

          foundWares = foundWares.filter((ware) => {
            const price = Math.ceil(ware.price * ((100 - ware.discount) / 100));
            return price >= minUrlPrice && price <= maxUrlPrice;
          });
        }

        // Сортуємо товари з обох списків, щоб уникнути зайвих перерендерів списку категорій товарів
        const sortedWares = sortWares(foundWares);
        const sortedWaresBeforeCategories = sortWares(waresBeforeCategories);
        if (!isEqual(sortedWares, sortedWaresBeforeCategories)) {
          setWaresBeforeCategories(foundWares);
        }
        const categoriesFromUrl = (searchParams?.get("f_1")?.split("|") || []).filter(Boolean);
        console.log(categoriesFromUrl);
        // Фільтруємо товари на основі категорій з URL
        if (categoriesFromUrl.length > 0) {
          foundWares = foundWares.filter((ware) => {
            return categoriesFromUrl.includes(ware.category);
          });
        }

        const trademarksFromUrl = (searchParams?.get("f_2")?.split("|") || []).filter(Boolean);
        console.log('trademarksFromUrl', trademarksFromUrl);
        // Фільтруємо товари на основі брендів з URL
        if (trademarksFromUrl.length > 0) {
          foundWares = foundWares.filter((ware) => {
            return trademarksFromUrl.includes(ware.trademark);
          });
        }

        const statusesFromUrl = (searchParams?.get("f_3")?.split("|") || []).filter(Boolean);
        console.log('statusesFromUrl', statusesFromUrl);

        // Filter wares based on statuses from the URL, but now requiring all statuses to be present
        if (statusesFromUrl.length > 0) {
          foundWares = foundWares.filter((ware) => {
            return statusesFromUrl.every((status) => ware.tag.includes(status));
          });
        }

        setResults({ foundWares, foundArticles });

      } catch (error) {
        console.error("Error during search:", error);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [searchParams]);

  if (loading) {
    return (
      <Layout headerType="header1" footerType="footer1">
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout headerType="header1" footerType="footer1">
      <div className={styles.main}>
        <TabBar
          waresQuantity={results.foundWares.length}
          articlesQuantity={results.foundArticles.length}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          query={query}
        />
        <SearchHeader
          foundWaresQuantity={results.foundWares.length}
          foundArticlesQuantity={results.foundArticles.length}
          activeTab={activeTab}
          query={query}
        />
        {activeTab === "wares" && <FilterBar />}

        {activeTab === "wares" && <WareGrid wares={results.foundWares} />}
        {activeTab === "articles" && <ArticleGrid articles={results.foundArticles} />}

        <FilterSidebar wares={waresBeforeCategories} foundWares={results.foundWares} />
      </div>
    </Layout>
  );
}
