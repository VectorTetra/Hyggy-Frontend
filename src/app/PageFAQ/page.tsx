import Image from "next/image";
import styles from "./page.module.css";
import Layout from "../sharedComponents/Layout";
import FAQPage from "./jsx-FAQ/FAQPage";
import faq from "./FAQ.json";

export default function Home() {
  return (
    <Layout headerType="header1" footerType="footer1">
      <div>
        <FAQPage faqPage={faq.FAQ} />
      </div>
    </Layout>
  );
}
