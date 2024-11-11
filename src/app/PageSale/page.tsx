"use client";
import { useSearchParams } from "next/navigation";
import Layout from "../sharedComponents/Layout";
import Sale from "./Sale";
import saleData from "./Sale.json";

export default function Home() {


  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get("id") : null; // Проверка на null

  console.log('Пришло в Sale', id);

  if (!id || isNaN(parseInt(id))) {
    return <div>Некорректный параметр ID</div>;
  }

  const sale = saleData.sale; // Данные о скидках

  const saleDataById = sale.find((s) => s.id === parseInt(id));

  console.log('Пришло2', sale);

  if (!saleDataById) {
    return <div>Акция не найдена</div>;
  }

  return (
    <Layout headerType="header1" footerType="footer1">
      <Sale saleData={saleDataById} /> {/* Передаем найденную акцию */}
    </Layout>
  );
}