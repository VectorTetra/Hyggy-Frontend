"use client"; // Завжди на стороні клієнта
import styles from "./page.module.css";
import { useWares, Ware } from "@/pages/api/WareApi";
import { useBlogs, Blog } from "@/pages/api/BlogApi";
import { useState, useEffect } from "react";
import Layout from "../sharedComponents/Layout";
import TabBar from "./tsx/TabBar";
import SearchHeader from "./tsx/SearchHeader";
import FilterBar from "./tsx/FilterBar";
import WareGrid from "./tsx/WareGrid";
import ArticleGrid from "./tsx/ArticleGrid";
import FilterSidebar from "./tsx/FilterSidebar";
import FilterStickerPanel from "./tsx/FilterStickerPanel";
//import { useHandleSearch, sortWares } from "@/services/searchPageLogic";
import useSearchStore from "@/store/search"; // Імпортуємо Zustand store
import { useQueryState, parseAsArrayOf, parseAsJson } from 'nuqs'; // Імпортуємо nuqs
import SortingSidebar from "./tsx/SortingSidebar";
import { CircularProgress } from "@mui/material";
import { useWareCategories3 } from "@/pages/api/WareCategory3Api";
import { useWareTrademarks } from "@/pages/api/WareTrademarkApi";
import { useWareStatuses } from "@/pages/api/WareStatusApi";
import SkeletonPost from "./SkeletonPost"
interface Filter {
  id: string; // або number, в залежності від типу вашого id
  name: string;
}
export default function SearchPage() {
  const [query] = useQueryState("query", { scroll: false, history: "replace", shallow: true });
  const [type] = useQueryState("type", { scroll: false, history: "replace", shallow: true });
  const [priceRange] = useQueryState("f_0", { scroll: false, history: "replace", shallow: true });
  const [categories] = useQueryState<Filter[] | null>("f_1", parseAsArrayOf(parseAsJson()));
  const [trademarks] = useQueryState<Filter[] | null>("f_2", parseAsArrayOf(parseAsJson()));
  const [statuses] = useQueryState<Filter[] | null>("f_3", parseAsArrayOf(parseAsJson()));
  const [sale] = useQueryState("f_4", { scroll: false, history: "replace", shallow: true });
  const [sort] = useQueryState("sort", { scroll: false, history: "replace", shallow: true });
  const [loading, setLoading] = useState(true);
  const { setMinPossible, setMaxPossible, waresBeforeCategories, setWaresBeforeCategories,
    activeTab, setActiveTab, isSidebarOpen, isSortingSidebarOpen } = useSearchStore();

  useEffect(() => {
    (isSidebarOpen || isSortingSidebarOpen) ? document.body.style.overflow = "hidden" : document.body.style.overflow = "";
  }, []);

  const { data: foundWareCategories = [], isLoading: isWareCategories3Loading } = useWareCategories3({
    SearchParameter: "Query",
    QueryAny: query,
    PageNumber: 1,
    PageSize: 1000,
    Sorting: "NameAsc"
  });
  const { data: foundTrademarks = [], isLoading: isWareTrademarksLoading } = useWareTrademarks({
    SearchParameter: "Query",
    PageNumber: 1,
    PageSize: 1000,
    Sorting: "NameAsc"
  });
  const { data: foundWareStatuses = [], isLoading: isWareStatusesLoading } = useWareStatuses({
    SearchParameter: "Query",
    PageNumber: 1,
    PageSize: 1000,
    Sorting: "NameAsc"
  });
  const { data: foundWares = [], isLoading: isFoundWaresLoading } = useWares({
    SearchParameter: "Query",
    QueryAny: query,
    MinPrice: priceRange ? Number(priceRange?.split("_")[0]) : null,
    MaxPrice: priceRange ? Number(priceRange?.split("_")[1]) : null,
    StringCategory3Ids: categories?.map(category => category.id).join('|'),
    StringTrademarkIds: trademarks?.map(trademark => trademark.id).join('|'),
    StringStatusIds: statuses?.map(status => status.id).join('|'),
    Sorting: sort,
    MinDiscount: sale ? 0.1 : null,
    MaxDiscount: sale ? 100 : null,
    PageNumber: 1,
    PageSize: 1000
  });
  const { data: wares = [], isLoading: isWaresLoading } = useWares({
    SearchParameter: "Query",
    QueryAny: query,
    PageNumber: 1,
    PageSize: 1000
  });

  const { data: foundBlogs = [], isLoading: isBlogsLoading } = useBlogs({
    SearchParameter: "Query",
    QueryAny: query,
    PageNumber: 1,
    PageSize: 1000
  });

  useEffect(() => {
    if (!isWaresLoading && wares.length) {
      const prices = wares.map(ware => ware.finalPrice).filter(price => price !== undefined);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setMinPossible(Math.floor(minPrice));
      setMaxPossible(Math.ceil(maxPrice));
    }
  }, [isWaresLoading, wares]);

  const allLoadings = isFoundWaresLoading
    || isWaresLoading
    || isBlogsLoading
    || isWareCategories3Loading
    || isWareTrademarksLoading
    || isWareStatusesLoading;

  console.log("SearchPage.tsx, foundWares: ", foundWares);
  console.log("SearchPage.tsx, foundBlogs: ", foundBlogs);
  console.log("SearchPage.tsx, foundWareCategories: ", foundWareCategories);
  console.log("SearchPage.tsx, foundTrademarks: ", foundTrademarks);
  console.log("SearchPage.tsx, foundWareStatuses: ", foundWareStatuses);
  return (

    <Layout headerType="header1" footerType='footer1'>
      <div className={styles.main}>
        {/* {allLoadings && <CircularProgress size={100} sx={{ display: "flex", margin: "0 auto" }} />} */}
        {allLoadings && <SkeletonPost />}
        <>
          {!allLoadings && <>
            <TabBar waresQuantity={foundWares.length} blogsQuantity={foundBlogs.length} activeTab={activeTab} setActiveTab={setActiveTab} query={query} />
            <SearchHeader foundWaresQuantity={foundWares.length}
              foundBlogsQuantity={foundBlogs.length}
              activeTab={activeTab}
              query={query}
              loading={!allLoadings} />
            {activeTab === "wares" && <FilterBar />}
            <div style={{ minHeight: "32px", margin: "16px 0" }}>
              <FilterStickerPanel />
            </div>
            {activeTab === "wares" && <WareGrid wares={foundWares || []} />}
            {activeTab === "blogs" && <ArticleGrid blogs={foundBlogs || []} />}
          </>}
          <FilterSidebar wares={wares || []} foundWares={foundWares || []}
            categories={foundWareCategories || []} trademarks={foundTrademarks || []}
            statuses={foundWareStatuses || []}
          />
          <SortingSidebar />
        </>
      </div>
    </Layout>

  );
}

