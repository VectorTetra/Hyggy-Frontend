import Layout from "../sharedComponents/Layout";
import BlogIndividual from "./BlogIndividual";
import individual from "./BlogIndividual.json";


export default function Home() {
  return (
    <Layout headerType="header1" footerType="footer1">
      <BlogIndividual individualPage={individual.individual} />
    </Layout>
  );
}
