import Layout from "../sharedComponents/Layout";
import FAQPage from "./jsx-FAQ/FAQPage";
import faq from "./FAQ.json";

export const metadata = {
  title: "Питання та відповіді", // Заголовок страницы
  description: "Сторінка з питаннями та відповідями."
};

export default function Home() {
  return (

    <Layout headerType="header1" footerType="footer3">
      <div>
        <FAQPage faqPage={faq.FAQ} /> {/* Клієнтський компонент сторінки з питаннями та відповідями */}
      </div>
    </Layout>

  );
}