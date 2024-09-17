"use client"; // Завжди на стороні клієнта
import styles from "./page.module.css";
import { Ware, Article } from "@/types/searchTypes";
import { useState, useEffect } from "react";
import Layout from "../sharedComponents/Layout";
import TabBar from "./tsx/TabBar";
import SearchHeader from "./tsx/SearchHeader";
import FilterBar from "./tsx/FilterBar";
import Loading from "./loading";
import WareGrid from "./tsx/WareGrid";
import ArticleGrid from "./tsx/ArticleGrid";
import FilterSidebar from "./tsx/FilterSidebar";
import FilterStickerPanel from "./tsx/FilterStickerPanel";
import { handleSearch, sortWares } from "@/services/searchPageLogic";
import useSearchStore from "@/store/search"; // Імпортуємо Zustand store
import { isEqual } from "lodash";
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
import SortingSidebar from "./tsx/SortingSidebar";

export default function SearchPage() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{
    foundWares: Ware[];
    foundArticles: Article[];
  }>({
    foundWares: [],
    foundArticles: [],
  });

  // Використовуємо nuqs для зчитування параметрів запиту
  const [query] = useQueryState("query");
  const [type] = useQueryState("type");
  const [priceRange] = useQueryState("f_0");
  const [categories] = useQueryState("f_1");
  const [trademarks] = useQueryState("f_2");
  const [statuses] = useQueryState("f_3");
  const [sale] = useQueryState("f_4");
  const [sort] = useQueryState("sort");

  const { setMinPossible, setMaxPossible,
    waresBeforeCategories, setWaresBeforeCategories,
    activeTab, setActiveTab } = useSearchStore(); // Додаємо стан для мін і макс можливих цін

  useEffect(() => {
    async function performSearch() {
      if (!loading) {
        setLoading(true);
      }
      try {
        if (activeTab !== type) setActiveTab(type || "wares");

        let { foundWares, foundArticles } = await handleSearch(query || "");

        const prices = foundWares.map((ware) => Math.ceil(ware.price * ((100 - ware.discount) / 100)));
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        setMinPossible(minPrice);
        setMaxPossible(maxPrice);

        if (priceRange) {
          const minUrlPrice = Number(priceRange.split("_")[0]);
          const maxUrlPrice = Number(priceRange.split("_")[1]);

          foundWares = foundWares.filter((ware) => {
            const price = Math.ceil(ware.price * ((100 - ware.discount) / 100));
            return price >= minUrlPrice && price <= maxUrlPrice;
          });
        }

        const sortedWares = sortWares(foundWares);
        const sortedWaresBeforeCategories = sortWares(waresBeforeCategories);
        if (!isEqual(sortedWares, sortedWaresBeforeCategories)) {
          setWaresBeforeCategories(foundWares);
        }

        const categoriesFromUrl = categories ? categories.split("|").filter(Boolean) : [];
        if (categoriesFromUrl.length > 0) {
          foundWares = foundWares.filter((ware) => {
            return categoriesFromUrl.includes(ware.category);
          });
        }

        const trademarksFromUrl = trademarks ? trademarks.split("|").filter(Boolean) : [];
        if (trademarksFromUrl.length > 0) {
          foundWares = foundWares.filter((ware) => {
            return ware.trademark && trademarksFromUrl.includes(ware.trademark);
          });
        }

        const statusesFromUrl = statuses ? statuses.split("|").filter(Boolean) : [];
        if (statusesFromUrl.length > 0) {
          foundWares = foundWares.filter((ware) => {
            return statusesFromUrl.every((status) => ware.tag.includes(status));
          });
        }

        if (sale) {
          foundWares = foundWares.filter((ware) => ware.discount > 0);
        }
        foundWares = sortWares(foundWares, sort || "default");
        setResults({ foundWares, foundArticles });

      } catch (error) {
        console.error("Error during search:", error);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [query, type, priceRange, categories, trademarks, statuses, sale, sort]);

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
        <FilterStickerPanel />
        {activeTab === "wares" && <WareGrid wares={results.foundWares} />}
        {activeTab === "articles" && <ArticleGrid articles={results.foundArticles} />}
        <FilterSidebar wares={waresBeforeCategories} foundWares={results.foundWares} />
        <SortingSidebar />
      </div>
    </Layout>
  );
}
