// SearchPage.tsx
"use client"; // Завжди на стороні клієнта
import { Ware, Article } from "@/types/searchTypes";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import Layout from "../sharedComponents/Layout";
import TabBar from "./tsx/TabBar";
import SearchHeader from "./tsx/SearchHeader";
import FilterBar from "./tsx/FilterBar";
import Loading from "./loading";
import WareGrid from "./tsx/WareGrid";
import ArticleGrid from "./tsx/ArticleGrid";
import { handleSearch } from "@/services/searchPageLogic"; // Імпортуємо функцію пошуку

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("wares");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{
    foundWares: Ware[];
    foundArticles: Article[];
  }>({
    foundWares: [],
    foundArticles: [],
  });

  const searchParams = useSearchParams();
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
        const { foundWares, foundArticles } = await handleSearch(query);
        setResults({ foundWares, foundArticles });
      } catch (error) {
        console.error("Error during search:", error);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [query]);

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
        <FilterBar />
        {activeTab === "wares" && <WareGrid wares={results.foundWares} />}
        {activeTab === "articles" && <ArticleGrid articles={results.foundArticles} />}
      </div>
    </Layout>
  );
}
