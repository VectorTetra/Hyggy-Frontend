"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Layout from "../sharedComponents/Layout";
import Sale from "./Sale";
import saleData from "./Sale.json";

export default function Home() {
  return (
    <Suspense fallback={<div>Завантаження...</div>}>
      <SalePage />
    </Suspense>
  );
}

function SalePage() {
  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get("id") : null; // Проверка на null

  if (!id || isNaN(parseInt(id))) {
    return <div>Некоректний параметр ID</div>;
  }

  const sale = saleData.sale; // Данные о скидках
  const saleDataById = sale.find((s) => s.id === parseInt(id));

  if (!saleDataById) {
    return <div>Акція не знайдена</div>;
  }

  return (
    <Layout headerType="header1" footerType="footer1">
      <Sale saleData={saleDataById} /> {/* Передаємо знайдену акцію */}
    </Layout>
  );
}
