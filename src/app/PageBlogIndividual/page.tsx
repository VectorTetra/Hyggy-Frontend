import Layout from "../sharedComponents/Layout";
import BlogIndividual from "./BlogIndividual";
import individual from "./BlogIndividual.json";


export default function Home() {

  const pageMetadata = {
    title: individual.individual.caption,
    description: "Робота в HYGGY",
  };

  return (
    <Layout headerType="header1" footerType="footer1" pageMetadata={pageMetadata}>
      <div>
        <BlogIndividual individualPage={individual.individual} />
      </div>
    </Layout>
  );
}
