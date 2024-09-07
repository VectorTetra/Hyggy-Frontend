"use client"; // Завжди на стороні клієнта
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Імпортуємо useRouter
import styles from "./page.module.css";
import Layout from "../sharedComponents/Layout";
import axios from "axios";
import jsonWares from "./wares.json";
import jsonArticles from "./articles.json";
import TabBar from "./tsx/TabBar";
import SearchHeader from "./tsx/SearchHeader";
import FilterBar from "./tsx/FilterBar";
import convertLayout from "convert-layout";
import Loading from "./loading"; // Імпортуємо компонент Loading
import WareGrid from "./tsx/WareGrid";
import ArticleGrid from "./tsx/ArticleGrid";

async function translateText(text: string, targetLang: string) {
  const response = await axios.post(
    "/api/translate",
    {
      q: text,
      source: "auto",
      target: targetLang,
      format: "text",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.translatedText;
}

async function spellCheck(query: string) {
  const response = await axios.get("/api/spellcheck", { params: { query } });
  return response.data.correctedQuery;
}

function searchWaresAndArticles(query: string) {
  const foundWares = jsonWares.filter((ware) =>
    ware.longName.toLowerCase().includes(query.toLowerCase())
  );
  const foundArticles = jsonArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
  );
  return { foundWares, foundArticles };
}

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("wares");
  const [loading, setLoading] = useState(true); // Стан завантаження

  interface Ware {
    id: number;
    shortName: string;
    longName: string;
    price: number;
    tag: string;
    discount: number;
    deliveryOption: string;
    storeAvailability: string;
    rating: number;
    imageSrc: string;
  }

  interface Article {
    title: string;
    keywords: string[];
  }

  const [results, setResults] = useState<{
    foundWares: Ware[];
    foundArticles: Article[];
  }>({
    foundWares: [],
    foundArticles: [],
  });

  const searchParams = useSearchParams(); // Отримуємо доступ до параметрів запиту через useRouter
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
        setLoading(true); // Встановлюємо стан завантаження перед початком пошуку
      }


      try {
        let foundWares: Ware[] = [];
        let foundArticles: Article[] = [];

        if (query === "") {
          // Показуємо всі товари і статті, коли запит порожній
          foundWares = jsonWares;
          foundArticles = jsonArticles;
        } else {
          // Пошук за первинним запитом
          const initialResults = searchWaresAndArticles(query);
          foundWares = [...initialResults.foundWares];
          foundArticles = [...initialResults.foundArticles];

          // Якщо нічого не знайдено, переклад запиту на українську та повторний пошук
          if (foundWares.length === 0 && foundArticles.length === 0) {
            const translatedText = await translateText(query, "uk");
            const translatedResults = searchWaresAndArticles(translatedText);
            foundWares = translatedResults.foundWares;
            foundArticles = translatedResults.foundArticles;
          }

          // Якщо все ще нічого не знайдено, спробувати з використанням LanguageTool через API
          if (foundWares.length === 0 && foundArticles.length === 0) {
            const correctedResults = await spellCheck(query);
            let additionalWares: Ware[] = [];
            let additionalArticles: Article[] = [];

            // Обробка кожного виправленого запиту
            for (const item of correctedResults) {
              const iteratedResults = searchWaresAndArticles(item);
              additionalWares = [
                ...additionalWares,
                ...iteratedResults.foundWares,
              ];
              additionalArticles = [
                ...additionalArticles,
                ...iteratedResults.foundArticles,
              ];
            }

            // Об'єднання старих і нових результатів
            foundWares = [...foundWares, ...additionalWares];
            foundArticles = [...foundArticles, ...additionalArticles];
          }

          // Видалення повторів
          foundWares = Array.from(new Set(foundWares.map((item) => item.id))).map(
            (id) => foundWares.find((item) => item.id === id)!
          );

          foundArticles = Array.from(
            new Set(foundArticles.map((item) => item.title))
          ).map((title) => foundArticles.find((item) => item.title === title)!);
        }

        // Оновлення результатів
        setResults({ foundWares, foundArticles });
      } catch (error) {
        console.error("Error during search:", error);
      } finally {
        setLoading(false); // Завершення завантаження після виконання пошуку
      }
    }

    performSearch(); // Виклик функції пошуку
  }, [query]);

  // Показуємо компонент loading, доки триває пошук
  if (loading) {
    return (
      <Layout headerType="header1" footerType="footer1">
        <Loading />
      </Layout>
    );
  }

  // Показуємо основний вміст після завершення пошуку
  return (
    <Layout headerType="header1" footerType="footer1">
      <div className={styles.main}>
        <TabBar
          waresQuantity={results.foundWares.length}
          articlesQuantity={results.foundArticles.length}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          query={query} // Передаємо query як пропс
        />
        <SearchHeader
          foundWaresQuantity={
            results.foundWares.length
          }
          foundArticlesQuantity={
            results.foundArticles.length
          }
          activeTab={activeTab}
          query={query} // Передаємо query як пропс
        />
        <FilterBar />
        {activeTab === "wares" && <WareGrid wares={results.foundWares} />}
        {activeTab === "articles" && <ArticleGrid articles={results.foundArticles} />}
      </div>
    </Layout>
  );
}
