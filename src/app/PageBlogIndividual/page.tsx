import Image from "next/image";
import styles from "./page.module.css";
import Layout from "../sharedComponents/Layout";
import BlogIndividual from "./BlogIndividual";
import individual from "./BlogIndividual.json";

export default function Home() {
  return (
    <Layout headerType="header1" footerType="footer1">
      <div>
        <BlogIndividual individualPage={individual.individual} />
      </div>
    </Layout>
  );
}
