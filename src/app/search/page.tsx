// src/app/search/page.tsx
"use client"; // Завжди на стороні клієнта
import styles from "./page.module.css";
import { Ware, Article } from "@/types/searchTypes";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "../sharedComponents/Layout";
import TabBar from "./tsx/TabBar";
import SearchHeader from "./tsx/SearchHeader";
import FilterBar from "./tsx/FilterBar";
import Loading from "./loading";
import WareGrid from "./tsx/WareGrid";
import ArticleGrid from "./tsx/ArticleGrid";
import FilterSidebar from "./tsx/FilterSidebar";
import { handleSearch } from "@/services/searchPageLogic";
import useSearchStore from "@/store/search"; // Імпортуємо Zustand store

export default function SearchPage() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{
    foundWares: Ware[];
    foundArticles: Article[];
  }>({
    foundWares: [],
    foundArticles: [],
  });

  const searchParams = useSearchParams();

  const { setMinPossible, setMaxPossible, isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab } = useSearchStore(); // Додаємо стан для мін і макс можливих цін
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const receivedQuery = searchParams?.get("query") ?? "";
    setQuery(receivedQuery);
    const receivedType = searchParams?.get("type") ?? "wares";
    setActiveTab(receivedType);
  }, [searchParams]);

  useEffect(() => {
    async function performSearch() {
      if (!loading) {
        setLoading(true);
      }
      try {
        let { foundWares, foundArticles } = await handleSearch(query);

        // Визначення мінімальної та максимальної ціни з результатів пошуку
        const prices = foundWares.map((ware) => Math.ceil(ware.price * ((100 - ware.discount) / 100)));
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Встановлення мінімальних та максимальних можливих цін у Zustand
        setMinPossible(minPrice);
        setMaxPossible(maxPrice);

        // Отримуємо ціновий діапазон з URL параметрів
        const minPriceFromUrl = searchParams?.get("min");
        const maxPriceFromUrl = searchParams?.get("max");

        // Фільтруємо товари на основі цінового діапазону з URL
        if (minPriceFromUrl && maxPriceFromUrl) {
          const minUrlPrice = Number(minPriceFromUrl);
          const maxUrlPrice = Number(maxPriceFromUrl);

          foundWares = foundWares.filter((ware) => {
            const price = Math.ceil(ware.price * ((100 - ware.discount) / 100));
            return price >= minUrlPrice && price <= maxUrlPrice;
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
  }, [query, searchParams, setMinPossible, setMaxPossible]);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
        {activeTab === "wares" && <FilterBar toggleSidebar={toggleSidebar} />}

        {activeTab === "wares" && <WareGrid wares={results.foundWares} />}
        {activeTab === "articles" && <ArticleGrid articles={results.foundArticles} />}

        <FilterSidebar />
      </div>
    </Layout>
  );
}
