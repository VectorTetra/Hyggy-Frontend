//src/app/search
"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Layout from "../sharedComponents/Layout";
import axios from "axios";
import jsonWares from "./wares.json";
import jsonArticles from "./articles.json";
import TabBar from "./tsx/TabBar";
import SearchHeader from "./tsx/SearchHeader";
import FilterBar from "./tsx/FilterBar";
import convertLayout from "convert-layout";

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
      article.keywords.includes(query)
  );
  return { foundWares, foundArticles };
}

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("wares");

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

  const [query, setQuery] = useState("lamp");

  useEffect(() => {
    async function performSearch() {
      try {
        let foundWares: Ware[] = [];
        let foundArticles: Article[] = [];

        // Пошук за первинним запитом
        const initialResults = searchWaresAndArticles(query);
        foundWares = [...initialResults.foundWares];
        foundArticles = [...initialResults.foundArticles];
        console.log("Initial foundWares:", foundWares);
        console.log("Initial foundArticles:", foundArticles);

        // Якщо нічого не знайдено, переклад запиту на українську та повторний пошук
        if (foundWares.length === 0 && foundArticles.length === 0) {
          const translatedText = await translateText(query, "uk");
          console.log("Translated Text (EN to UA):", translatedText);

          const translatedResults = searchWaresAndArticles(translatedText);
          foundWares = [...foundWares, ...translatedResults.foundWares];
          foundArticles = [...foundArticles, ...translatedResults.foundArticles];
          console.log("Translated foundWares:", foundWares);
          console.log("Translated foundArticles:", foundArticles);
        }
        // Якщо все ще нічого не знайдено, спробувати з конвертацією розкладки
        if (foundWares.length === 0 && foundArticles.length === 0) {
          const convertedQuery = convertLayout.ru.toEn(query);

          const convertedResults = searchWaresAndArticles(convertedQuery);
          foundWares = [...foundWares, ...convertedResults.foundWares];
          foundArticles = [...foundArticles, ...convertedResults.foundArticles];
          console.log("Converted foundWares:", foundWares);
          console.log("Converted foundArticles:", foundArticles);
        }

        // Якщо знову нічого не знайдено, спробувати з використанням typo-js через API
        if (foundWares.length === 0 && foundArticles.length === 0) {
          const correctedQuery = await spellCheck(query);

          const correctedResults = searchWaresAndArticles(correctedQuery);
          foundWares = [...foundWares, ...correctedResults.foundWares];
          foundArticles = [...foundArticles, ...correctedResults.foundArticles];
          console.log("Corrected foundWares:", foundWares);
          console.log("Corrected foundArticles:", foundArticles);
        }

        // Видалення повторів
        foundWares = Array.from(new Set(foundWares.map((item) => item.id))).map(
          (id) => foundWares.find((item) => item.id === id)!
        );

        foundArticles = Array.from(
          new Set(foundArticles.map((item) => item.title))
        ).map((title) => foundArticles.find((item) => item.title === title)!);

        // Оновлення результатів
        setResults({ foundWares, foundArticles });
      } catch (error) {
        console.error("Error during search:", error);
      }
    }

    performSearch(); // Виклик функції пошуку
  }, [query]);

  return (
    <Layout headerType="header1" footerType="footer1">
      <div className={styles.main}>
        <TabBar
          waresQuantity={results.foundWares.length}
          pagesQuantity={results.foundArticles.length}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          query={query}
        />
        <SearchHeader
          resultsQuantity={
            results.foundWares.length + results.foundArticles.length
          }
          query={query}
        />
        <FilterBar />
      </div>
    </Layout>
  );
}
