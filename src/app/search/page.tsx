import SearchPage from "./tsx/SearchPage";
export default function Search() {
  return (
    <>
      <SearchPage />
    </>
  );
}

// app/search/page.tsx



// import { getWares } from "@/pages/api/WareApi";
// import SearchPage from "./tsx/SearchPage";
// import { getBlogs } from "@/pages/api/BlogApi";
// import { getWareCategories3 } from "@/pages/api/WareCategory3Api";
// import { getWareTrademarks } from "@/pages/api/WareTrademarkApi";
// import { getWareStatuses } from "@/pages/api/WareStatusApi";

// async function fetchInitialData(query: string) {
//   const [wares, blogs, categories, trademarks, statuses] = await Promise.all([
//     getWares({
//       SearchParameter: "Query",
//       QueryAny: query,
//       PageNumber: 1,
//       PageSize: 1000
//     }),
//     getBlogs({
//       SearchParameter: "Query",
//       QueryAny: query,
//       PageNumber: 1,
//       PageSize: 1000
//     }),
//     getWareCategories3({
//       SearchParameter: "Query",
//       QueryAny: query,
//       PageNumber: 1,
//       PageSize: 1000,
//       Sorting: "NameAsc"
//     }),
//     getWareTrademarks({
//       SearchParameter: "Query",
//       PageNumber: 1,
//       PageSize: 1000,
//       Sorting: "NameAsc"
//     }),
//     getWareStatuses({
//       SearchParameter: "Query",
//       PageNumber: 1,
//       PageSize: 1000,
//       Sorting: "NameAsc"
//     })
//   ]);

//   return { wares, blogs, categories, trademarks, statuses };
// }

// export default async function Search({ searchParams }: {
//   searchParams: {
//     query: string,
//     type: string,
//     f_0: string,  // price range
//     f_1: string,  // categories
//     f_2: string,  // trademarks
//     f_3: string,  // statuses
//     f_4: string,  // sale
//   }
// })
// {
//   const query = searchParams.query || "";
//   const initialData = await fetchInitialData(query);

//   return <SearchPage initialData={initialData} query={query} />;
// }

// getWares({
//   SearchParameter: "Query",
//   QueryAny: query,
//   MinPrice: minPrice,
//   MaxPrice: maxPrice,
//   StringCategory3Ids: categories?.join("|"),
//   StringTrademarkIds: trademarks?.join("|"),
//   StringStatusIds: statuses?.join("|"),
//   MinDiscount: sale ? 0.1 : null,
//   MaxDiscount: sale ? 100 : null,
//   PageNumber: 1,
//   PageSize: 1000,
// }),



// import { getWares } from "@/pages/api/WareApi";
// import { getBlogs } from "@/pages/api/BlogApi";
// import { getWareCategories3 } from "@/pages/api/WareCategory3Api";
// import { getWareTrademarks } from "@/pages/api/WareTrademarkApi";
// import { getWareStatuses } from "@/pages/api/WareStatusApi";
// import SearchPage from "./tsx/SearchPage";

// function parseSearchParams(searchParams: {
//   query?: string;
//   type?: string;
//   f_0?: string; // price range
//   f_1?: string; // categories
//   f_2?: string; // trademarks
//   f_3?: string; // statuses
//   f_4?: string; // sale
//   sort?: string;
// }) {
//   const query = searchParams.query || "";
//   const minPrice = searchParams.f_0 ? Number(searchParams.f_0.split("_")[0]) : null;
//   const maxPrice = searchParams.f_0 ? Number(searchParams.f_0.split("_")[1]) : null;
//   const categories = searchParams.f_1 ? JSON.parse(searchParams.f_1) : null;
//   const trademarks = searchParams.f_2 ? JSON.parse(searchParams.f_2) : null;
//   const statuses = searchParams.f_3 ? JSON.parse(searchParams.f_3) : null;
//   const sale = searchParams.f_4 ? true : false;
//   const sort = searchParams.sort || null;

//   return {
//     query,
//     minPrice,
//     maxPrice,
//     categories,
//     trademarks,
//     statuses,
//     sale,
//     sort,
//   };
// }

// async function fetchInitialData(params: ReturnType<typeof parseSearchParams>) {
//   const { query, minPrice, maxPrice, categories, trademarks, statuses, sale, sort } = params;

//   const [wares, blogs, categoriesData, trademarksData, statusesData] = await Promise.all([

//     getWares({
//       SearchParameter: "Query",
//       QueryAny: query,
//       PageNumber: 1,
//       PageSize: 1000
//     }),
//     getBlogs({
//       SearchParameter: "Query",
//       QueryAny: query,
//       PageNumber: 1,
//       PageSize: 1000,
//     }),
//     getWareCategories3({
//       SearchParameter: "Query",
//       QueryAny: query,
//       PageNumber: 1,
//       PageSize: 1000,
//       Sorting: "NameAsc",
//     }),
//     getWareTrademarks({
//       SearchParameter: "Query",
//       PageNumber: 1,
//       PageSize: 1000,
//       Sorting: "NameAsc",
//     }),
//     getWareStatuses({
//       SearchParameter: "Query",
//       PageNumber: 1,
//       PageSize: 1000,
//       Sorting: "NameAsc",
//     }),
//   ]);

//   return { wares, blogs, categories: categoriesData, trademarks: trademarksData, statuses: statusesData, sale, sort };
// }

// export default async function Search({ searchParams }: {
//   searchParams: {
//     query?: string;
//     type?: string;
//     f_0?: string;  // price range
//     f_1?: string;  // categories
//     f_2?: string;  // trademarks
//     f_3?: string;  // statuses
//     f_4?: string;  // sale
//     sort?: string;
//   };
// }) {
//   const parsedParams = parseSearchParams(searchParams);
//   const initialData = await fetchInitialData(parsedParams);

//   return <SearchPage initialData={initialData} query={parsedParams.query} />;
// }
