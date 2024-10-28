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
import { CircularProgress } from "@mui/material";


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
  const [query] = useQueryState("query", { scroll: false, history: "replace", shallow: true });
  const [type] = useQueryState("type", { scroll: false, history: "replace", shallow: true });
  const [priceRange] = useQueryState("f_0", { scroll: false, history: "replace", shallow: true });
  const [categories] = useQueryState("f_1", { scroll: false, history: "replace", shallow: true });
  const [trademarks] = useQueryState("f_2", { scroll: false, history: "replace", shallow: true });
  const [statuses] = useQueryState("f_3", { scroll: false, history: "replace", shallow: true });
  const [sale] = useQueryState("f_4", { scroll: false, history: "replace", shallow: true });
  const [sort] = useQueryState("sort", { scroll: false, history: "replace", shallow: true });

  const { setMinPossible, setMaxPossible,
    waresBeforeCategories, setWaresBeforeCategories,
    activeTab, setActiveTab, isSidebarOpen, isSortingSidebarOpen } = useSearchStore(); // Додаємо стан для мін і макс можливих цін
  useEffect(() => {
    (isSidebarOpen || isSortingSidebarOpen) ? document.body.style.overflow = "hidden" : document.body.style.overflow = ""; // Блокуємо/розблоковуємо скрол
  }, []);

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
            return categoriesFromUrl.includes(ware.wareCategory3Name);
          });
        }

        const trademarksFromUrl = trademarks ? trademarks.split("|").filter(Boolean) : [];
        if (trademarksFromUrl.length > 0) {
          foundWares = foundWares.filter((ware) => {
            return ware.trademarkName && trademarksFromUrl.includes(ware.trademarkName);
          });
        }

        const statusesFromUrl = statuses ? statuses.split("|").filter(Boolean) : [];
        if (statusesFromUrl.length > 0) {
          foundWares = foundWares.filter((ware) => {
            return statusesFromUrl.every((status) => ware.statusNames.includes(status));
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
        <CircularProgress size={100} sx={{ display: "flex", margin: "0 auto" }} />
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
        <div style={{ minHeight: "32px", margin: "16px 0" }}>
          <FilterStickerPanel />
        </div>
        {activeTab === "wares" && <WareGrid wares={results.foundWares} />}
        {activeTab === "articles" && <ArticleGrid articles={results.foundArticles} />}
        <FilterSidebar wares={waresBeforeCategories} foundWares={results.foundWares} />
        <SortingSidebar />
      </div>
    </Layout>
  );
}
